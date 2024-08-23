import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import { LaunchRequestArguments } from "../hpccplatform/launchConfig";
import { checkTextDocument, checkWorkspace } from "./check";
import { selectCTVersion } from "./clientTools";
import { eclDiagnostic } from "./diagnostic";
import { sessionManager } from "../hpccplatform/session";
import { eclWatchPanelView } from "./eclWatchPanelView";
import { ECLResultNode, ECLWUNode } from "./eclWatchTree";
import localize from "../util/localize";
import { createDirectory, exists, writeFile } from "../util/fs";
import { ECLR_EN_US, matchTopics, SLR_EN_US } from "./docs";
import { SaveData } from "./saveData";

const IMPORT_MARKER = "//Import:";
const SKIP = localize("Skip");
const SKIP_ALL = localize("Skip All");
const OVERWRITE = localize("Overwrite");
const OVERWRITE_ALL = localize("Overwrite All");

export let eclCommands: ECLCommands;
export class ECLCommands {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntax", this.checkSyntax, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntaxAll", this.checkSyntaxAll, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntaxClear", this.checkSyntaxClear, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.submit", this.submit, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.submitNoArchive", this.submitNoArchive, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.compile", this.compile, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showLanguageReference", this.showLanguageReference, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showStandardLibraryReference", this.showStandardLibraryReference, this));
        ctx.subscriptions.push(vscode.commands.registerTextEditorCommand("ecl.searchTerm", this.searchTerm, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showWUDetails", this.showWUDetails, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.selectCTVersion", selectCTVersion));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.openECLWatchExternal", this.openECLWatchExternal, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.saveResultAs", this.saveResultAs, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.insertRecordDef", this.insertRecordDef, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.sign", this.sign, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.verify", this.verify, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.importModFile", this.importModFile, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.copyAsEclID", this.copyAsEclID, this));
    }

    static attach(ctx: vscode.ExtensionContext): ECLCommands {
        if (!eclCommands) {
            eclCommands = new ECLCommands(ctx);
        }
        return eclCommands;
    }

    checkSyntax() {
        if (vscode.window.activeTextEditor) {
            vscode.commands.executeCommand("workbench.panel.markers.view.focus");
            checkTextDocument(vscode.window.activeTextEditor.document, vscode.workspace.getConfiguration("ecl", vscode.window.activeTextEditor.document.uri));
        }
    }

    checkSyntaxAll() {
        if (vscode.workspace.workspaceFolders) {
            vscode.commands.executeCommand("workbench.panel.markers.view.focus");
            for (const wsf of vscode.workspace.workspaceFolders) {
                checkWorkspace(wsf);
            }
        }
    }

    checkSyntaxClear() {
        eclDiagnostic.clear();
    }

    submit() {
        if (vscode.window.activeTextEditor) {
            sessionManager.submit(vscode.window.activeTextEditor.document, "submit");
        }
    }

    submitNoArchive() {
        if (vscode.window.activeTextEditor) {
            sessionManager.submit(vscode.window.activeTextEditor.document, "submitNoArchive");
        }
    }

    compile() {
        if (vscode.window.activeTextEditor) {
            sessionManager.submit(vscode.window.activeTextEditor.document, "compile");
        }
    }

    showLanguageReference() {
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`${ECLR_EN_US}/index.html`));
    }

    showStandardLibraryReference() {
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`${SLR_EN_US}/index.html`));
    }

    async searchTerm(editor: vscode.TextEditor) {
        if (vscode.window.activeTextEditor) {
            const range = vscode.window.activeTextEditor.document.getWordRangeAtPosition(editor.selection.active);
            const searchTerm = editor.document.getText(range);
            const matches = await matchTopics(searchTerm);
            const picked = await vscode.window.showQuickPick(matches, { canPickMany: false });
            if (picked) {
                vscode.commands.executeCommand("vscode.open", picked.uri);
            }
        }
    }

    showWUDetails(launchRequestArgs: LaunchRequestArguments, wuid: string, result?: number) {
        eclWatchPanelView.navigateTo(launchRequestArgs, wuid, result);
    }

    openECLWatchExternal(source: ECLWUNode | ECLResultNode) {
        if (source instanceof ECLWUNode) {
            vscode.env.openExternal(vscode.Uri.parse(source.url));
        } else if (source instanceof ECLResultNode) {
            vscode.env.openExternal(vscode.Uri.parse(source.url));
        }
    }

    saveResultAs(source: ECLResultNode) {
        const saveData = new SaveData(source.getWU());
        saveData.saveResultAs(source.getResult());
    }

    async insertRecordDef() {
        if (vscode.window.activeTextEditor && sessionManager.session) {
            const editor = vscode.window.activeTextEditor;
            const position = editor.selection.active;
            let items = [];
            const dedup = {};
            const eclText = editor.document.getText();
            const re = /'(~.*)'| '(.*::.*)'/g;
            let m;
            do {
                m = re.exec(eclText);
                const found = m && (m[1] || m[2]);
                if (found && !dedup[found]) {
                    dedup[found] = true;
                    items.push(found);
                }
            } while (m);

            let lf = `...${localize("other")}...`;
            if (items.length > 0) {
                items = [`...${localize("other")}...`, ...items.sort()];
                lf = await vscode.window.showQuickPick(items, {
                    placeHolder: localize("Logical File")
                });
            }

            if (lf === `...${localize("other")}...`) {
                lf = await vscode.window.showInputBox({
                    prompt: localize("Logical File")
                });
            }

            if (lf) {
                sessionManager.session.fetchRecordDef(lf).then(ecl => {
                    editor.edit(editBuilder => {
                        editBuilder.insert(position, ecl);
                    });
                }).catch(e => {
                    vscode.window.showErrorMessage(e.message);
                });
            }
        }
    }

    sign() {
        if (vscode.window.activeTextEditor && sessionManager.session) {
            const editor = vscode.window.activeTextEditor;
            const eclText = editor.document.getText();
            sessionManager.session.digitalKeys().then(async keys => {
                if (keys.length === 0) {
                    vscode.window.showWarningMessage(localize("Environment has no code signing keys"));
                } else {
                    const key = await vscode.window.showQuickPick(keys, {
                        placeHolder: localize("Select code signing key")
                    });
                    if (key) {
                        const passphrase = await vscode.window.showInputBox({
                            prompt: localize("Enter passphrase for") + ` "${key}"`,
                            password: true
                        });
                        if (passphrase !== undefined) {
                            sessionManager.session.sign(key, passphrase, eclText).then(response => {
                                if (response.RetCode === 0) {
                                    editor.edit(editBuilder => {
                                        editBuilder.replace(new vscode.Range(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), response.SignedText);
                                    });
                                } else {
                                    vscode.window.showErrorMessage(localize("Signing failed") + `:  "${response.ErrMsg}"`);
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    verify() {
        if (vscode.window.activeTextEditor && sessionManager.session) {
            const editor = vscode.window.activeTextEditor;
            const eclText = editor.document.getText();
            sessionManager.session.verify(eclText).then(response => {
                if (response.IsVerified) {
                    vscode.window.showInformationMessage(localize("Verification succeeded, signed by") + `:  "${response.SignedBy}"`);
                } else {
                    vscode.window.showErrorMessage(localize("Verification failed"));
                }
            });
        }
    }

    async importModFile() {
        const dlgResponse = await vscode.window.showOpenDialog({ canSelectFolders: false, canSelectFiles: true, title: localize("Select '.mod' file to import"), filters: { "ECL .mod": ["mod"], "All Files": ["*"] } });
        if (dlgResponse && dlgResponse.length) {
            vscode.workspace.openTextDocument(dlgResponse[0].fsPath).then(async (document) => {
                let text = document.getText();
                text = text.split("\r\n").join("\n");
                text = text.split("\r").join("\n");

                let currID = "";
                const attrs: { [id: string]: string[] } = {};

                text.split("\n").forEach((line, idx) => {
                    if (line.toLowerCase().indexOf(IMPORT_MARKER.toLowerCase()) === 0) {
                        currID = line.substring(IMPORT_MARKER.length);
                        let i = 2;
                        let dupID = currID;
                        while (attrs[dupID] !== undefined) {
                            dupID = currID + ` (${i++})`;
                        }
                        currID = dupID;
                        attrs[currID] = [];
                    } else if (currID) {
                        attrs[currID].push(line);
                    }
                });

                const dlgResponse = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, title: localize("Select Target Folder for '.mod' file import") });
                if (dlgResponse && dlgResponse.length) {
                    const targetDir = dlgResponse[0].fsPath;

                    let skipAll = false;
                    let overwriteAll = false;
                    const items = Object.keys(attrs);
                    for (const item of items) {
                        let qualifiedID = item;
                        let ext = "ecl";

                        //  Check for file extension
                        let qualifiedIDParts = qualifiedID.split(":");
                        if (qualifiedIDParts.length > 1) {
                            qualifiedID = qualifiedIDParts[1];
                            ext = qualifiedIDParts[0];
                        }

                        //  Ensure folder exists
                        qualifiedIDParts = qualifiedID.split(".");
                        let folder = targetDir;
                        for (let i = 0; i < qualifiedIDParts.length - 1; ++i) {
                            folder = path.join(folder, qualifiedIDParts[i]);
                            if (!await exists(folder)) {
                                await createDirectory(folder);
                            }
                        }

                        const filePath = path.join(folder, `${qualifiedIDParts[qualifiedIDParts.length - 1]}.${ext}`);

                        //  Check if file already exists
                        let doWrite = true;
                        if (await exists(filePath)) {
                            if (skipAll) {
                                doWrite = false;
                            } else if (overwriteAll) {
                                doWrite = true;
                            } else {
                                switch (await vscode.window.showWarningMessage(localize("File already exists") + ` "${filePath}"`, SKIP, SKIP_ALL, OVERWRITE, OVERWRITE_ALL)) {
                                    case SKIP:
                                        doWrite = false;
                                        break;
                                    case SKIP_ALL:
                                        doWrite = false;
                                        skipAll = true;
                                        break;
                                    case OVERWRITE:
                                        doWrite = true;
                                        break;
                                    case OVERWRITE_ALL:
                                        doWrite = true;
                                        overwriteAll = true;
                                        break;
                                    default:
                                        doWrite = false;
                                }
                            }
                        }

                        //  Write File
                        if (doWrite) {
                            writeFile(filePath, attrs[item].join(os.EOL));
                        }
                    }
                }
            });
        }
    }

    copyAsEclID(file, files) {
        const ids: string[] = [];
        (Array.isArray(files) ? files : [file]).forEach(file => {
            let relPath = vscode.workspace.asRelativePath(file.path);
            relPath = relPath.replace(/\.[^/.]+$/, "");
            relPath = relPath.split("\\").join("/");
            ids.push(relPath.split("/").join("."));
        });
        if (ids.length) {
            vscode.env.clipboard.writeText(ids.join(os.EOL));
        }
    }
}

import * as vscode from "vscode";
import { LaunchRequestArguments } from "../hpccplatform/launchConfig";
import { checkTextDocument, checkWorkspace } from "./check";
import { selectCTVersion } from "./clientTools";
import { eclDiagnostic } from "./diagnostic";
import { sessionManager } from "../hpccplatform/session";
import { ECLResultNode, ECLWUNode } from "./eclWatchTree";

export let eclCommands: ECLCommands;
export class ECLCommands {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSubmit", this.submit));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntax", this.checkSyntax));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntaxAll", this.checkSyntaxAll));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntaxClear", this.checkSyntaxClear));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showLanguageReference", this.showLanguageReference));
        ctx.subscriptions.push(vscode.commands.registerTextEditorCommand("ecl.searchTerm", this.searchTerm));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.openECLWatch", this.openECLWatch));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.selectCTVersion", selectCTVersion));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.openECLWatchExternal", this.openECLWatchExternal));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.insertRecordDef", this.insertRecordDef));
    }

    static attach(ctx: vscode.ExtensionContext): ECLCommands {
        if (!eclCommands) {
            eclCommands = new ECLCommands(ctx);
        }
        return eclCommands;
    }

    checkSyntax() {
        if (vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.document.save();
            checkTextDocument(vscode.window.activeTextEditor.document, vscode.workspace.getConfiguration("ecl", vscode.window.activeTextEditor.document.uri));
        }
    }

    checkSyntaxAll() {
        if (vscode.workspace.workspaceFolders) {
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
            vscode.window.activeTextEditor.document.save();
            sessionManager.submit(vscode.window.activeTextEditor.document);
        }
    }

    showLanguageReference() {
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://hpccsystems.com/training/documentation/ecl-language-reference/html"));
    }

    searchTerm(editor: vscode.TextEditor) {
        if (vscode.window.activeTextEditor) {
            const range = vscode.window.activeTextEditor.document.getWordRangeAtPosition(editor.selection.active);
            const searchTerm = editor.document.getText(range);
            vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`https://hpccsystems.com/training/documentation/ecl-language-reference/html/${searchTerm}.html`));
        }
    }

    openECLWatch(launchRequestArgs: LaunchRequestArguments, title: string, wuid: string, result?: number) {

    }

    openECLWatchExternal(source: ECLWUNode | ECLResultNode) {
        if (source instanceof ECLWUNode) {
            vscode.env.openExternal(vscode.Uri.parse(source.url));
        } else if (source instanceof ECLResultNode) {
            vscode.env.openExternal(vscode.Uri.parse(source.url));
        }
    }

    async insertRecordDef() {
        if (vscode.window.activeTextEditor && sessionManager.session) {
            const editor = vscode.window.activeTextEditor;
            const position = editor.selection.active;
            const lf = await vscode.window.showInputBox({
                prompt: "Logical File"
            }) || "";
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
}

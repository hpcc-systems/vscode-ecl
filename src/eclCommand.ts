import * as opn from "opn";
import * as vscode from "vscode";
import { checkTextDocument, checkWorkspace } from "./eclCheck";
import { eclDiagnostic } from "./eclDiagnostic";
import { encodeLocation } from "./eclWatch";

export let eclCommands: ECLCommands;
export class ECLCommands {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.syntaxCheck", this.syntaxCheck));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.syntaxCheckAll", this.syntaxCheckAll));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.syntaxCheckClear", this.syntaxCheckClear));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showLanguageReference", this.showLanguageReference));
        ctx.subscriptions.push(vscode.commands.registerTextEditorCommand("ecl.searchTerm", this.searchTerm));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showECLWatch", this.showECLWatch));
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.openWUDetails", this.openWUDetails));
    }

    static attach(ctx: vscode.ExtensionContext): ECLCommands {
        if (!eclCommands) {
            eclCommands = new ECLCommands(ctx);
        }
        return eclCommands;
    }

    syntaxCheck() {
        if (vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.document.save();
            checkTextDocument(vscode.window.activeTextEditor.document, vscode.workspace.getConfiguration("ecl", vscode.window.activeTextEditor.document.uri));
        }
    }

    syntaxCheckAll() {
        if (vscode.workspace.workspaceFolders) {
            for (const wsf of vscode.workspace.workspaceFolders) {
                checkWorkspace(wsf);
            }
        }
    }

    syntaxCheckClear() {
        eclDiagnostic.clear();
    }

    showLanguageReference() {
        opn("https://hpccsystems.com/training/documentation/ecl-language-reference/html");
    }

    searchTerm(editor: vscode.TextEditor) {
        if (vscode.window.activeTextEditor) {
            const range = vscode.window.activeTextEditor.document.getWordRangeAtPosition(editor.selection.active);
            const searchTerm = editor.document.getText(range);
            opn(`https://hpccsystems.com/training/documentation/ecl-language-reference/html/${searchTerm}.html`);
        }
    }

    showECLWatch() {
        /*
        return vscode.commands.executeCommand("vscode.previewHtml", eclWatchUri, vscode.ViewColumn.Two, "ECL Watch").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
        */
    }

    openWUDetails(url: string, wuid: string) {
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        if (eclConfig.get<boolean>("WUOpenExternal")) {
            opn(url);
        } else {
            const uri = encodeLocation(url, wuid);
            return vscode.commands.executeCommand("vscode.previewHtml", uri, vscode.ViewColumn.Two, wuid).then((success) => {
            }, (reason) => {
                vscode.window.showErrorMessage(reason);
            });
        }
    }
}

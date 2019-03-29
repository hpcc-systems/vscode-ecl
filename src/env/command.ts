import * as vscode from "vscode";
import { checkTextDocument } from "./check";

export let envCommands: EnvCommands;
export class EnvCommands {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.commands.registerCommand("xml.syntaxCheck", () => this.syntaxCheck()));
    }

    static attach(ctx: vscode.ExtensionContext): EnvCommands {
        if (!envCommands) {
            envCommands = new EnvCommands(ctx);
        }
        return envCommands;
    }

    syntaxCheck() {
        if (vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.document.save();
            checkTextDocument(vscode.window.activeTextEditor.document, vscode.workspace.getConfiguration("ecl", vscode.window.activeTextEditor.document.uri));
        }
    }
}

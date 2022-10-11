import * as vscode from "vscode";
import { serializer } from "./serializer";

export let commands: Commands;
export class Commands {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;

        let publicCell: boolean = true;

        vscode.commands.executeCommand("setContext", "isPublic", publicCell);
        vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);

        vscode.commands.registerCommand("notebook.cell.public", (cell: vscode.NotebookCell) => {
            serializer.node(cell).shared = false;
            publicCell = false;
            vscode.commands.executeCommand("setContext", "isPublic", publicCell);
            vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);
        });

        vscode.commands.registerCommand("notebook.cell.private", (cell: vscode.NotebookCell) => {
            serializer.node(cell).shared = true;
            publicCell = true;
            vscode.commands.executeCommand("setContext", "isPublic", publicCell);
            vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);
        });

        vscode.window.onDidChangeActiveTextEditor(e => {
            vscode.commands.executeCommand("setContext", "cellLangId", e.document.languageId);
        });

    }

    static attach(ctx: vscode.ExtensionContext): Commands {
        if (!commands) {
            commands = new Commands(ctx);
        }
        return commands;
    }

}

import * as vscode from "vscode";
import { Controller } from "./controller";
import { Serializer } from "./serializer";

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(new Controller());
    ctx.subscriptions.push(vscode.workspace.registerNotebookSerializer("ecl-notebook", new Serializer()));

    let publicCell: boolean = true;

    vscode.commands.executeCommand("setContext", "isPublic", publicCell);
    vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);

    vscode.commands.registerCommand("notebook.cell.public", (cell: vscode.NotebookCell) => {
        // cell.metadata["private"] = true;
        publicCell = false;
        vscode.commands.executeCommand("setContext", "isPublic", publicCell);
        vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);
    });

    vscode.commands.registerCommand("notebook.cell.private", (cell: vscode.NotebookCell) => {
        // cell.metadata["private"] = false;
        publicCell = true;
        vscode.commands.executeCommand("setContext", "isPublic", publicCell);
        vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);
    });

    vscode.window.onDidChangeNotebookEditorSelection(evt => {
        for (let i = evt.notebookEditor.selection.start; i < evt.notebookEditor.selection.end; ++i) {
            const cell = evt.notebookEditor.notebook.cellAt(i);
            console.log(JSON.stringify(cell.metadata));
        }
    });
}

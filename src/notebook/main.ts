import * as vscode from "vscode";
import { Controller } from "./controller";
import { Serializer } from "./serializer";

export function activate(ctx: vscode.ExtensionContext) {
    const controller = new Controller();
    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(vscode.workspace.registerNotebookSerializer("ecl-notebook", new Serializer()));

    let publicCell: boolean = true;

    vscode.commands.executeCommand("setContext", "isPublic", publicCell);
    vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);

    vscode.commands.registerCommand("notebook.cell.public", (cell: vscode.NotebookCell) => {
        cell.metadata["custom"]["public"] = false;
        publicCell = false;
        vscode.commands.executeCommand("setContext", "isPublic", publicCell);
        vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);
    });

    vscode.commands.registerCommand("notebook.cell.private", (cell: vscode.NotebookCell) => {
        cell.metadata["custom"]["public"] = true;
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

    vscode.workspace.onDidChangeNotebookDocument(onDidChangeNotebookCells, undefined, ctx.subscriptions);
}

function onDidChangeNotebookCells(e: vscode.NotebookDocumentChangeEvent) {
    e.contentChanges.forEach(change => {
        change.addedCells.forEach(cell => {
            // const cellMetadata = getCellMetadata(cell);
            // const edit = new vscode.WorkspaceEdit();
            // // Don't edit the metadata directly, always get a clone (prevents accidental singletons and directly editing the objects).
            // const updatedMetadata: CellMetadata = { ...JSON.parse(JSON.stringify(cellMetadata || {})) };
            // edit.set(cell.notebook.uri, [vscode.NotebookEdit.updateCellMetadata(cell.index, { ...(cell.metadata), custom: updatedMetadata })]);
            // vscode.workspace.applyEdit(edit);
        });
    });
}

export interface CellMetadata {
    public: boolean;
}

function getCellMetadata(cell: vscode.NotebookCell | vscode.NotebookCellData) {
    return cell.metadata?.custom as CellMetadata | undefined;
}
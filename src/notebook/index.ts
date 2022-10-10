import * as vscode from "vscode";
import { Controller } from "./controller/controller";
import { Serializer } from "./controller/serializer";
import { Commands } from "./controller/command";

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.workspace.registerNotebookSerializer("ecl-notebook", new Serializer(), {
        transientOutputs: true
    }));
    ctx.subscriptions.push(new Controller());
    Commands.attach(ctx);

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
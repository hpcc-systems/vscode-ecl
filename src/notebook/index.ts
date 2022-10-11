import * as vscode from "vscode";
import { Controller } from "./controller/controller";
import { Serializer } from "./controller/serializer";
import { Commands } from "./controller/command";

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.workspace.registerNotebookSerializer("ecl-notebook", Serializer.attach(), {
        transientOutputs: false,
        transientDocumentMetadata: {
        }
    }));
    ctx.subscriptions.push(new Controller());
    Commands.attach(ctx);

    vscode.window.onDidChangeNotebookEditorSelection(evt => {
        for (const cell of evt.selections) {
        }
        // for (let i = evt.notebookEditor.selection.start; i < evt.notebookEditor.selection.end; ++i) {
        //     const cell = evt.notebookEditor.notebook.cellAt(i);
        //     console.log(JSON.stringify(cell.metadata));
        // }
    });

    vscode.workspace.onDidChangeNotebookDocument(onDidChangeNotebookCells, undefined, ctx.subscriptions);
}

function onDidChangeNotebookCells(evt: vscode.NotebookDocumentChangeEvent) {
    // e.contentChanges.forEach(change => {
    //     change.addedCells.forEach(cell => {
    //         // const cellMetadata = getCellMetadata(cell);
    //         // const edit = new vscode.WorkspaceEdit();
    //         // // Don't edit the metadata directly, always get a clone (prevents accidental singletons and directly editing the objects).
    //         // const updatedMetadata: CellMetadata = { ...JSON.parse(JSON.stringify(cellMetadata || {})) };
    //         // edit.set(cell.notebook.uri, [vscode.NotebookEdit.updateCellMetadata(cell.index, { ...(cell.metadata), custom: updatedMetadata })]);
    //         // vscode.workspace.applyEdit(edit);
    //     });
    // });
}

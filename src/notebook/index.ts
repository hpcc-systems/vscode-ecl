import * as vscode from "vscode";
import { Controller } from "./controller/controller";
import { Serializer } from "./controller/serializer";
import { Commands } from "./controller/command";
import { logActivation, logEvent } from "../telemetry";

export function activate(ctx: vscode.ExtensionContext) {
    logActivation("notebook.serializer", () => {
        ctx.subscriptions.push(vscode.workspace.registerNotebookSerializer("ecl-notebook", Serializer.attach(), {
            transientOutputs: false,
            transientDocumentMetadata: {
            }
        }));
    });
    logActivation("notebook.controller", () => {
        ctx.subscriptions.push(new Controller());
    });
    logActivation("notebook.commands", () => Commands.attach(ctx));

    vscode.workspace.onDidOpenNotebookDocument(nb => {
        if (nb.notebookType === "ecl-notebook") {
            logEvent("notebook.open", { type: nb.notebookType }, { cellCount: nb.cellCount });
        }
    }, undefined, ctx.subscriptions);

    vscode.workspace.onDidCloseNotebookDocument(nb => {
        if (nb.notebookType === "ecl-notebook") {
            logEvent("notebook.close", { type: nb.notebookType });
        }
    }, undefined, ctx.subscriptions);

    vscode.window.onDidChangeNotebookEditorSelection(evt => {
        for (const cell of evt.selections) {
        }
    });

    vscode.workspace.onDidChangeNotebookDocument(onDidChangeNotebookCells, undefined, ctx.subscriptions);
    logEvent("notebook.activated");
}

function onDidChangeNotebookCells(evt: vscode.NotebookDocumentChangeEvent) {
    let added = 0;
    let removed = 0;
    for (const change of evt.contentChanges) {
        added += change.addedCells?.length ?? 0;
        removed += change.removedCells?.length ?? 0;
    }
    if (added || removed) {
        logEvent("notebook.cells.changed", {}, { added, removed });
    }
}

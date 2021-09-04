import * as vscode from "vscode";
import { Controller } from "./controller";
import { Serializer } from "./serializer";

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.workspace.registerNotebookSerializer("ecl-notebook", new Serializer()));
    ctx.subscriptions.push(new Controller());
}

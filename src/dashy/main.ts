import * as vscode from "vscode";
import { DashyCommands } from "./command";

export function activate(ctx: vscode.ExtensionContext): void {
    DashyCommands.attach(ctx);
    // DashyDocumentContentProvider.attach(ctx);
}

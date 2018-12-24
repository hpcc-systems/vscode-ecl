import * as vscode from "vscode";
import { DashyCommands } from "./dashyCommand";

export function activate(ctx: vscode.ExtensionContext): void {
    DashyCommands.attach(ctx);
    // DashyDocumentContentProvider.attach(ctx);
}

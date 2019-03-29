import * as vscode from "vscode";
import { EnvCommands } from "./command";

export function activate(ctx: vscode.ExtensionContext): void {
    EnvCommands.attach(ctx);
}

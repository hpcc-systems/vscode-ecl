import * as vscode from "vscode";
import { Commands } from "./command";

export function activate(ctx: vscode.ExtensionContext): void {
    Commands.attach(ctx);
}

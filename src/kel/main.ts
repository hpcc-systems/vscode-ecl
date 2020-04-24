import * as vscode from "vscode";
import { Commands } from "./command";
import { Diagnostic } from "./diagnostic";
import { DocumentSymbolProvider } from "./documentSymbolProvider";
import { Editor } from "./editor";
import { StatusBar } from "./status";
import { locateClientTools } from "./clientTools";

export function activate(ctx: vscode.ExtensionContext): void {
    Diagnostic.attach(ctx);
    Commands.attach(ctx);
    Editor.attach(ctx);
    StatusBar.attach(ctx);
    DocumentSymbolProvider.attach(ctx);
    locateClientTools();
}

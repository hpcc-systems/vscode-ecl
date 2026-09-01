import * as vscode from "vscode";
import { Commands } from "./command";
import { Diagnostic } from "./diagnostic";
import { DocumentSymbolProvider } from "./documentSymbolProvider";
import { Editor } from "./editor";
import { StatusBar } from "./status";
import { locateClientTools } from "./clientTools";
import { logActivation, logEvent } from "../telemetry";

export function activate(ctx: vscode.ExtensionContext): void {
    logActivation("kel.Diagnostic", () => Diagnostic.attach(ctx));
    logActivation("kel.Commands", () => Commands.attach(ctx));
    logActivation("kel.Editor", () => Editor.attach(ctx));
    logActivation("kel.StatusBar", () => StatusBar.attach(ctx));
    logActivation("kel.DocumentSymbolProvider", () => DocumentSymbolProvider.attach(ctx));
    locateClientTools();
    logEvent("kel.activated");
}

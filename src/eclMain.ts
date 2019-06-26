import * as vscode from "vscode";
import { initLogger, Level } from "./util";

const eclConfig = vscode.workspace.getConfiguration("ecl");

initLogger(eclConfig.get<boolean>("debugLogging") ? Level.debug : Level.info);

export function activate(ctx: vscode.ExtensionContext): void {
    vscode.window.showErrorMessage(`This extension is no longer supported as it has been relocated to "hpcc-systems"`, "more info").then((m => {
        vscode.commands.executeCommand("vscode.open", vscode.Uri.parse("https://marketplace.visualstudio.com/items?itemName=GordonSmith.ecl"));
    }));
}

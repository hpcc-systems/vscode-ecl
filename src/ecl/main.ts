import * as vscode from "vscode";
import { ECLCommands } from "./command";
import { ECLDiagnostic } from "./diagnostic";
import { ECLDocumentSymbolProvider } from "./documentSymbolProvider";
import { ECLEditor } from "./editor";
import { ECLStatusBar } from "./status";
import { ECLTerminal } from "./terminal";
import { initLogger, Level } from "./util";
import { ECLWatchTree } from "./eclWatchTree";
import { ECLWatchPanelView } from "./eclWatchPanelView";
import { HPCCResources } from "./hpccResources";

const eclConfig = vscode.workspace.getConfiguration("ecl");
initLogger(eclConfig.get<boolean>("debugLogging") ? Level.debug : Level.info);

export function activate(ctx: vscode.ExtensionContext): void {
    ECLDiagnostic.attach(ctx);
    ECLCommands.attach(ctx);
    ECLEditor.attach(ctx);
    ECLStatusBar.attach(ctx);
    ECLDocumentSymbolProvider.attach(ctx);
    ECLWatchTree.attach(ctx);
    ECLWatchPanelView.attach(ctx);
    ECLTerminal.attach(ctx);
    HPCCResources.attach(ctx);
}

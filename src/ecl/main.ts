import * as vscode from "vscode";
import { scopedLogger } from "@hpcc-js/util";
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

const logger = scopedLogger("ecl/main.ts");

export function activate(ctx: vscode.ExtensionContext): void {
    logger.debug("Activating ECLDiagnostic");
    ECLDiagnostic.attach(ctx);
    logger.debug("Activating ECLCommands");
    ECLCommands.attach(ctx);
    logger.debug("Activating ECLEditor");
    ECLEditor.attach(ctx);
    logger.debug("Activating ECLStatusBar");
    ECLStatusBar.attach(ctx);
    logger.debug("Activating ECLDocumentSymbolProvider");
    ECLDocumentSymbolProvider.attach(ctx);
    logger.debug("Activating ECLWatchTree");
    ECLWatchTree.attach(ctx);
    logger.debug("Activating ECLWatchPanelView");
    ECLWatchPanelView.attach(ctx);
    logger.debug("Activating ECLTerminal");
    ECLTerminal.attach(ctx);
    logger.debug("Activating HPCCResources");
    HPCCResources.attach(ctx);
}

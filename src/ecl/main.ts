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
import { ECLChat } from "./lm/chat";
import { ECLLMTools } from "./lm/tools";
import { SessionManager } from "../hpccplatform/session";
import { logActivation, logEvent } from "../telemetry";

const eclConfig = vscode.workspace.getConfiguration("ecl");
initLogger(eclConfig.get<boolean>("debugLogging") ? Level.debug : Level.info);

const logger = scopedLogger("ecl/main.ts");

export function activate(ctx: vscode.ExtensionContext): void {
    logger.debug("Activating SessionManager");
    logActivation("ecl.SessionManager", () => SessionManager.attach(ctx));
    logger.debug("Activating ECLDiagnostic");
    logActivation("ecl.ECLDiagnostic", () => ECLDiagnostic.attach(ctx));
    logger.debug("Activating ECLCommands");
    logActivation("ecl.ECLCommands", () => ECLCommands.attach(ctx));
    logger.debug("Activating ECLEditor");
    logActivation("ecl.ECLEditor", () => ECLEditor.attach(ctx));
    logger.debug("Activating ECLStatusBar");
    logActivation("ecl.ECLStatusBar", () => ECLStatusBar.attach(ctx));
    logger.debug("Activating ECLDocumentSymbolProvider");
    logActivation("ecl.ECLDocumentSymbolProvider", () => ECLDocumentSymbolProvider.attach(ctx));
    logger.debug("Activating ECLWatchTree");
    logActivation("ecl.ECLWatchTree", () => ECLWatchTree.attach(ctx));
    logger.debug("Activating ECLWatchPanelView");
    logActivation("ecl.ECLWatchPanelView", () => ECLWatchPanelView.attach(ctx));
    logger.debug("Activating ECLTerminal");
    logActivation("ecl.ECLTerminal", () => ECLTerminal.attach(ctx));
    logger.debug("Activating HPCCResources");
    logActivation("ecl.HPCCResources", () => HPCCResources.attach(ctx));
    logger.debug("Activating Chat");
    logActivation("ecl.Chat", () => ECLChat.attach(ctx));
    logger.debug("Activating LM Tools");
    logActivation("ecl.LMTools", () => ECLLMTools.attach(ctx));
    logEvent("ecl.activated");
}

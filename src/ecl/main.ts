import * as vscode from "vscode";
import { ECLDiagnostic } from "../diagnostic";
import { ECLStatusBar } from "../status";
import { ECLCommands } from "./command";
import { ECLConfigurationProvider } from "./configProvider";
import { ECLDocumentSymbolProvider } from "./documentSymbolProvider";
import { ECLEditor } from "./editor";
import { ECLTree } from "./tree";
import { initLogger, Level } from "./util";
import { ECLWatch } from "./watch";

const eclConfig = vscode.workspace.getConfiguration("ecl");
initLogger(eclConfig.get<boolean>("debugLogging") ? Level.debug : Level.info);

export function activate(ctx: vscode.ExtensionContext): void {
    // ctx.subscriptions.push(vscode.languages.registerHoverProvider(ECL_MODE, new ECLHoverProvider()));
    // ctx.subscriptions.push(vscode.languages.registerReferenceProvider(ECL_MODE, new ECLReferenceProvider()));
    // ctx.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(ECL_MODE, new ECLDocumentFormattingEditProvider()));
    // ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ECL_MODE, new ECLDocumentSymbolProvider()));
    // ctx.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(new ECLWorkspaceSymbolProvider()));
    // ctx.subscriptions.push(vscode.languages.registerRenameProvider(ECL_MODE, new ECLRenameProvider()));
    // ctx.subscriptions.push(vscode.languages.registerSignatureHelpProvider(ECL_MODE, new ECLSignatureHelpProvider(), '(', ','));
    // ctx.subscriptions.push(vscode.languages.registerCodeActionsProvider(ECL_MODE, new EclCodeActionProvider()));

    ECLConfigurationProvider.attach(ctx);
    ECLDiagnostic.attach(ctx);
    ECLCommands.attach(ctx);
    ECLEditor.attach(ctx);
    ECLStatusBar.attach(ctx);
    ECLDocumentSymbolProvider.attach(ctx);
    ECLTree.attach(ctx);
    ECLWatch.attach(ctx);
}

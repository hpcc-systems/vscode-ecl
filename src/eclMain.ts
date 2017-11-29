import * as vscode from "vscode";
import { ECLCommands } from "./eclCommand";
import { ECLDiagnostic } from "./eclDiagnostic";
import { ECLEditor } from "./eclEditor";
import { ECLStatusBar } from "./eclStatus";
import { ECLTree } from "./eclTree";
import { ECLWatch } from "./eclWatch";
import { initLogger, Level } from "./util";

initLogger(Level.info);

export function activate(ctx: vscode.ExtensionContext): void {
    // ctx.subscriptions.push(vscode.languages.registerHoverProvider(ECL_MODE, new ECLHoverProvider()));
    // ctx.subscriptions.push(vscode.languages.registerReferenceProvider(ECL_MODE, new ECLReferenceProvider()));
    // ctx.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(ECL_MODE, new ECLDocumentFormattingEditProvider()));
    // ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ECL_MODE, new ECLDocumentSymbolProvider()));
    // ctx.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(new ECLWorkspaceSymbolProvider()));
    // ctx.subscriptions.push(vscode.languages.registerRenameProvider(ECL_MODE, new ECLRenameProvider()));
    // ctx.subscriptions.push(vscode.languages.registerSignatureHelpProvider(ECL_MODE, new ECLSignatureHelpProvider(), '(', ','));
    // ctx.subscriptions.push(vscode.languages.registerCodeActionsProvider(ECL_MODE, new EclCodeActionProvider()));

    ECLDiagnostic.attach(ctx);
    ECLCommands.attach(ctx);
    ECLEditor.attach(ctx);
    ECLStatusBar.attach(ctx);
    ECLTree.attach(ctx);
    ECLWatch.attach(ctx);
}

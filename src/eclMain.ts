import * as opn from "opn";
import * as vscode from "vscode";
import { checkTextDocument, diagnosticCollection } from "./eclCheck";
import { ECLDefinitionProvider } from "./eclDeclaration";
import { ECL_MODE } from "./eclMode";
import { showHideStatus } from "./eclStatus";
import { ECLCompletionItemProvider } from "./eclSuggest";
import { ECLWatchTextDocumentContentProvider, eclWatchUri } from "./ECLWatch";
import { initLogger, Level } from "./util";

initLogger(Level.info);

/*
import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
*/

export function activate(ctx: vscode.ExtensionContext): void {
    // ctx.subscriptions.push(vscode.languages.registerHoverProvider(ECL_MODE, new ECLHoverProvider()));
    ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(ECL_MODE, new ECLCompletionItemProvider(), ".", '\"'));
    ctx.subscriptions.push(vscode.languages.registerDefinitionProvider(ECL_MODE, new ECLDefinitionProvider()));
    // ctx.subscriptions.push(vscode.languages.registerReferenceProvider(ECL_MODE, new ECLReferenceProvider()));
    // ctx.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(ECL_MODE, new ECLDocumentFormattingEditProvider()));
    // ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ECL_MODE, new ECLDocumentSymbolProvider()));
    // ctx.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(new ECLWorkspaceSymbolProvider()));
    // ctx.subscriptions.push(vscode.languages.registerRenameProvider(ECL_MODE, new ECLRenameProvider()));
    // ctx.subscriptions.push(vscode.languages.registerSignatureHelpProvider(ECL_MODE, new ECLSignatureHelpProvider(), '(', ','));
    // ctx.subscriptions.push(vscode.languages.registerCodeActionsProvider(ECL_MODE, new EclCodeActionProvider()));

    ctx.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider("css-preview", new ECLWatchTextDocumentContentProvider()));

    diagnosticCollection(vscode.languages.createDiagnosticCollection("ecl"));
    ctx.subscriptions.push(diagnosticCollection());
    vscode.window.onDidChangeActiveTextEditor(showHideStatus, null, ctx.subscriptions);
    // vscode.window.onDidChangeActiveTextEditor(getCodeCoverage, null, ctx.subscriptions);

    startBuildOnSaveWatcher(ctx.subscriptions);

    ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntax", () => {
        if (vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.document.save();
            checkTextDocument(vscode.window.activeTextEditor.document, vscode.workspace.getConfiguration("ecl", vscode.window.activeTextEditor.document.uri));
        }
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showLanguageReference", () => {
        opn("https://hpccsystems.com/training/documentation/ecl-language-reference/html");
    }));

    ctx.subscriptions.push(vscode.commands.registerTextEditorCommand("ecl.searchTerm", (editor: vscode.TextEditor) => {
        if (vscode.window.activeTextEditor) {
            const range = vscode.window.activeTextEditor.document.getWordRangeAtPosition(editor.selection.active);
            const searchTerm = editor.document.getText(range);
            opn(`https://hpccsystems.com/training/documentation/ecl-language-reference/html/${searchTerm}.html`);
        }
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showECLWatch", () => {
        return vscode.commands.executeCommand("vscode.previewHtml", eclWatchUri, vscode.ViewColumn.Two, "ECL Watch").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    }));

    for (const te of vscode.window.visibleTextEditors) {
        checkTextDocument(te.document, vscode.workspace.getConfiguration("ecl", te.document.uri));
    }
    vscode.window.onDidChangeActiveTextEditor(event => {
        if (event && vscode.window.activeTextEditor) {
            checkTextDocument(event.document, vscode.workspace.getConfiguration("ecl", vscode.window.activeTextEditor.document.uri));
        }
    });
}

function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[]) {
    //  (VSCode.go)
    // TODO: This is really ugly.  I'm not sure we can do better until
    // Code supports a pre-save event where we can do the formatting before
    // the file is written to disk.
    const ignoreNextSave = new WeakSet<vscode.TextDocument>();

    vscode.workspace.onDidSaveTextDocument((document) => {
        if (document.languageId !== "ecl" || ignoreNextSave.has(document)) {
            return;
        }
        const eclConfig = vscode.workspace.getConfiguration("ecl", document.uri);
        if (vscode.window.activeTextEditor) {
            const formatPromise: PromiseLike<void> = Promise.resolve();
            if (eclConfig["formatOnSave"] && vscode.window.activeTextEditor.document === document) {
                //  TODO
            }
            formatPromise.then(() => {
                checkTextDocument(document, eclConfig);
            });
        }
    }, null, subscriptions);
}

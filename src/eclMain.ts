import * as opn from "opn";
import * as vscode from "vscode";
import { Level, logger, Writer } from "../hpcc-js-comms/src/util/logging";
import { check } from "./eclCheck";
import { ECLDefinitionProvider } from "./eclDeclaration";
import { ECL_MODE } from "./eclMode";
import { showHideStatus } from "./eclStatus";
import { ECLCompletionItemProvider } from "./eclSuggest";
import { ECLWatchTextDocumentContentProvider, eclWatchUri } from "./ECLWatch";

class VSCodeWriter implements Writer {
    eclOutputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("ECL");

    write(dateTime: string, level: Level, id: string, msg: string) {
        this.eclOutputChannel.appendLine(`[${dateTime}] ${Level[level].toUpperCase()} ${id}:  ${msg}`);
    }
}
logger.writer(new VSCodeWriter());

/*
import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
*/

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(ctx: vscode.ExtensionContext): void {
    const eclConfig = vscode.workspace.getConfiguration("ecl");
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

    diagnosticCollection = vscode.languages.createDiagnosticCollection("ecl");
    ctx.subscriptions.push(diagnosticCollection);
    vscode.window.onDidChangeActiveTextEditor(showHideStatus, null, ctx.subscriptions);
    // vscode.window.onDidChangeActiveTextEditor(getCodeCoverage, null, ctx.subscriptions);

    startBuildOnSaveWatcher(ctx.subscriptions);

    ctx.subscriptions.push(vscode.commands.registerCommand("ecl.checkSyntax", () => {
        vscode.window.activeTextEditor.document.save();
        runBuilds(vscode.window.activeTextEditor.document, eclConfig);
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showAllDocumentation", () => {
        opn("https://hpccsystems.com/download/documentation/all");
    }));

    ctx.subscriptions.push(vscode.commands.registerTextEditorCommand("ecl.searchTerm", (editor: vscode.TextEditor) => {
        const range = vscode.window.activeTextEditor.document.getWordRangeAtPosition(editor.selection.active);
        const searchTerm = editor.document.getText(range);
        opn("https://hpccsystems.com/search/node/" + searchTerm);
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand("ecl.showECLWatch", () => {
        return vscode.commands.executeCommand("vscode.previewHtml", eclWatchUri, vscode.ViewColumn.Two, "ECL Watch").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    }));

    if (vscode.window.activeTextEditor) {
        runBuilds(vscode.window.activeTextEditor.document, eclConfig);
    }
}

function runBuilds(document: vscode.TextDocument, eclConfig: vscode.WorkspaceConfiguration) {

    function mapSeverityToVSCodeSeverity(sev: string) {
        switch (sev) {
            case "error": return vscode.DiagnosticSeverity.Error;
            case "warning": return vscode.DiagnosticSeverity.Warning;
            default: return vscode.DiagnosticSeverity.Error;
        }
    }

    if (document.languageId !== "ecl") {
        return;
    }

    const uri = document.uri;
    check(uri.fsPath, eclConfig).then((errors) => {
        diagnosticCollection.clear();

        const diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();

        errors.forEach((error) => {
            const canonicalFile = vscode.Uri.file(error.filePath).toString();
            let startColumn = 0;
            let endColumn = 1;
            if (document && document.uri.toString() === canonicalFile) {
                const range = new vscode.Range(error.line - 1, 0, error.line - 1, document.lineAt(error.line - 1).range.end.character + 1);
                const text = document.getText(range);
                const [, leading, trailing] = /^(\s*).*(\s*)$/.exec(text);
                startColumn = leading.length;
                endColumn = text.length - trailing.length;
            }
            const range = new vscode.Range(error.line - 1, error.col, error.line - 1, error.col);
            const diagnostic = new vscode.Diagnostic(range, error.msg, mapSeverityToVSCodeSeverity(error.severity));
            let diagnostics = diagnosticMap.get(canonicalFile);
            if (!diagnostics) {
                diagnostics = [];
            }
            diagnostics.push(diagnostic);
            diagnosticMap.set(canonicalFile, diagnostics);
        });
        diagnosticMap.forEach((diags, file) => {
            diagnosticCollection.set(vscode.Uri.parse(file), diags);
        });
    }).catch((err) => {
        vscode.window.showInformationMessage("Error: " + err);
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
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        const textEditor = vscode.window.activeTextEditor;
        const formatPromise: PromiseLike<void> = Promise.resolve();
        if (eclConfig["formatOnSave"] && textEditor.document === document) {
            //  TODO
        }
        formatPromise.then(() => {
            runBuilds(document, eclConfig);
        });
    }, null, subscriptions);
}

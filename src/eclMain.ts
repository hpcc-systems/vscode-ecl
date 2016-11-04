'use strict';

import vscode = require('vscode');
import { check } from './eclCheck';
import { showHideStatus } from './eclStatus';
import { removeCodeCoverage } from './eclCover';
import { eclWatchUri, ECLWatchTextDocumentContentProvider } from './ECLWatch';

/*
import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
*/

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(ctx: vscode.ExtensionContext): void {

	// ctx.subscriptions.push(vscode.languages.registerHoverProvider(ECL_MODE, new ECLHoverProvider()));
	// ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(ECL_MODE, new ECLCompletionItemProvider(), '.', '\"'));
	// ctx.subscriptions.push(vscode.languages.registerDefinitionProvider(ECL_MODE, new ECLDefinitionProvider()));
	// ctx.subscriptions.push(vscode.languages.registerReferenceProvider(ECL_MODE, new ECLReferenceProvider()));
	// ctx.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(ECL_MODE, new ECLDocumentFormattingEditProvider()));
	// ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ECL_MODE, new ECLDocumentSymbolProvider()));
	// ctx.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(new ECLWorkspaceSymbolProvider()));
	// ctx.subscriptions.push(vscode.languages.registerRenameProvider(ECL_MODE, new ECLRenameProvider()));
	// ctx.subscriptions.push(vscode.languages.registerSignatureHelpProvider(ECL_MODE, new ECLSignatureHelpProvider(), '(', ','));
	// ctx.subscriptions.push(vscode.languages.registerCodeActionsProvider(ECL_MODE, new EclCodeActionProvider()));

	ctx.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('css-preview', new ECLWatchTextDocumentContentProvider()));

	diagnosticCollection = vscode.languages.createDiagnosticCollection('ecl');
	ctx.subscriptions.push(diagnosticCollection);
	vscode.workspace.onDidChangeTextDocument(removeCodeCoverage, null, ctx.subscriptions);
	vscode.window.onDidChangeActiveTextEditor(showHideStatus, null, ctx.subscriptions);
	// vscode.window.onDidChangeActiveTextEditor(getCodeCoverage, null, ctx.subscriptions);

	startBuildOnSaveWatcher(ctx.subscriptions);

	ctx.subscriptions.push(vscode.commands.registerCommand('ecl.checkSyntax', () => {
		let eclConfig = vscode.workspace.getConfiguration('ecl');
		vscode.window.activeTextEditor.document.save();
		runBuilds(vscode.window.activeTextEditor.document, eclConfig);
	}));

	ctx.subscriptions.push(vscode.commands.registerCommand('ecl.showECLWatch', () => {
		return vscode.commands.executeCommand('vscode.previewHtml', eclWatchUri, vscode.ViewColumn.Two, 'ECL Watch').then((success) => {

		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
	}));

	if (vscode.window.activeTextEditor) {
		let goConfig = vscode.workspace.getConfiguration('ecl');
		runBuilds(vscode.window.activeTextEditor.document, goConfig);
	}
}

function runBuilds(document: vscode.TextDocument, goConfig: vscode.WorkspaceConfiguration) {

	function mapSeverityToVSCodeSeverity(sev: string) {
		switch (sev) {
			case 'error': return vscode.DiagnosticSeverity.Error;
			case 'warning': return vscode.DiagnosticSeverity.Warning;
			default: return vscode.DiagnosticSeverity.Error;
		}
	}

	if (document.languageId !== 'ecl') {
		return;
	}

	let uri = document.uri;
	check(uri.fsPath, goConfig).then(errors => {
		diagnosticCollection.clear();

		let diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();

		errors.forEach(error => {
			let canonicalFile = vscode.Uri.file(error.file).toString();
			let startColumn = 0;
			let endColumn = 1;
			if (document && document.uri.toString() === canonicalFile) {
				let range = new vscode.Range(error.line - 1, 0, error.line - 1, document.lineAt(error.line - 1).range.end.character + 1);
				let text = document.getText(range);
				let [_, leading, trailing] = /^(\s*).*(\s*)$/.exec(text);
				startColumn = leading.length;
				endColumn = text.length - trailing.length;
			}
			let range = new vscode.Range(error.line - 1, error.col, error.line - 1, error.col);
			let diagnostic = new vscode.Diagnostic(range, error.msg, mapSeverityToVSCodeSeverity(error.severity));
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
	}).catch(err => {
		vscode.window.showInformationMessage('Error: ' + err);
	});
}

function startBuildOnSaveWatcher(subscriptions: vscode.Disposable[]) {
	//  (VSCode.go)
	// TODO: This is really ugly.  I'm not sure we can do better until
	// Code supports a pre-save event where we can do the formatting before
	// the file is written to disk.
	let ignoreNextSave = new WeakSet<vscode.TextDocument>();

	vscode.workspace.onDidSaveTextDocument(document => {
		if (document.languageId !== 'ecl' || ignoreNextSave.has(document)) {
			return;
		}
		let eclConfig = vscode.workspace.getConfiguration('ecl');
		let textEditor = vscode.window.activeTextEditor;
		let formatPromise: PromiseLike<void> = Promise.resolve();
		if (eclConfig['formatOnSave'] && textEditor.document === document) {
			//  TODO
		}
		formatPromise.then(() => {
			runBuilds(document, eclConfig);
		});
	}, null, subscriptions);

}

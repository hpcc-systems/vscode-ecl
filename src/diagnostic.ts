import * as vscode from "vscode";
import { checkTextDocument } from "./ecl/check";

let eclDiagnosticCollection: vscode.DiagnosticCollection;
let _diagnosticCache: { [key: string]: vscode.Diagnostic[] | undefined } = {};

export let eclDiagnostic: ECLDiagnostic;
export class ECLDiagnostic {
    _ctx: vscode.ExtensionContext;
    _activeTextEditor: vscode.Uri | undefined;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        eclDiagnosticCollection = vscode.languages.createDiagnosticCollection("ecl");
        ctx.subscriptions.push(eclDiagnosticCollection);

        vscode.workspace.onDidCloseTextDocument(event => {
            this.delete(event.uri);
        }, null, this._ctx.subscriptions);

        vscode.window.onDidChangeActiveTextEditor((event: vscode.TextEditor | undefined) => {
            if (event && event.document && this._activeTextEditor !== event.document.uri) {
                this._activeTextEditor = event.document.uri;
                if (_diagnosticCache[this._activeTextEditor.toString()]) {
                    eclDiagnosticCollection.set(this._activeTextEditor, _diagnosticCache[this._activeTextEditor.toString()]);
                } else {
                    const eclConfig = vscode.workspace.getConfiguration("ecl", event.document.uri);
                    if (eclConfig.get<boolean>("syntaxCheckOnLoad")) {
                        checkTextDocument(event.document, eclConfig);
                    }
                }
            }
        });
    }

    static attach(ctx: vscode.ExtensionContext): ECLDiagnostic {
        if (!eclDiagnostic) {
            eclDiagnostic = new ECLDiagnostic(ctx);
        }
        return eclDiagnostic;
    }

    clear() {
        eclDiagnosticCollection.clear();
        _diagnosticCache = {};
        delete this._activeTextEditor;
    }

    delete(uri: vscode.Uri) {
        _diagnosticCache[uri.toString()] = eclDiagnosticCollection.get(uri) || [];
        eclDiagnosticCollection.delete(uri);
    }

    set(uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) {
        _diagnosticCache[uri.toString()] = diagnostics;
        eclDiagnosticCollection.set(uri, diagnostics);
    }
}

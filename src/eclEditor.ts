import * as vscode from "vscode";
import { checkTextDocument } from "./eclCheck";
import { ECLDefinitionProvider } from "./eclDeclaration";
import { ECL_MODE } from "./eclMode";
import { ECLCompletionItemProvider } from "./eclSuggest";

let eclEditor: ECLEditor;
export class ECLEditor {
    _ctx: vscode.ExtensionContext;
    _completionProvider = new ECLCompletionItemProvider();
    _definitionProvider = new ECLDefinitionProvider();

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;

        this.visibleCheckSyntax();
        this.onSaveWatcher();
        this.onActiveWatcher();
        ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(ECL_MODE, this._completionProvider, ".", '\"'));
        ctx.subscriptions.push(vscode.languages.registerDefinitionProvider(ECL_MODE, this._definitionProvider));
    }

    static attach(ctx: vscode.ExtensionContext): ECLEditor {
        if (!eclEditor) {
            eclEditor = new ECLEditor(ctx);
        }
        return eclEditor;
    }

    visibleCheckSyntax() {
        for (const te of vscode.window.visibleTextEditors) {
            checkTextDocument(te.document, vscode.workspace.getConfiguration("ecl", te.document.uri));
        }
    }

    private _ignoreNextSave = new WeakSet<vscode.TextDocument>();
    onSaveWatcher() {
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (document.languageId !== "ecl" || this._ignoreNextSave.has(document)) {
                return;
            }
            if (vscode.window.activeTextEditor) {
                const eclConfig = vscode.workspace.getConfiguration("ecl", document.uri);
                const formatPromise: PromiseLike<void> = Promise.resolve();
                if (eclConfig["formatOnSave"] && vscode.window.activeTextEditor.document === document) {
                    //  TODO Auto Format  ---
                }
                formatPromise.then(() => {
                    checkTextDocument(document, eclConfig);
                });
            }
        }, null, this._ctx.subscriptions);
    }

    onActiveWatcher() {
        vscode.window.onDidChangeActiveTextEditor(event => {
            if (event && vscode.window.activeTextEditor) {
                checkTextDocument(event.document, vscode.workspace.getConfiguration("ecl", vscode.window.activeTextEditor.document.uri));
            }
        });
    }
}

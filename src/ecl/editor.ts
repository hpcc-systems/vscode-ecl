import * as vscode from "vscode";
import { checkTextDocument } from "./check";
import { ECLDefinitionProvider } from "./declaration";
import { ECL_MODE } from "../mode";
import { ECLCompletionItemProvider } from "./suggest";

let eclEditor: ECLEditor;
export class ECLEditor {
    _ctx: vscode.ExtensionContext;
    _completionProvider = new ECLCompletionItemProvider();
    _definitionProvider = new ECLDefinitionProvider();

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;

        this.onOpenWatcher();
        this.onSaveWatcher();
        ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(ECL_MODE, this._completionProvider, ".", '\"'));
        ctx.subscriptions.push(vscode.languages.registerDefinitionProvider(ECL_MODE, this._definitionProvider));
    }

    static attach(ctx: vscode.ExtensionContext): ECLEditor {
        if (!eclEditor) {
            eclEditor = new ECLEditor(ctx);
        }
        return eclEditor;
    }

    onOpenWatcher() {
        vscode.workspace.onDidOpenTextDocument((document) => {
            if (document.languageId !== "ecl" || this._ignoreNextSave.has(document)) {
                return;
            }
            const eclConfig = vscode.workspace.getConfiguration("ecl", document.uri);
            const formatPromise: PromiseLike<void> = Promise.resolve();
            if (eclConfig["syntaxCheckOnLoad"]) {
                formatPromise.then(() => {
                    checkTextDocument(document, eclConfig);
                });
            }
        }, null, this._ctx.subscriptions);
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
                if (eclConfig["syntaxCheckOnSave"]) {
                    formatPromise.then(() => {
                        checkTextDocument(document, eclConfig);
                    });
                }
            }
        }, null, this._ctx.subscriptions);
    }
}

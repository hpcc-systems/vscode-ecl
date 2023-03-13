import * as vscode from "vscode";
import { Commands } from "./command";

let kelEditor: Editor;
export class Editor {
    _ctx: vscode.ExtensionContext;
    _commands: Commands;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._commands = Commands.attach(ctx);

        this.onOpenWatcher();
        this.onSaveWatcher();
    }

    static attach(ctx: vscode.ExtensionContext): Editor {
        if (!kelEditor) {
            kelEditor = new Editor(ctx);
        }
        return kelEditor;
    }

    onOpenWatcher() {
        vscode.workspace.onDidOpenTextDocument(doc => {
            if (doc.languageId !== "kel" || this._ignoreNextSave.has(doc)) {
                return;
            }

            const kelConfig = vscode.workspace.getConfiguration("kel", doc.uri);
            if (!!kelConfig["syntaxCheckOnLoad"]) {
                this._commands.checkSyntax(doc);
            }
        });
    }

    private _ignoreNextSave = new WeakSet<vscode.TextDocument>();
    onSaveWatcher() {
        vscode.workspace.onDidSaveTextDocument(doc => {
            if (doc.languageId !== "kel" || this._ignoreNextSave.has(doc)) {
                return;
            }
            if (vscode.window.activeTextEditor) {
                const kelConfig = vscode.workspace.getConfiguration("kel", doc.uri);
                const formatPromise: PromiseLike<void> = Promise.resolve();
                if (kelConfig.get<boolean>("generateOnSave")) {
                    formatPromise.then(() => {
                        this._commands.generate(doc);
                    });
                } else if (kelConfig.get<boolean>("syntaxCheckOnSave")) {
                    formatPromise.then(() => {
                        this._commands.checkSyntax(doc);
                    });
                }
            }
        }, null, this._ctx.subscriptions);
    }
}

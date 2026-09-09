import * as vscode from "vscode";
import { scopedLogger } from "@hpcc-js/util";
import { Commands } from "./command";

const logger = scopedLogger("kel/editor.ts");

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
            logger.debug(`document-open: ${doc.uri.fsPath}, syntaxCheckOnLoad=${kelConfig.get<boolean>("syntaxCheckOnLoad")}`);
            if (kelConfig["syntaxCheckOnLoad"]) {
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
            logger.debug(`document-save: ${doc.uri.fsPath}`);
            if (vscode.window.activeTextEditor) {
                const kelConfig = vscode.workspace.getConfiguration("kel", doc.uri);
                logger.debug(`document-save-config: generateOnSave=${kelConfig.get<boolean>("generateOnSave")}, syntaxCheckOnSave=${kelConfig.get<boolean>("syntaxCheckOnSave")}`);
                const formatPromise: PromiseLike<void> = Promise.resolve();
                if (kelConfig.get<boolean>("generateOnSave")) {
                    logger.debug("document-save-action: generate");
                    formatPromise.then(() => {
                        this._commands.generate(doc);
                    });
                } else if (kelConfig.get<boolean>("syntaxCheckOnSave")) {
                    logger.debug("document-save-action: checkSyntax");
                    formatPromise.then(() => {
                        this._commands.checkSyntax(doc);
                    });
                } else {
                    logger.debug("document-save-action: none");
                }
            } else {
                logger.debug("document-save-action: skipped-no-active-editor");
            }
        }, null, this._ctx.subscriptions);
    }
}

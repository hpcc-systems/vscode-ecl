import * as vscode from "vscode";
import { ECL_MODE } from "./mode";

export let eclStatusBar: ECLStatusBar;
export class ECLStatusBar {
    _ctx: vscode.ExtensionContext;
    _statusBarEntry: vscode.StatusBarItem;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;

        this._statusBarEntry = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, Number.MIN_VALUE);

        this.onActiveWatcher();
    }

    static attach(ctx: vscode.ExtensionContext): ECLStatusBar {
        if (!eclStatusBar) {
            eclStatusBar = new ECLStatusBar(ctx);
        }
        return eclStatusBar;
    }

    onActiveWatcher() {
        vscode.window.onDidChangeActiveTextEditor(event => {
            if (event && vscode.window.activeTextEditor) {
                if (!this._statusBarEntry) {
                    return;
                }
                if (!vscode.window.activeTextEditor) {
                    this._statusBarEntry.hide();
                } else if (vscode.languages.match(ECL_MODE, vscode.window.activeTextEditor.document)) {
                    this._statusBarEntry.show();
                } else {
                    this._statusBarEntry.hide();
                }
            }
        }, null, this._ctx.subscriptions);
    }

    hideEclStatus() {
        if (this._statusBarEntry) {
            this._statusBarEntry.dispose();
            delete this._statusBarEntry;
        }
    }

    showEclStatus(message: string, tooltip?: string) {
        this._statusBarEntry.text = message;
        this._statusBarEntry.tooltip = tooltip;
        this._statusBarEntry.show();
    }
}

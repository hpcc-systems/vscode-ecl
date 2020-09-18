import { ExtensionContext, languages, StatusBarAlignment, StatusBarItem, window } from "vscode";
import { KEL_MODE } from "../mode";

export let kelStatusBar: StatusBar;
export class StatusBar {
    _ctx: ExtensionContext;
    _statusBarEntry: StatusBarItem;

    private constructor(ctx: ExtensionContext) {
        this._ctx = ctx;

        this._statusBarEntry = window.createStatusBarItem(StatusBarAlignment.Right, Number.MIN_VALUE);
        this._statusBarEntry.command = "kel.selectCTVersion";

        this.onActiveWatcher();
    }

    static attach(ctx: ExtensionContext): StatusBar {
        if (!kelStatusBar) {
            kelStatusBar = new StatusBar(ctx);
        }
        return kelStatusBar;
    }

    onActiveWatcher() {
        window.onDidChangeActiveTextEditor(event => {
            if (event && window.activeTextEditor) {
                if (!this._statusBarEntry) {
                    return;
                }
                if (!window.activeTextEditor) {
                    this._statusBarEntry.hide();
                } else if (languages.match(KEL_MODE, window.activeTextEditor.document)) {
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

    showKelStatus(message: string, tooltip?: string) {
        this._statusBarEntry.text = message;
        this._statusBarEntry.tooltip = tooltip;
        this._statusBarEntry.show();
    }
}

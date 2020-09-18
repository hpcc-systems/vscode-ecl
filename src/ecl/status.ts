import { ExtensionContext, languages, StatusBarAlignment, StatusBarItem, window } from "vscode";
import { ECL_MODE } from "../mode";

export let eclStatusBar: ECLStatusBar;
export class ECLStatusBar {
    _ctx: ExtensionContext;
    _statusBarEntry: StatusBarItem;

    private constructor(ctx: ExtensionContext) {
        this._ctx = ctx;

        this._statusBarEntry = window.createStatusBarItem(StatusBarAlignment.Right, Number.MIN_VALUE - 1);
        this._statusBarEntry.command = "ecl.selectCTVersion";

        this.monitor();
    }

    static attach(ctx: ExtensionContext): ECLStatusBar {
        if (!eclStatusBar) {
            eclStatusBar = new ECLStatusBar(ctx);
        }
        return eclStatusBar;
    }

    monitor() {
        window.onDidChangeActiveTextEditor(event => {
            if (event && window.activeTextEditor) {
                if (!this._statusBarEntry) {
                    return;
                }
                if (!window.activeTextEditor) {
                    this._statusBarEntry.hide();
                } else if (languages.match(ECL_MODE, window.activeTextEditor.document)) {
                    this._statusBarEntry.show();
                } else {
                    this._statusBarEntry.hide();
                }
            }
        }, null, this._ctx.subscriptions);
    }

    hideClientTools() {
        if (this._statusBarEntry) {
            this._statusBarEntry.dispose();
            delete this._statusBarEntry;
        }
    }

    showClientTools(message: string, tooltip?: string) {
        this._statusBarEntry.text = message;
        this._statusBarEntry.tooltip = tooltip;
        this._statusBarEntry.show();
    }
}

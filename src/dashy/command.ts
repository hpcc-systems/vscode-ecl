import * as vscode from "vscode";
import { ViewManager } from "./ViewManager";

export let dashyCommands: DashyCommands;
export class DashyCommands {
    _ctx: vscode.ExtensionContext;
    _viewManager: ViewManager;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._viewManager = ViewManager.attach(this._ctx);
        ctx.subscriptions.push(vscode.commands.registerCommand("dashy.view", () => this.view()));
        ctx.subscriptions.push(vscode.commands.registerCommand("dashy.edit", () => this.edit()));
    }

    static attach(ctx: vscode.ExtensionContext): DashyCommands {
        if (!dashyCommands) {
            dashyCommands = new DashyCommands(ctx);
        }
        return dashyCommands;
    }

    view() {
        if (ViewManager.checkDocument()) {
            ViewManager.view();
        }
    }

    edit() {
        if (ViewManager.checkDocument()) {
            ViewManager.edit();
        }
    }
}

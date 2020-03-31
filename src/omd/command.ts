import * as vscode from "vscode";
import { ViewManager } from "./ViewManager";

export let commands: Commands;
export class Commands {
    _ctx: vscode.ExtensionContext;
    _viewManager: ViewManager;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._viewManager = ViewManager.attach(this._ctx);
        ctx.subscriptions.push(vscode.commands.registerCommand("omd.view", () => this.view()));
        ctx.subscriptions.push(vscode.commands.registerCommand("omd.export", () => this.export()));
    }

    static attach(ctx: vscode.ExtensionContext): Commands {
        if (!commands) {
            commands = new Commands(ctx);
        }
        return commands;
    }

    view() {
        if (ViewManager.checkDocument()) {
            ViewManager.view();
        }
    }

    export() {
        if (ViewManager.checkDocument()) {
            ViewManager.export();
        }
    }
}

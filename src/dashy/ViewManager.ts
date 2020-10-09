import * as path from "path";
import * as vscode from "vscode";
import localize from "../util/localize";
import { View } from "./View";

let viewManager: ViewManager;
export class ViewManager {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
    }

    static attach(ctx: vscode.ExtensionContext) {
        if (!viewManager) {
            viewManager = new ViewManager(ctx);
        }
        return viewManager;
    }

    static checkDocument() {
        const isJson = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId.toLowerCase() === "json";
        const isDashy = vscode.window.activeTextEditor && path.extname(vscode.window.activeTextEditor.document.fileName).toLowerCase() === ".dashy";
        const retVal = isJson && isDashy;
        if (!retVal) {
            vscode.window.showInformationMessage(`${localize("Current document is not a 'Dashy' file")}.`);
        }
        return retVal;
    }

    static view() {
        if (ViewManager.checkDocument()) {
            if (viewManager.viewExists(vscode.window.activeTextEditor!.document.uri)) {
                viewManager.viewGet(vscode.window.activeTextEditor!.document.uri).reveal();
            } else {
                viewManager.viewCreate(vscode.window.activeTextEditor!.document);
            }
        }
    }

    static edit() {
        if (ViewManager.checkDocument()) {
            if (viewManager.editExists(vscode.window.activeTextEditor!.document.uri)) {
                viewManager.editGet(vscode.window.activeTextEditor!.document.uri).reveal();
            } else {
                viewManager.editCreate(vscode.window.activeTextEditor!.document);
            }
        }
    }

    private _views: { [id: string]: View } = {};
    private _edits: { [id: string]: View } = {};

    viewCreate(td: vscode.TextDocument) {
        this._views[td.uri.toString()] = new View(this._ctx, td);
    }

    viewExists(uri: vscode.Uri): boolean {
        return !!this._views[uri.toString()] && this._views[uri.toString()].exists();
    }

    viewGet(uri: vscode.Uri): View {
        return this._views[uri.toString()];
    }

    editCreate(td: vscode.TextDocument) {
        this._edits[td.uri.toString()] = new View(this._ctx, td, true);
    }

    editExists(uri: vscode.Uri): boolean {
        return !!this._edits[uri.toString()] && this._edits[uri.toString()].exists();
    }

    editGet(uri: vscode.Uri): View {
        return this._edits[uri.toString()];
    }
}

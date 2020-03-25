import * as path from "path";
import * as vscode from "vscode";
import { View } from "./View";
import * as fs from 'fs';

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
        const isEclMD = vscode.window.activeTextEditor && path.extname(vscode.window.activeTextEditor.document.fileName).toLowerCase() === ".omd";
        const retVal = isEclMD;
        if (!retVal) {
            vscode.window.showInformationMessage("Current document is not a 'ECL Markdown' file.");
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

    static export() {
        if (ViewManager.checkDocument()) {
            const uri: vscode.Uri = vscode.window.activeTextEditor!.document.uri;
            const htmlPath = uri.path.replace(".omd", ".html");
            vscode.window.showSaveDialog({ defaultUri: vscode.Uri.file(htmlPath), saveLabel: "Export to HTML" }).then(resource => {
                if (resource) {
                    const resourceParts = path.parse(resource.path);
                    const runtimePath = vscode.Uri.file(path.join(viewManager._ctx.extensionPath, "dist", "observable.js"));
                    const runtime = fs.readFileSync(runtimePath.fsPath, "utf8");
                    const md = vscode.window.activeTextEditor!.document.getText();
                    let html = View.html(".", md);
                    html = html.replace("const vscode = acquireVsCodeApi();", "");
                    html = html.replace(`"./observable.js"`, `"./${resourceParts.name}"`);
                    html = html.replace(".dev-observablehq--inspect", ".observablehq--inspect");
                    html = html.replace(".showValues(true)", "");
                    html = html.replace(`\
<span style="float:right">
<input type="checkbox" id="showValues" name="showValues" checked onclick='handleClick(this);' /><label for="showValues">Debug Values</label>
<input type="checkbox" id="showCode" name="showCode" onclick='handleClick(this);' /><label for="showCode">Show Code</label>
</span>\
`, "");
                    fs.writeFile(resource.fsPath, html, "utf8", () => { });
                    fs.writeFile(resource.fsPath.replace(".html", ".js"), runtime, "utf8", () => { });
                }
            });
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

import * as path from "path";
import * as vscode from "vscode";

function encode(str: string) {
    return str
        .split("`").join("\\`")
        .split("$").join("\\$")
        ;
}

export class View {

    _td: vscode.TextDocument;
    _edit: boolean;
    _panel: vscode.WebviewPanel;

    constructor(private _ctx: vscode.ExtensionContext, td: vscode.TextDocument, edit: boolean = false) {
        this._td = td;
        this._edit = edit;
        const baseName = path.basename(td.fileName);

        //  Monitor Document  ---
        vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document === this._td) {
                this.onChangeDocument(e.contentChanges);
            }
        });

        vscode.workspace.onDidSaveTextDocument(doc => {
            if (doc === this._td) {
                this.onSaveDocument();
            }
        });

        //  Create WebView  ---
        const localResourceRoots = [vscode.Uri.file(path.join(this._ctx.extensionPath, "dist"))];
        this._panel = vscode.window.createWebviewPanel(
            "omd",
            `Preview (${baseName})`,
            {
                viewColumn: vscode.ViewColumn.Beside,
                preserveFocus: true
            },
            {
                localResourceRoots,
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        //  Panel Events  ---
        this._panel.onDidDispose(() => {
            delete this._panel;
        }, null, this._ctx.subscriptions);

        this.onSaveDocument();
    }

    private _prevEclMD: string = "";
    onSaveDocument() {
        const omd = this._td.getText();
        if (!this._prevEclMD || this._prevEclMD !== omd) {
            this._prevEclMD = omd;
            this._panel.webview.html = this.getHtml(omd);
        }
    }

    onChangeDocument(changes: readonly vscode.TextDocumentContentChangeEvent[]) {
    }

    exists(): boolean {
        return !!this._panel;
    }

    reveal() {
        this._panel.reveal();
    }

    static html(md): string {

        return `\
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Observable MD</title>
    <link href="https://cdn.jsdelivr.net/npm/@hpcc-js/common/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@hpcc-js/loader/dist/index.min.js" type="text/javascript" charset="utf-8"></script>
    <script>
        var hpccLoader = window["@hpcc-js/loader"];
    </script>
    <style>
    body {
        padding:0px;
        margin:8px;
        background:white;
        color: black;
        overflow-x: auto!important;
        overflow-y: auto!important;
        max-width: 800px
    }
    </style>
</head>

<body onresize="doResize()">
    <div id="placeholder">
    </div>
    <script>
    var app;
    const vscode = acquireVsCodeApi();
    hpccLoader.amd().then(function (require) {
        require(["@hpcc-js/observable-md"], function (observableMod) {
            app = new observableMod.ObservableMD()
                .target("placeholder")
                .markdown(\`${encode(md)}\`)
            ;
            doResize();
        });
    });
    function doResize() {
        if (app) {
            app.resize().lazyRender();
        }
    }
</script>
</body>

</html>`;
    }

    getHtml(md: string): string {
        return View.html(md);
    }
}

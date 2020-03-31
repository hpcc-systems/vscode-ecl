import * as path from "path";
import * as vscode from "vscode";

function encode(str: string) {
    return str
        .split("`").join("\\`")
        .split("$").join("\\$")
        ;
}

export class View {
    private _distUri: vscode.Uri;
    _td: vscode.TextDocument;
    _edit: boolean;
    _panel: vscode.WebviewPanel;

    constructor(private _ctx: vscode.ExtensionContext, td: vscode.TextDocument, edit: boolean = false) {
        const dist = vscode.Uri.file(path.join(this._ctx.extensionPath, "dist"));
        this._distUri = dist.with({ scheme: "vscode-resource" });
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
            vscode.ViewColumn.Beside,
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

    onChangeDocument(changes: vscode.TextDocumentContentChangeEvent[]) {
    }

    exists(): boolean {
        return !!this._panel;
    }

    reveal() {
        this._panel.reveal();
    }

    static html(distUri, md): string {

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
        var paths = {
        }
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
    hpccLoader.amd("", true, paths).then(function (require) {
        require(["${distUri}/observable.js"], function (observableMod) {
            app = new observableMod.ObservableWidget()
                .target("placeholder")
                .showValues(true)
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
        return View.html(this._distUri, md);
    }

    getDashyHTML(ddl: string) {
        return `hpccMarshaller.Dashy.create("placeholder", ${ddl}).then(dashy => {
            app = dashy;
            var ec = dashy.elementContainer();
            var validate = ec.validate;
            ec.validate = function() {
                const retVal = validate.apply(this, arguments);
                vscode.postMessage({
                    command: "changed",
                    ddl: dashy.save()
                });
                return retVal;
            };
            vscode.postMessage({
                command: "loaded",
                ddl: dashy.save()
            });
        });`;
    }

    getDashboardHTML(ddl: string) {
        return `hpccMarshaller.Dashboard.create("placeholder", ${ddl}).then(dashboard => {
            app = dashboard;
        });`;
    }
}

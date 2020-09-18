import * as path from "path";
import * as vscode from "vscode";
import { updateWorkspace } from "./diff";

function tidy(ddl: string): string {
    try {
        return JSON.stringify(JSON.parse(ddl), undefined, 4);
    } catch (e) {
        return ddl;
    }
}

export class View {
    private _node_modulesUri: vscode.Uri;
    _td: vscode.TextDocument;
    _edit: boolean;
    _panel: vscode.WebviewPanel;

    private _formattedDDL: string = "";
    get _ddl(): string {
        return this._formattedDDL;
    }
    set _ddl(_: string) {
        this._formattedDDL = tidy(_);
    }

    constructor(private _ctx: vscode.ExtensionContext, td: vscode.TextDocument, edit: boolean = false) {
        const node_modules = vscode.Uri.file(path.join(this._ctx.extensionPath, "node_modules"));
        this._node_modulesUri = node_modules.with({ scheme: "vscode-resource" });
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
        const localResourceRoots = [vscode.Uri.file(path.join(this._ctx.extensionPath, "node_modules"))];
        const config = vscode.workspace.getConfiguration("dashy", this._td.uri);
        const localPath = config.get<string>("localPath");
        if (localPath) {
            localResourceRoots.push(vscode.Uri.file(localPath));
        }
        this._panel = vscode.window.createWebviewPanel(
            "dashy",
            `${this._edit ? "Edit" : "View"} (${baseName})`,
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

        //  WebView Events  ---
        this._panel.webview.onDidReceiveMessage(e => this.onWebView(e),
            undefined,
            this._ctx.subscriptions
        );

        this.onSaveDocument();
    }

    ddl() {
        return tidy(this._td.getText());
    }

    onSaveDocument() {
        const ddl = this.ddl();
        if (!this._ddl || this._ddl !== ddl) {
            this._ddl = ddl;
            this._panel.webview.html = this.getHtml(ddl);
        }
    }

    onChangeDocument(changes: readonly vscode.TextDocumentContentChangeEvent[]) {
    }

    onWebView(msg: any) {
        switch (msg.command) {
            case "loaded":
            case "changed":
                const ddl = JSON.stringify(msg.ddl, undefined, 4);
                if (this._ddl !== ddl) {
                    this._ddl = ddl;
                    updateWorkspace(this._td, ddl);
                }
                break;
        }
    }

    exists(): boolean {
        return !!this._panel;
    }

    reveal() {
        this._panel.reveal();
    }

    getHtml(ddl: string): string {
        return `<!doctype html>
        <html>

        <head>
        <meta charset="utf-8">
        <title>Dashy</title>
        ${this.getLibraryHTML()}
        <style>
        body {
            padding:0px;
            margin:8px;
            overflow:hidden;
            background:white;
            color: black;
        }

        #placeholder, .placeholder {
            position: absolute;
            left:8px;
            top:8px;
            right:8px;
            bottom:8px;
        }
        </style>
        </head>

        <body onresize="doResize()">
        <div id="placeholder">
        </div>
        <script>
        var app;
        require(["@hpcc-js/marshaller", "@hpcc-js/map"], (hpccMarshaller, hpccMap) => {
            const vscode = acquireVsCodeApi();
            hpccMap.topoJsonFolder("${this._node_modulesUri}/@hpcc-js/map/TopoJSON");
            ${this._edit ? this.getDashyHTML(ddl) : this.getDashboardHTML(ddl)}
        });
        function doResize() {
            if (app) {
                app.resize().lazyRender();
            }
        }
        window.addEventListener("message", function(event) {
            var message = event.data; // The JSON data our extension sent
            switch (message.command) {
                case 'ddl':
                    break;
                default:
                    console.warning("Unknown message:  " + message.command);
            }
        });
        </script>
        </body>

        </html>`;
    }

    getLibraryHTML(): string {
        const config = vscode.workspace.getConfiguration("dashy", this._td.uri);
        switch (config.get("libraryLocation")) {
            case "localPath":
                const localPath = vscode.Uri.file(config.get("localPath", `${this._node_modulesUri}/@hpcc-js`));
                const localPathUri = localPath.with({ scheme: "vscode-resource" });
                return `<link rel="stylesheet" href="${localPathUri}/common/font-awesome/css/font-awesome.min.css">
                    <script src="${localPathUri}/loader/dist/index.js" type="text/javascript" charset="utf-8"></script>
                    <script>
                        var hpccLoader = window["@hpcc-js/loader"];
                        var require = hpccLoader.dev();
                    </script>`;
            case "latest":
            default:
                return `<link rel="stylesheet" href="https://unpkg.com/@hpcc-js/common/font-awesome/css/font-awesome.min.css">
                    <script src="https://unpkg.com/@hpcc-js/loader" type="text/javascript" charset="utf-8"></script>
                    <script>
                        var hpccLoader = window["@hpcc-js/loader"];
                        var require = hpccLoader.unpkg();
                    </script>`;
        }
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

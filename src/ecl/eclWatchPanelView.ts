import * as vscode from "vscode";
import { send } from "@hpcc-js/comms";
import { hashSum } from "@hpcc-js/util";
import { LaunchRequestArguments } from "../debugger/launchRequestArguments";
import { wuDetailsUrl, wuResultUrl } from "../hpccplatform/launchConfig";
import { sessionManager } from "../hpccplatform/session";
import type { Messages } from "../eclwatch/messages";

interface NavigateParams extends LaunchRequestArguments {
    wuid: string;
    resultName?: string;
    show: boolean;
}

export let eclWatchPanelView: ECLWatchPanelView;
export class ECLWatchPanelView implements vscode.WebviewViewProvider {

    public static readonly viewType = "ecl.watch.lite";

    protected _ctx: vscode.ExtensionContext;
    private readonly _extensionUri: vscode.Uri;
    private _webviewView?: vscode.WebviewView;
    private _currParams: NavigateParams;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._extensionUri = this._ctx.extensionUri;

        ctx.subscriptions.push(vscode.window.registerWebviewViewProvider(ECLWatchPanelView.viewType, this, {
            webviewOptions: {
                retainContextWhenHidden: false
            }
        }));

        sessionManager.onDidChangeSession(launchRequestArgs => {
            this.navigateTo(launchRequestArgs, undefined, undefined, false);
        });

        vscode.commands.registerCommand("ecl.watch.lite.openECLWatchExternal", async () => {
            if (this._currParams) {
                if (this._currParams.resultName === undefined) {
                    vscode.env.openExternal(vscode.Uri.parse(wuDetailsUrl(this._currParams, this._currParams.wuid)));
                } else {
                    vscode.env.openExternal(vscode.Uri.parse(wuResultUrl(this._currParams, this._currParams.wuid, this._currParams.resultName)));
                }
            }
        });
    }

    static attach(ctx: vscode.ExtensionContext): ECLWatchPanelView {
        if (!eclWatchPanelView) {
            eclWatchPanelView = new ECLWatchPanelView(ctx);
        }
        return eclWatchPanelView;
    }

    private _initialParams: NavigateParams;
    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<any>, _token: vscode.CancellationToken) {
        if (this._webviewView === undefined) {

            const handle = webviewView.onDidDispose(() => {
                delete this._webviewView;
                handle.dispose();
            });

        }
        this._webviewView = webviewView;
        this._webviewView.webview.options = {
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        const abortControllers: { [id: number]: AbortController } = {};
        this._webviewView.webview.onDidReceiveMessage((message: Messages) => {
            switch (message.command) {
                case "loaded":
                    if (this._initialParams) {
                        this.navigateTo(this._initialParams, this._initialParams.wuid, this._initialParams.resultName, this._initialParams.show);
                        delete this._initialParams;
                    } else {
                        this._webviewView.title = this._currParams?.wuid;
                        vscode.commands.executeCommand("setContext", "ecl.watch.lite.hasWuid", !!this._currParams?.wuid);
                    }
                    break;
                case "proxySend":
                    if (message.canAbort) {
                        abortControllers[message.id] = new AbortController();
                        message.params.request.abortSignal_ = abortControllers[message.id].signal;
                    }
                    send(message.params.opts, message.params.action, message.params.request, message.params.responseType, message.params.header).then(response => {
                        this._webviewView.webview.postMessage({
                            command: "proxyResponse",
                            id: message.id,
                            response
                        } as Messages);
                        delete abortControllers[message.id];
                    });
                    break;
                case "proxyCancel":
                    abortControllers[message.id]?.abort();
                    break;
            }
        });

        if (!this._initialParams && context.state) {
            this._initialParams = context.state;
            this._currParams = context.state;
        }

        this._webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _prevHash: string;
    navigateTo(launchRequestArgs: LaunchRequestArguments, wuid: string, resultName?: string, show = true) {
        const { protocol, serverAddress, port, path, user, password, rejectUnauthorized, name, type, targetCluster } = launchRequestArgs;
        this._currParams = { protocol, serverAddress, port, path, user, password, rejectUnauthorized, name, type, targetCluster, wuid, resultName, show };
        if (!this._webviewView) {
            this._initialParams = this._currParams;
            if (show) {
                vscode.commands.executeCommand("ecl.watch.lite.focus");
            }
        } else {
            const hash = hashSum(this._currParams);
            if (this._prevHash !== hash) {
                this._prevHash = hash;
                this._webviewView.title = this._currParams?.wuid;
                this._webviewView.webview.postMessage({
                    command: "navigate",
                    data: {
                        baseUrl: this._currParams.protocol + "://" + this._currParams.serverAddress + ":" + this._currParams.port + "/",
                        userID: this._currParams.user,
                        password: this._currParams.password,
                        rejectUnauthorized: this._currParams.rejectUnauthorized,
                        timeoutSecs: this._currParams.timeoutSecs,
                        wuid: this._currParams.wuid,
                        result: this._currParams.resultName
                    }
                } as Messages);
                if (show) {
                    this._webviewView.show(true);
                }
                vscode.commands.executeCommand("setContext", "ecl.watch.lite.hasWuid", !!this._currParams?.wuid);
            }
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "dist", "eclwatch.js"));
        const stylesheetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "dist", "eclwatch.css"));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `\
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>HPCC</title>
    <style>
        body {
            padding:0px; 
            margin:0px; 
        }
       
        body.vscode-light {
        }
        
        body.vscode-dark {
        }
        
        body.vscode-high-contrast {
        }    

        #placeholder, .placeholder {
            position: absolute;
            left:4px;
            top:4px;
            right:4px;
            bottom:4px;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="${stylesheetUri}">
</head>

<body>
    <div id="placeholder"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>

</html>
`;
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
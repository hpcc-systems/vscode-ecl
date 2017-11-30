import * as vscode from "vscode";

let eclWatch: ECLWatch;
export class ECLWatch {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(Provider.scheme, new Provider()));
        vscode.debug.onDidReceiveDebugSessionCustomEvent(event => {
            switch (event.event) {
                case "WUCreated":
                    break;
            }
        }, null, this._ctx.subscriptions);
    }

    static attach(ctx: vscode.ExtensionContext): ECLWatch {
        if (!eclWatch) {
            eclWatch = new ECLWatch(ctx);
        }
        return eclWatch;
    }
}

export class Provider implements vscode.TextDocumentContentProvider {

    static scheme = "wu-details";

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const params: [string, string] = decodeLocation(uri);
        return `
        <html>
        <header>
            <title>${params[1]}</title>
            <style>
            body {
                padding:0px;
                margin:0px;
                overflow:hidden;
            }
            iframe {
                    width:100%;
                    height: 100vh;
            }
            </style>
        </header>
        <body>
        <iframe src="${params[0]}" title="iframe example 1" width="400" height="300">
        <p>Your browser does not support iframes.</p>
        </iframe>
        </body>
        </html>
      `;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }
}

export function encodeLocation(url: string, wuid: string): vscode.Uri {
    const query = JSON.stringify([url, wuid]);
    return vscode.Uri.parse(`${Provider.scheme}:target?${query}`);
}

export function decodeLocation(uri: vscode.Uri): [string, string] {
    const [url, wuid] = JSON.parse(uri.query) as [string, string];
    return [url, wuid];
}

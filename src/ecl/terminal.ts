import * as vscode from "vscode";
import { locateClientTools } from "./clientTools";

let eclTerminal: ECLTerminal;
export class ECLTerminal {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.createTerminal", () => {
            locateClientTools().then(clientTools => {
                return Promise.all([clientTools.version(), Promise.resolve((clientTools as any).binPath)]);
            }).then(([ver, path]) => {
                const terminal = vscode.window.createTerminal({
                    name: `ECL v${ver.major}.${ver.minor}.${ver.patch}`,
                    env: {
                        PATH: `${path};${process.env.PATH}`
                    }
                });
                terminal.show();
            });
        }));
    }

    static attach(ctx: vscode.ExtensionContext): ECLTerminal {
        if (!eclTerminal) {
            eclTerminal = new ECLTerminal(ctx);
        }
        return eclTerminal;
    }
}

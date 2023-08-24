import { ClientTools } from "@hpcc-js/comms";
import * as vscode from "vscode";
import * as os from "os";
import { sessionManager } from "../hpccplatform/session";

const PATH_SEP = os.platform() === "win32" ? ";" : ":";

export function eclTerminal(ct: ClientTools) {
    const ver = ct.versionSync();
    const terminal = vscode.window.createTerminal({
        name: `ECL v${ver.major}.${ver.minor}.${ver.patch}`,
        env: {
            PATH: `${ct.binPath}${PATH_SEP}${process.env.PATH}`
        }
    });
    terminal.show();
}

let g_eclTerminal: ECLTerminal;
export class ECLTerminal {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.commands.registerCommand("ecl.createTerminal", () => {
            sessionManager.bestClientTools().then(clientTools => {
                return clientTools.version().then(() => clientTools);
            }).then((clientTools) => {
                eclTerminal(clientTools);
            });
        }));
    }

    static attach(ctx: vscode.ExtensionContext): ECLTerminal {
        if (!g_eclTerminal) {
            g_eclTerminal = new ECLTerminal(ctx);
        }
        return g_eclTerminal;
    }
}

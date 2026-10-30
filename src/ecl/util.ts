import { Level, logger, Writer } from "@hpcc-js/util";
import * as vscode from "vscode";
import { Version } from "@hpcc-js/comms";
import { sessionManager } from "../hpccplatform/session";

export function byteOffsetAt(document: vscode.TextDocument, position: vscode.Position): number {
    const offset = document.offsetAt(position);
    const text = document.getText();
    let byteOffset = 0;
    for (let i = 0; i < offset; i++) {
        const clen = Buffer.byteLength(text[i]);
        byteOffset += clen;
    }
    return byteOffset;
}

class VSCodeWriter implements Writer {
    private _eclOutputChannel?: vscode.OutputChannel;

    //  Created at activation - creating a channel lazily during extension host shutdown leaks disposables
    constructor(ctx: vscode.ExtensionContext) {
        this._eclOutputChannel = vscode.window.createOutputChannel("ECL");
        ctx.subscriptions.push({
            dispose: () => {
                this._eclOutputChannel?.dispose();
                this._eclOutputChannel = undefined;
            }
        });
    }

    write(dateTime: string, level: Level, id: string, msg: string) {
        this._eclOutputChannel?.appendLine(`[${dateTime}] ${Level[level].toUpperCase()} ${id}:  ${msg}`);
    }
}

export { Level };
export function initLogger(ctx: vscode.ExtensionContext, level: Level) {
    logger.writer(new VSCodeWriter(ctx));
    logger.level(level);
}

const STUB_HTML_VERSION = new Version("10.8.0");

export async function stubPage(): Promise<string> {
    const build = await sessionManager.session?.fetchBuild().catch(() => undefined);
    const version = new Version(build ?? "");
    return version.exists() && version.compare(STUB_HTML_VERSION) < 0 ? "stub.htm" : "stub.html";
}

export async function formatECLWatchURL(baseUrl: string): Promise<string> {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${await stubPage()}?Widget=HPCCPlatformWidget`;
    } else {
        return `${baseUrl}esp/files/index.html#/activities`;
    }
}

export async function formatWorkunitURL(baseUrl: string, wuid: string): Promise<string> {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${await stubPage()}?Wuid=${wuid}&Widget=WUDetailsWidget#/stub/Summary`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}`;
    }
}

export async function formatResultsURL(baseUrl: string, wuid: string): Promise<string> {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${await stubPage()}?Wuid=${wuid}&Widget=ResultsWidget#/stub/Grid`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/outputs`;
    }
}

export async function formatMetricsURL(baseUrl: string, wuid: string): Promise<string> {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${await stubPage()}?Wuid=${wuid}&Widget=GraphsWUWidget#/stub/Grid`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/metrics`;
    }
}

export async function formatResultURL(baseUrl: string, wuid: string, name: string): Promise<string> {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${await stubPage()}?Wuid=${wuid}&Name=${name}&Widget=ResultWidget`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/outputs/${name}`;
    }
}

export async function formatLogicalFileURL(baseUrl: string, name: string, nodeGroup?: string): Promise<string> {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${await stubPage()}?Widget=LFDetailsWidget&Name=${encodeURIComponent(name)}${nodeGroup ? `&NodeGroup=${encodeURIComponent(nodeGroup)}` : ""}#/stub/Summary`;
    } else {
        return `${baseUrl}esp/files/index.html#/files/${nodeGroup ? `${encodeURI(nodeGroup)}/` : ""}${encodeURI(name)}`;
    }
}

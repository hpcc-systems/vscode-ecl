import { Level, logger, Writer } from "@hpcc-js/util";
import * as vscode from "vscode";

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

const legacyStubPlatforms = new Map<string, boolean>();

function normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.replace(/\/+$/, "").toLowerCase();
}

export function setLegacyStub(baseUrl: string, legacy: boolean) {
    legacyStubPlatforms.set(normalizeBaseUrl(baseUrl), legacy);
}

//  Defaults to "stub.html" when the platform version is unknown
export function stubPage(baseUrl: string): string {
    return legacyStubPlatforms.get(normalizeBaseUrl(baseUrl)) ? "stub.htm" : "stub.html";
}

export function formatECLWatchURL(baseUrl: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${stubPage(baseUrl)}`;
    } else {
        return `${baseUrl}esp/files/index.html`;
    }
}

export function formatWorkunitURL(baseUrl: string, wuid: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${stubPage(baseUrl)}?Wuid=${wuid}&Widget=WUDetailsWidget#/stub/Summary`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}`;
    }
}

export function formatResultsURL(baseUrl: string, wuid: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${stubPage(baseUrl)}?Wuid=${wuid}&Widget=ResultsWidget#/stub/Grid`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/outputs`;
    }
}

export function formatMetricsURL(baseUrl: string, wuid: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${stubPage(baseUrl)}?Wuid=${wuid}&Widget=GraphsWUWidget#/stub/Grid`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/metrics`;
    }
}

export function formatResultURL(baseUrl: string, wuid: string, name: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl", null);
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/${stubPage(baseUrl)}?Wuid=${wuid}&Name=${name}&Widget=ResultWidget`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/outputs/${name}`;
    }
}

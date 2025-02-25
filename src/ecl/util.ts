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
    eclOutputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("ECL");

    write(dateTime: string, level: Level, id: string, msg: string) {
        this.eclOutputChannel.appendLine(`[${dateTime}] ${Level[level].toUpperCase()} ${id}:  ${msg}`);
    }
}

export { Level };
export function initLogger(level: Level) {
    logger.writer(new VSCodeWriter());
    logger.level(level);
}

export function formatECLWatchURL(baseUrl: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl");
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/stub.htm`;
    } else {
        return `${baseUrl}esp/files/index.html`;
    }
}

export function formatWorkunitURL(baseUrl: string, wuid: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl");
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/stub.htm?Wuid=${wuid}&Widget=WUDetailsWidget#/stub/Summary`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}`;
    }
}

export function formatResultsURL(baseUrl: string, wuid: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl");
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/stub.htm?Wuid=${wuid}&Widget=ResultsWidget#/stub/Grid`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/outputs`;
    }
}

export function formatMetricsURL(baseUrl: string, wuid: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl");
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/stub.htm?Wuid=${wuid}&Widget=GraphsWUWidget#/stub/Grid`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/metrics`;
    }
}

export function formatResultURL(baseUrl: string, wuid: string, name: string): string {
    const eclConfig = vscode.workspace.getConfiguration("ecl");
    if (eclConfig.get("preferredECLWatch") === "v5") {
        return `${baseUrl}esp/files/stub.htm?Wuid=${wuid}&Name=${name}&Widget=ResultWidget`;
    } else {
        return `${baseUrl}esp/files/index.html#/workunits/${wuid}/outputs/${name}`;
    }
}

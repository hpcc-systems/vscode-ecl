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

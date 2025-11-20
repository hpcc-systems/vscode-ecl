import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel | undefined;

function channel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("ECL LM Tools", { log: true });
    }
    return outputChannel;
}

export function logToolEvent(tool: string, message: string, details: Record<string, unknown> = {}): void {
    const timestamp = new Date().toISOString();
    let serialized = "";
    if (details && Object.keys(details).length > 0) {
        try {
            serialized = ` ${JSON.stringify(details)}`;
        } catch {
            serialized = " {\"error\":\"Unable to serialize details\"}";
        }
    }
    channel().appendLine(`[${timestamp}] [${tool}] ${message}${serialized}`);
}

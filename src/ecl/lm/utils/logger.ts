import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel | undefined;

export function initToolLogger(ctx: vscode.ExtensionContext): void {
    if (outputChannel) return;
    outputChannel = vscode.window.createOutputChannel("ECL LM Tools", { log: true });
    ctx.subscriptions.push({
        dispose: () => {
            outputChannel?.dispose();
            outputChannel = undefined;
        }
    });
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
    outputChannel?.appendLine(`[${timestamp}] [${tool}] ${message}${serialized}`);
}

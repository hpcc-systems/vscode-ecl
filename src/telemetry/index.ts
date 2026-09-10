import * as vscode from "vscode";
import { TelemetryReporter } from "@vscode/extension-telemetry";

// telemetry reporter
export let reporter: TelemetryReporter;

export function activate(context: vscode.ExtensionContext): void {
    reporter = new TelemetryReporter("b785b2bb-e170-421b-8bd8-baaf895fe88b");
    context.subscriptions.push(reporter);

    reporter.sendTelemetryEvent("activate");
}

export function deactivate(): void {
    //  Telemetry sent during shutdown cannot complete - the sender and its log channel are torn down mid-flight
}

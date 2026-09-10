import * as vscode from "vscode";
import { initialize } from "./util/localize";
import { activate as telemetryActivate, deactivate as telemetryDeactivate, reporter } from "./telemetry";
import { activate as notebookActivate } from "./notebook";
import { CredentialManager } from "./util/credentialManager";
import { checkForUpgrade } from "./util/versionNotification";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    performance.mark("extension-start");
    telemetryActivate(context);
    CredentialManager.attach(context);
    notebookActivate(context);
    await initialize();
    checkForUpgrade(context).catch(e => console.error(`checkForUpgrade failed:  ${e?.message ?? e}`));
    await Promise.all([
        import("./ecl/main.js").then(({ activate }) => activate(context)),
        import("./kel/main.js").then(({ activate }) => activate(context)),
        // import("./dashy/main.js").then(({ activate }) => activate(context))
    ]);
    reporter.sendTelemetryEvent("initialized");
}

export function deactivate(): void {
    telemetryDeactivate();
}
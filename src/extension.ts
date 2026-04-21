import * as vscode from "vscode";
import { initialize } from "./util/localize";
import { activate as telemetryActivate, deactivate as telemetryDeactivate, logEvent, logError, time } from "./telemetry";
import { activate as notebookActivate } from "./notebook";
import { CredentialManager } from "./util/credentialManager";
import { checkForUpgrade } from "./util/versionNotification";

export function activate(context: vscode.ExtensionContext): void {
    performance.mark("extension-start");
    telemetryActivate(context);
    const endActivation = time("extension.activate");
    CredentialManager.attach(context);
    notebookActivate(context);
    initialize().then(() => {
        checkForUpgrade(context);
        return Promise.all([
            import("./ecl/main.js").then(({ activate }) => activate(context)),
            import("./kel/main.js").then(({ activate }) => activate(context)),
            // import("./dashy/main.js").then(({ activate }) => activate(context))
        ]);
    }).then(() => {
        endActivation();
        logEvent("initialized");
    }, err => {
        endActivation();
        logError("initialize.error", err);
    });
}

export function deactivate(): void {
    telemetryDeactivate();
}
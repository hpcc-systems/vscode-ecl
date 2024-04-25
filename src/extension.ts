import * as vscode from "vscode";
import { initialize } from "./util/localize";
import { activate as telemetryActivate, deactivate as telemetryDeactivate, reporter } from "./telemetry";
import { activate as notebookActivate } from "./notebook";

export function activate(context: vscode.ExtensionContext): void {
    performance.mark("extension-start");
    telemetryActivate(context);
    notebookActivate(context);

    initialize().then(() => {
        return Promise.all([
            import("./ecl/main.js").then(({ activate }) => activate(context)),
            import("./kel/main.js").then(({ activate }) => activate(context)),
            import("./dashy/main.js").then(({ activate }) => activate(context)),
            import("./chat/main.js").then(({ activate }) => activate(context))
        ]);
    }).then(() => {
        reporter.sendTelemetryEvent("initialized");
    });
}

export function deactivate(): void {
    telemetryDeactivate();
}
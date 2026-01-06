import * as vscode from "vscode";
import { Workunit } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../../hpccplatform/session";
import { reporter } from "../../../telemetry";
import localize from "../../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "../utils/index";

export interface IGetWorkunitECLParameters {
    wuid: string;
}

export class GetWorkunitECLTool implements vscode.LanguageModelTool<IGetWorkunitECLParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitECLParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitECL" });
        const params = options.input;

        const wuid = typeof params.wuid === "string" ? params.wuid.trim() : "";
        if (wuid.length === 0) {
            throw new vscode.LanguageModelError(localize("WUID is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitECL", "invoke start", { wuid });

        const session = requireConnectedSession();
        const opts = await createServiceOptions(session);

        try {
            const wu = Workunit.attach(opts, wuid);
            await wu.refresh();

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            const detailsUrl = session.wuDetailsUrl(wu.Wuid);
            parts.push(new vscode.LanguageModelTextPart(localize("ECL Source for Workunit {0}:", wuid)));

            const summary = localize(
                "Workunit {0} on {1} ({2})",
                wu.Wuid,
                wu.Cluster || localize("unknown cluster"),
                wu.State || localize("unknown state")
            );
            parts.push(new vscode.LanguageModelTextPart(summary));
            if (detailsUrl) {
                parts.push(new vscode.LanguageModelTextPart(`${localize("ECL Watch URL:")} ${detailsUrl}`));
            }

            throwIfCancellationRequested(token);
            const eclArchive = await wu.fetchArchive().catch(() => "");

            if (eclArchive) {
                parts.push(new vscode.LanguageModelTextPart(localize("\nECL Archive (XML format):")));
                parts.push(new vscode.LanguageModelTextPart("```xml\n" + eclArchive + "\n```"));
            } else {
                parts.push(new vscode.LanguageModelTextPart(localize("No ECL archive available for this workunit.")));
            }

            logToolEvent("getWorkunitECL", "invoke success", {
                wuid: wu.Wuid,
                state: wu.State,
                hasECL: !!eclArchive,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logToolEvent("getWorkunitECL", "invoke failed", { wuid, error: errorMessage });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch workunit ECL: {0}", errorMessage),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitECLParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const wuid = typeof options.input.wuid === "string" ? options.input.wuid.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Fetching ECL source for workunit {0}", wuid || localize("(unspecified)"))
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

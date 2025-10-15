import * as vscode from "vscode";
import { Workunit } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface IGetWorkunitTimingsParameters {
    /**
     * Workunit ID (WUID) to fetch timing/performance metrics from
     */
    wuid: string;
}

export class GetWorkunitTimingsTool implements vscode.LanguageModelTool<IGetWorkunitTimingsParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitTimingsParameters>, token: vscode.CancellationToken): Promise<vscode.LanguageModelToolResult> {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitTimings" });
        const params = options.input;

        const wuid = typeof params.wuid === "string" ? params.wuid.trim() : "";
        if (wuid.length === 0) {
            throw new vscode.LanguageModelError(localize("WUID is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitTimings", "invoke start", { wuid });

        const session = requireConnectedSession();
        const opts = createServiceOptions(session);

        try {
            // Attach to the workunit
            const wu = Workunit.attach(opts, wuid);
            await wu.refresh();

            throwIfCancellationRequested(token);

            // Build timing information
            const info: Record<string, unknown> = {
                wuid: wu.Wuid,
                state: wu.State,
                totalClusterTime: wu.TotalClusterTime,
                cluster: wu.Cluster
            };

            // Add any other available timing properties
            if (wu.DateTimeScheduled) info.dateTimeScheduled = wu.DateTimeScheduled;

            const parts: vscode.LanguageModelTextPart[] = [];
            const summary = localize(
                "Workunit {0} ran on {1} with total cluster time {2}.",
                wu.Wuid,
                wu.Cluster || localize("unknown cluster"),
                wu.TotalClusterTime || localize("not reported")
            );
            parts.push(new vscode.LanguageModelTextPart(summary));
            parts.push(new vscode.LanguageModelTextPart(JSON.stringify(info, null, 2)));

            const detailsUrl = session.wuDetailsUrl(wu.Wuid);
            if (detailsUrl) {
                parts.push(new vscode.LanguageModelTextPart(`${localize("ECL Watch URL:")} ${detailsUrl}`));
            }

            logToolEvent("getWorkunitTimings", "invoke success", {
                wuid: wu.Wuid,
                cluster: wu.Cluster,
                totalClusterTime: wu.TotalClusterTime,
            });

            return new vscode.LanguageModelToolResult(parts);

        } catch (e) {
            const error = e as Error;
            logToolEvent("getWorkunitTimings", "invoke failed", {
                wuid,
                error: error.message,
            });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch workunit timings: {0}", error.message),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitTimingsParameters>, _token: vscode.CancellationToken): Promise<vscode.PreparedToolInvocation> {
        const connected = isPlatformConnected();
        const wuid = typeof options.input.wuid === "string" ? options.input.wuid.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Fetching timing metrics from workunit '{0}'", wuid || localize("(unspecified)"))
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

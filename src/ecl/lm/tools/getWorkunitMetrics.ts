import * as vscode from "vscode";
import { Workunit } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../../hpccplatform/session";
import { reporter } from "../../../telemetry";
import localize from "../../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "../utils";

export interface IGetWorkunitMetricsParameters {
    /**
     * Workunit ID (WUID) to fetch metrics for
     */
    wuid: string;
}

export class GetWorkunitMetricsTool implements vscode.LanguageModelTool<IGetWorkunitMetricsParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitMetricsParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitMetrics" });
        const params = options.input;

        const wuid = typeof params.wuid === "string" ? params.wuid.trim() : "";
        if (wuid.length === 0) {
            throw new vscode.LanguageModelError(localize("WUID is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitMetrics", "invoke start", { wuid });

        const session = requireConnectedSession();
        const opts = await createServiceOptions(session);

        try {
            // Attach to the workunit and fetch its normalized metrics
            const wu = Workunit.attach(opts, wuid);
            await wu.refresh();

            throwIfCancellationRequested(token);

            // Fetch normalized details (metrics)
            const { data } = await wu.fetchDetailsNormalized({
                ScopeFilter: {
                    MaxDepth: 999999,
                    ScopeTypes: []
                },
                NestedFilter: {
                    Depth: 0,
                    ScopeTypes: []
                },
                PropertiesToReturn: {
                    AllScopes: true,
                    AllAttributes: true,
                    AllProperties: true,
                    AllNotes: true,
                    AllStatistics: true,
                    AllHints: true
                },
                ScopeOptions: {
                    IncludeId: true,
                    IncludeScope: true,
                    IncludeScopeType: true,
                    IncludeMatchedScopesInResults: true
                },
                PropertyOptions: {
                    IncludeName: true,
                    IncludeRawValue: true,
                    IncludeFormatted: true,
                    IncludeMeasure: true,
                    IncludeCreator: false,
                    IncludeCreatorType: false
                }
            });

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            // Add workunit summary information
            const detailsUrl = session.wuDetailsUrl(wu.Wuid);
            parts.push(new vscode.LanguageModelTextPart(localize("Workunit Metrics for {0}:", wuid)));

            const wuSummary = {
                wuid: wu.Wuid,
                owner: wu.Owner,
                cluster: wu.Cluster,
                state: wu.State,
                stateID: wu.StateID,
                jobname: wu.Jobname,
                totalClusterTime: wu.TotalClusterTime,
            };

            parts.push(new vscode.LanguageModelTextPart(JSON.stringify(wuSummary, null, 2)));

            const summary = localize(
                "{0} on {1} is {2}.",
                wu.Wuid,
                wu.Cluster || localize("unknown cluster"),
                wu.State || localize("unknown state")
            );
            parts.push(new vscode.LanguageModelTextPart(summary));
            if (detailsUrl) {
                parts.push(new vscode.LanguageModelTextPart(`${localize("ECL Watch URL:")} ${detailsUrl}`));
            }

            // Add normalized metrics data
            if (data && data.length > 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("Metrics ({0} scopes):", data.length.toString())));
                parts.push(new vscode.LanguageModelTextPart(JSON.stringify({
                    scopeCount: data.length,
                    scopeJson: data
                }, null, 2)));
            }

            logToolEvent("getWorkunitMetrics", "invoke success", {
                wuid: wu.Wuid,
                state: wu.State,
                scopeCount: data?.length || 0,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logToolEvent("getWorkunitMetrics", "invoke failed", { wuid, error: errorMessage });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch workunit metrics: {0}", errorMessage),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitMetricsParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const wuid = typeof options.input.wuid === "string" ? options.input.wuid.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Fetching metrics for workunit {0}", wuid || localize("(unspecified)"))
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

import * as vscode from "vscode";
import { Workunit } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface IGetWorkunitDetailsParameters {
    /**
     * Workunit ID (WUID) to fetch details for
     */
    wuid: string;
}

export class GetWorkunitDetailsTool implements vscode.LanguageModelTool<IGetWorkunitDetailsParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitDetailsParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitDetails" });
        const params = options.input;

        const wuid = typeof params.wuid === "string" ? params.wuid.trim() : "";
        if (wuid.length === 0) {
            throw new vscode.LanguageModelError(localize("WUID is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitDetails", "invoke start", { wuid });

        const session = requireConnectedSession();
        const opts = createServiceOptions(session);

        try {
            // Attach to the workunit and fetch its details
            const wu = Workunit.attach(opts, wuid);
            await wu.refresh();

            // Fetch results (if available)
            throwIfCancellationRequested(token);

            const results = await wu.fetchResults().catch(() => []);

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            // Add workunit summary information
            const detailsUrl = session.wuDetailsUrl(wu.Wuid);
            parts.push(new vscode.LanguageModelTextPart(localize("Workunit Details for {0}:", wuid)));

            const wuDetails = {
                wuid: wu.Wuid,
                owner: wu.Owner,
                cluster: wu.Cluster,
                state: wu.State,
                stateID: wu.StateID,
                jobname: wu.Jobname,
                protected: wu.Protected,
                description: wu.Description,
                scope: wu.Scope,
                totalClusterTime: wu.TotalClusterTime,
                applicationValues: wu.ApplicationValues,
            };

            parts.push(new vscode.LanguageModelTextPart(JSON.stringify(wuDetails, null, 2)));

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

            // Add results information if available
            if (results.length > 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("Results ({0}):", results.length.toString())));
                for (const result of results) {
                    parts.push(new vscode.LanguageModelTextPart(JSON.stringify({
                        name: result.Name,
                        value: result.Value,
                        sequence: result.Sequence,
                        total: result.Total,
                    }, null, 2)));
                }
            }

            // Add exceptions if any
            const exceptions = await wu.fetchECLExceptions().catch(() => []);
            throwIfCancellationRequested(token);
            if (exceptions.length > 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("Exceptions ({0}):", exceptions.length.toString())));
                for (const exception of exceptions) {
                    parts.push(new vscode.LanguageModelTextPart(JSON.stringify({
                        severity: exception.Severity,
                        source: exception.Source,
                        message: exception.Message,
                        code: exception.Code,
                        fileName: exception.FileName,
                        lineNo: exception.LineNo,
                        column: exception.Column,
                    }, null, 2)));
                }
            }

            logToolEvent("getWorkunitDetails", "invoke success", {
                wuid: wu.Wuid,
                state: wu.State,
                resultCount: results.length,
                exceptionCount: exceptions.length,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logToolEvent("getWorkunitDetails", "invoke failed", { wuid, error: errorMessage });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch workunit details: {0}", errorMessage),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitDetailsParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const wuid = typeof options.input.wuid === "string" ? options.input.wuid.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Fetching details for workunit {0}", wuid || localize("(unspecified)"))
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

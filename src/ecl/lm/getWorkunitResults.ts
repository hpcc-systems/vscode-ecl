import * as vscode from "vscode";
import { Result, Workunit, type XSDXMLNode } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface IGetWorkunitResultsParameters {
    /**
     * Workunit ID (WUID)
     */
    wuid: string;
    /**
     * Result name or sequence number
     */
    resultName: string;
    /**
     * Starting row (0-based, default: 0)
     */
    start?: number;
    /**
     * Number of rows to fetch (default: 100, max: 1000)
     */
    count?: number;
}

export class GetWorkunitResultsTool implements vscode.LanguageModelTool<IGetWorkunitResultsParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitResultsParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitResults" });
        const params = options.input;

        if (!params.wuid || !params.resultName) {
            throw new vscode.LanguageModelError(localize("WUID and result name are required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitResults", "invoke start", {
            wuid: params.wuid,
            resultName: params.resultName,
            start: params.start,
            count: params.count,
        });

        const session = requireConnectedSession();
        const opts = createServiceOptions(session);

        try {
            // Attach to the result
            const result = Result.attach(opts, params.wuid, params.resultName);

            // Fetch schema to get column information
            throwIfCancellationRequested(token);
            const schema = await result.fetchXMLSchema();
            throwIfCancellationRequested(token);

            // Determine row range
            const start = params.start ?? 0;
            const count = Math.min(params.count ?? 100, 1000); // Cap at 1000 rows

            // Fetch the rows
            const rows = await result.fetchRows(start, count);
            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            // Add summary
            const totalRows = typeof result.Total === "number" ? result.Total : rows.length;
            parts.push(new vscode.LanguageModelTextPart(
                localize("Result '{0}' from workunit {1}: Showing rows {2}-{3} of {4} total",
                    params.resultName,
                    params.wuid,
                    start.toString(),
                    rows.length === 0 ? start.toString() : (start + rows.length - 1).toString(),
                    totalRows.toString()
                )
            ));

            const resultUrl = session.wuResultUrl(params.wuid, params.resultName);
            if (resultUrl) {
                parts.push(new vscode.LanguageModelTextPart(`${localize("Result URL:")} ${resultUrl}`));
            }

            // Add column information
            if (schema && schema.root && schema.root.children) {
                const columns = schema.root.children.map((child: XSDXMLNode) => ({
                    name: child.name,
                    type: child.type
                }));
                parts.push(new vscode.LanguageModelTextPart(JSON.stringify({ columns }, null, 2)));
            }

            // Add the actual data rows
            if (rows.length > 0) {
                const structured = {
                    rows,
                    start,
                    count: rows.length,
                    total: result.Total,
                };
                parts.push(new vscode.LanguageModelTextPart(JSON.stringify(structured, null, 2)));

                parts.push(new vscode.LanguageModelTextPart(
                    localize("Data preview (first {0} rows):\n{1}",
                        Math.min(5, rows.length).toString(),
                        JSON.stringify(rows.slice(0, 5), null, 2)
                    )
                ));
            } else {
                parts.push(new vscode.LanguageModelTextPart(localize("No rows found in the specified range.")));
            }

            logToolEvent("getWorkunitResults", "invoke success", {
                wuid: params.wuid,
                resultName: params.resultName,
                returnedRows: rows.length,
                totalRows,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logToolEvent("getWorkunitResults", "invoke failed", {
                wuid: params.wuid,
                resultName: params.resultName,
                error: errorMessage,
            });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch workunit results: {0}", errorMessage),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitResultsParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const params = options.input;

        return {
            invocationMessage: connected
                ? localize("Fetching result '{0}' from workunit {1}", params.resultName || "", params.wuid || "")
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

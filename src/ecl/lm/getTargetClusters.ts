import * as vscode from "vscode";
import { WsTopology } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetTargetClustersParameters {
    // No parameters needed - fetches all clusters from current session
}

export class GetTargetClustersTool implements vscode.LanguageModelTool<IGetTargetClustersParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetTargetClustersParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getTargetClusters" });

        logToolEvent("getTargetClusters", "invoke start");

        const session = requireConnectedSession();

        throwIfCancellationRequested(token);

        try {
            // Fetch available clusters
            const clusters = await session.targetClusters();

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            if (clusters.length === 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("No clusters found on the connected HPCC Platform.")));
            } else {
                parts.push(new vscode.LanguageModelTextPart(localize("Found {0} cluster(s):", clusters.length.toString())));

                // Add a text summary
                const clusterSummary = clusters.map(c => {
                    const queue = c.Queue ? ` — ${c.Queue}` : "";
                    return `- ${c.Name} (${c.Type})${queue}`;
                }).join("\n");
                parts.push(new vscode.LanguageModelTextPart(
                    localize("Available clusters:\n{0}", clusterSummary)
                ));

                for (const cluster of clusters) {
                    const clusterInfo = {
                        name: cluster.Name,
                        type: cluster.Type,
                        queue: cluster.Queue
                    };
                    parts.push(new vscode.LanguageModelTextPart(JSON.stringify(clusterInfo, null, 2)));
                }
            }

            logToolEvent("getTargetClusters", "invoke success", { clusterCount: clusters.length });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logToolEvent("getTargetClusters", "invoke failed", { error: errorMessage });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch target clusters: {0}", errorMessage),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetTargetClustersParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();

        return {
            invocationMessage: connected
                ? localize("Fetching available target clusters")
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

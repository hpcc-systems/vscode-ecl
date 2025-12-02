import * as vscode from "vscode";
import { WsWorkunits } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../../hpccplatform/session";
import { reporter } from "../../../telemetry";
import localize from "../../../util/localize";
import { logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "../utils";

enum SortBy {
    protection = "Protection",
    wuid = "Wuid",
    owner = "Owner",
    jobname = "Jobname",
    cluster = "Cluster",
    state = "State",
    clustertime = "ClusterTime",
    compilecost = "Compile Cost",
    executioncost = "Execution Cost",
    fileaccesscost = "File Access Cost"
}

export interface IFindWorkunitsParameters {
    /**
     * Maximum number of workunits to return (default: 20)
     */
    count?: number;
    /**
     * Filter by cluster name
     */
    cluster?: string;
    /**
     * Filter by owner/username
     */
    owner?: string;
    /**
     * Filter by state (e.g., "completed", "failed", "running")
     */
    state?: string;
    /**
     * Search pattern for workunit ID (WUID)
     */
    wuidPattern?: string;
    /**
     * Field to sort by (e.g. "wuid", "owner", "cluster", "state", "jobname").
     */
    sortOrder?: SortBy;

    /**
     * Convenience flag to request descending order (overrides sortOrder when provided).
     */
    descending?: boolean;
}

export class FindWorkunitsTool implements vscode.LanguageModelTool<IFindWorkunitsParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IFindWorkunitsParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "findWorkunits" });
        const params = options.input;

        const sortKeyLookup: Record<string, { field: string; labelKey: string }> = {
            wuid: { field: "Wuid", labelKey: "workunit ID" },
            id: { field: "Wuid", labelKey: "workunit ID" },
            owner: { field: "Owner", labelKey: "owner" },
            user: { field: "Owner", labelKey: "owner" },
            cluster: { field: "Cluster", labelKey: "cluster" },
            state: { field: "State", labelKey: "state" },
            status: { field: "State", labelKey: "state" },
            jobname: { field: "Jobname", labelKey: "job name" },
            job: { field: "Jobname", labelKey: "job name" },
            protection: { field: "Protection", labelKey: "protection status" },
            clustertime: { field: "ClusterTime", labelKey: "cluster time" },
            "cluster time": { field: "ClusterTime", labelKey: "cluster time" },
            compilecost: { field: "Compile Cost", labelKey: "compile cost" },
            "compile cost": { field: "Compile Cost", labelKey: "compile cost" },
            executioncost: { field: "Execution Cost", labelKey: "execution cost" },
            "execution cost": { field: "Execution Cost", labelKey: "execution cost" },
            fileaccesscost: { field: "File Access Cost", labelKey: "file access cost" },
            "file access cost": { field: "File Access Cost", labelKey: "file access cost" },
        };

        const sortByRaw = typeof params.sortOrder === "string" ? params.sortOrder.trim().toLowerCase() : undefined;
        let sortByField: string | undefined;
        let sortLabel: string | undefined;
        let unsupportedSortKey: string | undefined;

        if (sortByRaw) {
            const mapping = sortKeyLookup[sortByRaw];
            if (mapping) {
                sortByField = mapping.field;
                sortLabel = localize(mapping.labelKey);
            } else {
                unsupportedSortKey = params.sortOrder;
            }
        }

        let descending: boolean | undefined;
        let sortOrderLabel: string | undefined;

        if (typeof params.descending === "boolean") {
            descending = params.descending;
            sortOrderLabel = descending ? localize("descending") : localize("ascending");
        }

        logToolEvent("findWorkunits", "invoke start", {
            count: params.count,
            cluster: params.cluster,
            owner: params.owner,
            state: params.state,
            wuidPattern: params.wuidPattern,
            sortBy: sortByField ?? params.sortOrder,
            descending,
            unsupportedSortKey,
        });

        const session = requireConnectedSession();

        const requestCount = Math.min(Math.max(params.count ?? 20, 1), 2000);

        // Build WUQuery request from parameters
        const request: Partial<WsWorkunits.WUQuery> = {
            Count: requestCount,
        };

        if (params.cluster) {
            request.Cluster = params.cluster;
        }
        if (params.owner) {
            request.Owner = params.owner;
        }
        if (params.state) {
            request.State = params.state;
        }
        if (params.wuidPattern) {
            request.Wuid = params.wuidPattern;
        }
        if (sortByField) {
            request.Sortby = sortByField;
        }
        if (descending !== undefined) {
            request.Descending = descending;
        }

        throwIfCancellationRequested(token);

        try {
            const workunits = await session.wuQuery(request);

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            if (workunits.length === 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("No workunits found matching the specified criteria.")));
            } else {
                parts.push(new vscode.LanguageModelTextPart(localize("Found {0} workunit(s).", workunits.length.toString())));

                const list = workunits.map(wu => {
                    const state = wu.State || localize("unknown state");
                    const jobName = wu.Jobname || localize("unnamed job");
                    return `- ${wu.Wuid} (${state}) — ${jobName}`;
                }).join("\n");
                parts.push(new vscode.LanguageModelTextPart(list));

                for (const wu of workunits) {
                    const detailsUrl = session.wuDetailsUrl(wu.Wuid);
                    const wuInfo = {
                        Wuid: wu.Wuid,
                        Owner: wu.Owner,
                        Cluster: wu.Cluster,
                        Jobname: wu.Jobname,
                        StateID: wu.StateID,
                        State: wu.State,
                        Protected: !!wu.Protected,
                        Action: wu.Action,
                        ActionEx: wu.ActionEx,
                        DateTimeScheduled: wu.DateTimeScheduled,
                        IsPausing: !!wu.IsPausing,
                        ThorLCR: !!wu.ThorLCR,
                        TotalClusterTime: wu.TotalClusterTime,
                        ExecuteCost: wu.ExecuteCost,
                        FileAccessCost: wu.FileAccessCost,
                        CompileCost: wu.CompileCost,
                        NoAccess: !!wu.NoAccess,
                        detailsUrl,
                    };
                    parts.push(new vscode.LanguageModelTextPart(JSON.stringify(wuInfo, null, 2)));
                }
            }

            if (sortLabel) {
                const summary = sortOrderLabel
                    ? localize("Sorted by {0} ({1}).", sortLabel, sortOrderLabel)
                    : localize("Sorted by {0}.", sortLabel);
                parts.push(new vscode.LanguageModelTextPart(summary));
            } else if (sortOrderLabel) {
                parts.push(new vscode.LanguageModelTextPart(localize("Sort order: {0}.", sortOrderLabel)));
            }

            if (unsupportedSortKey) {
                parts.push(new vscode.LanguageModelTextPart(localize("Sort key \"{0}\" is not supported; using default ordering.", unsupportedSortKey)));
            }

            logToolEvent("findWorkunits", "invoke success", {
                resultCount: workunits.length,
                sortBy: request.Sortby,
                descending,
                unsupportedSortKey,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logToolEvent("findWorkunits", "invoke failed", {
                error: message,
                sortBy: sortByField ?? params.sortOrder,
                descending,
                unsupportedSortKey,
            });
            throw new vscode.LanguageModelError(localize("Failed to query workunits: {0}", message), { cause: error });
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IFindWorkunitsParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const params = options.input;

        const filters: string[] = [];
        if (params.cluster) filters.push(localize("cluster: {0}", params.cluster));
        if (params.owner) filters.push(localize("owner: {0}", params.owner));
        if (params.state) filters.push(localize("state: {0}", params.state));
        if (params.wuidPattern) filters.push(localize("WUID: {0}", params.wuidPattern));

        const sortLabelLookup: Record<string, string> = {
            wuid: "workunit ID",
            id: "workunit ID",
            owner: "owner",
            user: "owner",
            cluster: "cluster",
            state: "state",
            status: "state",
            jobname: "job name",
            job: "job name",
            protection: "protection status",
            clustertime: "cluster time",
            "cluster time": "cluster time",
            compilecost: "compile cost",
            "compile cost": "compile cost",
            executioncost: "execution cost",
            "execution cost": "execution cost",
            fileaccesscost: "file access cost",
            "file access cost": "file access cost",
        };

        const sortByRaw = typeof params.sortOrder === "string" ? params.sortOrder.trim().toLowerCase() : undefined;
        const sortLabel = sortByRaw ? sortLabelLookup[sortByRaw] : undefined;
        if (sortLabel) {
            const localizedSortLabel = localize(sortLabel);
            filters.push(localize("sort by {0}", localizedSortLabel));
        } else if (params.sortOrder) {
            filters.push(localize("sort by {0}", params.sortOrder));
        }

        const sortOrderRaw = typeof params.sortOrder === "string" ? params.sortOrder.trim().toLowerCase() : undefined;
        let orderLabel: string | undefined;
        if (sortOrderRaw === "asc" || sortOrderRaw === "ascending") {
            orderLabel = localize("ascending");
        } else if (sortOrderRaw === "desc" || sortOrderRaw === "descending") {
            orderLabel = localize("descending");
        } else if (params.sortOrder) {
            orderLabel = params.sortOrder;
        }

        if (!orderLabel && typeof params.descending === "boolean") {
            orderLabel = params.descending ? localize("descending") : localize("ascending");
        }

        if (orderLabel) {
            filters.push(localize("order: {0}", orderLabel));
        }

        let searchDesc = localize("recent workunits");
        if (filters.length > 0) {
            searchDesc = filters.join(", ");
        }

        return {
            invocationMessage: connected
                ? localize("Searching for {0}", searchDesc)
                : localize("Cannot search: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

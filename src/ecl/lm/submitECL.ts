import * as vscode from "vscode";
import { Workunit } from "@hpcc-js/comms";
import { isPlatformConnected, sessionManager } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import * as os from "os";
import { logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface ISubmitECLParameters {
    /**
     * ECL code to submit for execution
     */
    ecl: string;
    /**
     * Optional target cluster (defaults to configured cluster if not specified)
     */
    targetCluster?: string;
    /**
     * Optional job name for the workunit
     */
    jobName?: string;
}

export class SubmitECLTool implements vscode.LanguageModelTool<ISubmitECLParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<ISubmitECLParameters>, token: vscode.CancellationToken): Promise<vscode.LanguageModelToolResult> {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "submitECL" });
        const params = options.input;

        const ecl = typeof params.ecl === "string" ? params.ecl.trim() : "";
        if (ecl.length === 0) {
            throw new vscode.LanguageModelError(localize("ECL code is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("submitECL", "invoke start", {
            jobName: params.jobName,
            targetCluster: params.targetCluster,
            eclLength: ecl.length,
        });

        const session = requireConnectedSession();

        try {
            // Create a temporary file with the ECL code
            const tmpFileName = `ecl_lm_submit_${Date.now()}.ecl`;
            const tmpUri = vscode.Uri.joinPath(vscode.Uri.file(os.tmpdir()), tmpFileName);

            // Write ECL code to temp file
            const eclContent = new TextEncoder().encode(ecl);
            await vscode.workspace.fs.writeFile(tmpUri, eclContent);

            try {
                // Determine target cluster
                const requestedCluster = params.targetCluster?.trim();
                const effectiveCluster = session.targetCluster;

                // Submit the ECL
                throwIfCancellationRequested(token);

                const workunit: Workunit = await session.submit(tmpUri, "submit");

                if (token.isCancellationRequested) {
                    await workunit.abort().catch(() => undefined);
                    throw new vscode.LanguageModelError(localize("Operation cancelled"), { cause: "cancelled" });
                }

                if (params.jobName) {
                    await workunit.update({ Jobname: params.jobName }).catch(() => undefined);
                }

                if (!workunit) {
                    throw new Error(localize("Failed to create workunit"));
                }

                // Wait for workunit to complete
                await workunit.watchUntilComplete();

                throwIfCancellationRequested(token);

                // Fetch final state and basic info
                await workunit.refresh();

                // Build response with workunit details
                const info: Record<string, unknown> = {
                    wuid: workunit.Wuid,
                    state: workunit.State,
                    cluster: effectiveCluster,
                    jobName: params.jobName || tmpFileName.replace(".ecl", ""),
                    owner: session.userID
                };

                // Check for errors/exceptions
                const exceptions = await workunit.fetchECLExceptions().catch(() => []);
                throwIfCancellationRequested(token);
                if (exceptions.length > 0) {
                    info.exceptions = exceptions.map((ex: { Source: string; Severity: string; Message: string }) => ({
                        source: ex.Source,
                        severity: ex.Severity,
                        message: ex.Message
                    }));
                }

                // Get result names (don't fetch full data - could be huge)
                const results = await workunit.fetchResults().catch(() => []);
                throwIfCancellationRequested(token);
                if (results.length > 0) {
                    info.results = results.map((r: { Name: string; Total: number }) => ({
                        name: r.Name,
                        rowCount: r.Total
                    }));
                }

                const parts: vscode.LanguageModelTextPart[] = [];
                parts.push(new vscode.LanguageModelTextPart(localize("Submitted workunit {0}: {1}", workunit.Wuid, workunit.State || localize("unknown state"))));
                parts.push(new vscode.LanguageModelTextPart(localize("Cluster: {0}", effectiveCluster || localize("unspecified"))));
                if (requestedCluster && requestedCluster !== effectiveCluster) {
                    parts.push(new vscode.LanguageModelTextPart(localize("Requested cluster {0} differs from the active configuration {1}. Update your launch configuration to change the submission target.", requestedCluster, effectiveCluster || localize("unspecified"))));
                }
                parts.push(new vscode.LanguageModelTextPart(JSON.stringify(info, null, 2)));

                const detailsUrl = session.wuDetailsUrl(workunit.Wuid);
                if (detailsUrl) {
                    parts.push(new vscode.LanguageModelTextPart(`${localize("ECL Watch URL:")} ${detailsUrl}`));
                }

                if (Array.isArray(info.results) && info.results.length > 0) {
                    const resultSummary = info.results.map((result: any) => `- ${result.name} (${result.rowCount ?? 0} row(s))`).join("\n");
                    parts.push(new vscode.LanguageModelTextPart(`${localize("Result overview:")}\n${resultSummary}`));
                }

                if (Array.isArray(info.exceptions) && info.exceptions.length > 0) {
                    const exceptionSummary = info.exceptions.map((exception: any) => `- ${exception.severity}: ${exception.message}`).join("\n");
                    parts.push(new vscode.LanguageModelTextPart(`${localize("Exceptions:")}\n${exceptionSummary}`));
                }

                logToolEvent("submitECL", "invoke success", {
                    wuid: workunit.Wuid,
                    state: workunit.State,
                    cluster: effectiveCluster,
                    resultCount: Array.isArray(info.results) ? info.results.length : 0,
                    exceptionCount: Array.isArray(info.exceptions) ? info.exceptions.length : 0,
                });

                return new vscode.LanguageModelToolResult(parts);

            } finally {
                // Clean up temporary file
                try {
                    await vscode.workspace.fs.delete(tmpUri);
                } catch {
                    // Ignore cleanup errors
                }
            }

        } catch (e) {
            const error = e as Error;
            logToolEvent("submitECL", "invoke failed", {
                jobName: params.jobName,
                targetCluster: params.targetCluster,
                error: error.message,
            });
            throw new vscode.LanguageModelError(
                localize("Failed to submit ECL: {0}", error.message),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<ISubmitECLParameters>, _token: vscode.CancellationToken): Promise<vscode.PreparedToolInvocation> {
        const connected = isPlatformConnected();
        const cluster = options.input.targetCluster || sessionManager.session?.targetCluster || localize("default cluster");
        const jobName = options.input.jobName || localize("ECL job");
        const eclPreview = options.input.ecl ? `\n\n${options.input.ecl.slice(0, 200)}${options.input.ecl.length > 200 ? "…" : ""}` : "";

        return {
            invocationMessage: connected
                ? localize("Submitting {0} to {1}", jobName, cluster)
                : localize("Cannot submit: HPCC Platform not connected"),
            confirmationMessages: connected ? {
                title: localize("Submit ECL to {0}", cluster),
                message: new vscode.MarkdownString(
                    localize("Submit ECL code to cluster?") + eclPreview
                ),
            } : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

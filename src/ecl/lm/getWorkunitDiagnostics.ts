import * as vscode from "vscode";
import { Workunit } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface IGetWorkunitDiagnosticsParameters {
    /**
     * Workunit ID (WUID) to inspect
     */
    wuid: string;
}

export class GetWorkunitDiagnosticsTool implements vscode.LanguageModelTool<IGetWorkunitDiagnosticsParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitDiagnosticsParameters>, token: vscode.CancellationToken): Promise<vscode.LanguageModelToolResult> {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitDiagnostics" });
        const params = options.input;

        const wuid = typeof params.wuid === "string" ? params.wuid.trim() : "";
        if (wuid.length === 0) {
            throw new vscode.LanguageModelError(localize("WUID is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitDiagnostics", "invoke start", {
            wuid,
        });

        const session = requireConnectedSession();
        const opts = createServiceOptions(session);
        const number = new Intl.NumberFormat();

        try {
            const wu = Workunit.attach(opts, wuid);
            await wu.refresh();
            throwIfCancellationRequested(token);

            const errorCount = typeof wu.ErrorCount === "number" ? wu.ErrorCount : Number(wu.ErrorCount ?? 0);
            const warningCount = typeof wu.WarningCount === "number" ? wu.WarningCount : Number(wu.WarningCount ?? 0);
            const infoCount = typeof wu.InfoCount === "number" ? wu.InfoCount : Number(wu.InfoCount ?? 0);
            const alertCount = typeof wu.AlertCount === "number" ? wu.AlertCount : Number(wu.AlertCount ?? 0);

            const compileCost = typeof wu.CompileCost === "number" ? wu.CompileCost : Number(wu.CompileCost ?? 0);
            const executeCost = typeof wu.ExecuteCost === "number" ? wu.ExecuteCost : Number(wu.ExecuteCost ?? 0);
            const fileAccessCost = typeof wu.FileAccessCost === "number" ? wu.FileAccessCost : Number(wu.FileAccessCost ?? 0);

            const parts: Array<vscode.LanguageModelTextPart> = [];

            parts.push(new vscode.LanguageModelTextPart(localize(
                "Workunit {0} ({1}) has {2} error(s), {3} warning(s), {4} info message(s), and {5} alert(s).",
                wu.Wuid,
                wu.State || localize("unknown state"),
                number.format(errorCount),
                number.format(warningCount),
                number.format(infoCount),
                number.format(alertCount)
            )));

            parts.push(new vscode.LanguageModelTextPart(localize(
                "Estimated costs — Compile: {0}, Execute: {1}, File access: {2}.",
                number.format(compileCost),
                number.format(executeCost),
                number.format(fileAccessCost)
            )));

            const exceptions = await wu.fetchECLExceptions().catch(() => []);
            throwIfCancellationRequested(token);

            if (exceptions.length === 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("No ECL exceptions reported.")));
            } else {
                const lines = (exceptions as Array<Record<string, unknown>>).map((exception, index: number) => {
                    const severity = typeof exception.Severity === "string" ? exception.Severity : localize("unknown severity");
                    const message = typeof exception.Message === "string" ? exception.Message : localize("No message provided");
                    const source = typeof exception.Source === "string" && exception.Source.length > 0 ? ` (${exception.Source})` : "";
                    const locationParts: Array<string> = [];
                    if (typeof exception.FileName === "string" && exception.FileName.length > 0) {
                        locationParts.push(exception.FileName);
                    }
                    if (typeof exception.LineNo === "number") {
                        locationParts.push(exception.LineNo.toString());
                    }
                    if (typeof exception.Column === "number") {
                        locationParts.push(exception.Column.toString());
                    }
                    const location = locationParts.length > 0 ? ` [${locationParts.join(":")}]` : "";
                    return `${index + 1}. ${severity.toUpperCase()}: ${message}${source}${location}`;
                }).join("\n");

                parts.push(new vscode.LanguageModelTextPart(`${localize("Exceptions:")}\n${lines}`));
            }

            const payload = {
                wuid: wu.Wuid,
                owner: wu.Owner,
                state: wu.State,
                errorCount,
                warningCount,
                infoCount,
                alertCount,
                compileCost,
                executeCost,
                fileAccessCost
            };
            parts.push(new vscode.LanguageModelTextPart(JSON.stringify(payload, null, 2)));

            logToolEvent("getWorkunitDiagnostics", "invoke success", {
                wuid: wu.Wuid,
                state: wu.State,
                errorCount,
                warningCount,
                exceptionCount: Array.isArray(exceptions) ? exceptions.length : 0,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logToolEvent("getWorkunitDiagnostics", "invoke failed", {
                wuid,
                error: message,
            });
            throw new vscode.LanguageModelError(localize("Failed to retrieve workunit diagnostics: {0}", message), { cause: error });
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitDiagnosticsParameters>, _token: vscode.CancellationToken): Promise<vscode.PreparedToolInvocation> {
        const connected = isPlatformConnected();
        return {
            invocationMessage: connected
                ? localize("Retrieving diagnostics for workunit {0}", options.input.wuid || "")
                : localize("Cannot fetch diagnostics: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection."))
            }
        };
    }
}

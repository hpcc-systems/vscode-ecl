import * as vscode from "vscode";
import { Workunit, type WsWorkunits } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../../hpccplatform/session";
import { reporter } from "../../../telemetry";
import localize from "../../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "../utils";

const SEVERITY = {
    ERROR: ["Error", "error"],
    WARNING: ["Warning", "warning"],
    INFO: ["Info", "info", "Information"],
} as const;

interface FormattedException {
    severity: string;
    source: string;
    message: string;
    code: number;
    fileName?: string;
    lineNo?: number;
    column?: number;
}

export interface IGetWorkunitErrorsParameters {
    wuid: string;
}

function isSeverityType(exception: WsWorkunits.ECLException, severities: readonly string[]): boolean {
    return severities.some(s => s === exception.Severity);
}

function formatException(exception: WsWorkunits.ECLException): FormattedException {
    return {
        severity: exception.Severity,
        source: exception.Source,
        message: exception.Message,
        code: exception.Code,
        fileName: exception.FileName,
        lineNo: exception.LineNo,
        column: exception.Column,
    };
}

function addExceptionGroup(
    parts: vscode.LanguageModelTextPart[],
    title: string,
    exceptions: WsWorkunits.ECLException[]
): void {
    if (exceptions.length === 0) return;

    parts.push(new vscode.LanguageModelTextPart(title));
    for (const exception of exceptions) {
        parts.push(new vscode.LanguageModelTextPart(JSON.stringify(formatException(exception), null, 2)));
    }
}

function categorizeExceptions(exceptions: WsWorkunits.ECLException[]) {
    const errors = exceptions.filter(e => isSeverityType(e, SEVERITY.ERROR));
    const warnings = exceptions.filter(e => isSeverityType(e, SEVERITY.WARNING));
    const infos = exceptions.filter(e => isSeverityType(e, SEVERITY.INFO));
    const others = exceptions.filter(e =>
        !isSeverityType(e, SEVERITY.ERROR) &&
        !isSeverityType(e, SEVERITY.WARNING) &&
        !isSeverityType(e, SEVERITY.INFO)
    );

    return { errors, warnings, infos, others };
}

export class GetWorkunitErrorsTool implements vscode.LanguageModelTool<IGetWorkunitErrorsParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitErrorsParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitErrors" });
        const params = options.input;

        const wuid = typeof params.wuid === "string" ? params.wuid.trim() : "";
        if (wuid.length === 0) {
            throw new vscode.LanguageModelError(localize("WUID is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitErrors", "invoke start", { wuid });

        const session = requireConnectedSession();
        const opts = await createServiceOptions(session);

        try {
            const wu = Workunit.attach(opts, wuid);
            await wu.refresh();

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            const detailsUrl = session.wuDetailsUrl(wu.Wuid);
            parts.push(new vscode.LanguageModelTextPart(localize("Errors/Warnings for Workunit {0}:", wuid)));

            const summary = localize(
                "{0} on {1} is {2}.",
                wu.Wuid,
                wu.Cluster || localize("unknown cluster"),
                wu.State || localize("unknown state")
            );
            parts.push(new vscode.LanguageModelTextPart(summary));

            const exceptions = await wu.fetchECLExceptions().catch(() => []);
            throwIfCancellationRequested(token);

            if (exceptions.length === 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("No errors or warnings found for this workunit.")));
            } else {
                const { errors, warnings, infos, others } = categorizeExceptions(exceptions);

                parts.push(new vscode.LanguageModelTextPart(localize(
                    "Total: {0} exception(s) - {1} error(s), {2} warning(s), {3} info, {4} other",
                    exceptions.length.toString(),
                    errors.length.toString(),
                    warnings.length.toString(),
                    infos.length.toString(),
                    others.length.toString()
                )));

                addExceptionGroup(parts, localize("\nErrors ({0}):", errors.length.toString()), errors);
                addExceptionGroup(parts, localize("\nWarnings ({0}):", warnings.length.toString()), warnings);
                addExceptionGroup(parts, localize("\nInformational ({0}):", infos.length.toString()), infos);
                addExceptionGroup(parts, localize("\nOther ({0}):", others.length.toString()), others);
            }

            if (detailsUrl) {
                parts.push(new vscode.LanguageModelTextPart(`\n${localize("ECL Watch URL:")} ${detailsUrl}`));
            }

            const { errors, warnings } = categorizeExceptions(exceptions);
            logToolEvent("getWorkunitErrors", "invoke success", {
                wuid: wu.Wuid,
                state: wu.State,
                exceptionCount: exceptions.length,
                errorCount: errors.length,
                warningCount: warnings.length,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logToolEvent("getWorkunitErrors", "invoke failed", { wuid, error: errorMessage });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch workunit errors/warnings: {0}", errorMessage),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitErrorsParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const wuid = typeof options.input.wuid === "string" ? options.input.wuid.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Fetching errors/warnings for workunit {0}", wuid || localize("(unspecified)"))
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

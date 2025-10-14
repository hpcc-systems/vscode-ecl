import * as vscode from "vscode";
import { LogicalFile } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface IGetLogicalFileInfoParameters {
    /**
     * Name of the logical file to retrieve information for
     */
    logicalFileName: string;
}

export class GetLogicalFileInfoTool implements vscode.LanguageModelTool<IGetLogicalFileInfoParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetLogicalFileInfoParameters>, token: vscode.CancellationToken): Promise<vscode.LanguageModelToolResult> {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getLogicalFileInfo" });
        const params = options.input;

        const logicalFileName = typeof params.logicalFileName === "string" ? params.logicalFileName.trim() : "";
        if (logicalFileName.length === 0) {
            throw new vscode.LanguageModelError(localize("Logical file name is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getLogicalFileInfo", "invoke start", { logicalFileName });

        const session = requireConnectedSession();
        const opts = createServiceOptions(session);
        const number = new Intl.NumberFormat();

        try {
            // Attach to the logical file (cluster is empty string for default)
            const logicalFile = LogicalFile.attach(opts, "", logicalFileName);

            // Fetch detailed information
            throwIfCancellationRequested(token);
            const fileInfo = await logicalFile.fetchInfo();
            throwIfCancellationRequested(token);

            // Build comprehensive file information
            const info: Record<string, unknown> = {
                name: fileInfo.Name,
                size: fileInfo.Filesize,
                recordCount: fileInfo.RecordCount,
                recordSize: fileInfo.RecordSize,
                modified: fileInfo.Modified,
                directory: fileInfo.Dir,
                description: fileInfo.Description,
                isCompressed: fileInfo.IsCompressed,
                isSuperfile: fileInfo.isSuperfile,
                numParts: fileInfo.NumParts,
                owner: fileInfo.Owner,
                persistent: fileInfo.Persistent,
                format: fileInfo.Format
            };

            // Get ECL record definition if available
            if (fileInfo.Ecl) {
                info.eclDefinition = fileInfo.Ecl;
            }

            const parts: vscode.LanguageModelTextPart[] = [];

            const fileName = fileInfo.Name || logicalFileName;
            const recordCount = typeof fileInfo.RecordCount === "number" ? fileInfo.RecordCount : 0;
            const size = typeof fileInfo.Filesize === "number" ? fileInfo.Filesize : 0;
            const summary = localize(
                "Logical file {0}: {1} record(s), {2} byte(s).",
                fileName,
                number.format(recordCount),
                number.format(size)
            );
            parts.push(new vscode.LanguageModelTextPart(summary));

            parts.push(new vscode.LanguageModelTextPart(JSON.stringify(info, null, 2)));

            if (typeof info.eclDefinition === "string" && info.eclDefinition.length > 0) {
                parts.push(new vscode.LanguageModelTextPart(`${localize("Record definition:")}\n${info.eclDefinition}`));
            }

            logToolEvent("getLogicalFileInfo", "invoke success", {
                logicalFileName,
                recordCount,
                size,
            });

            return new vscode.LanguageModelToolResult(parts);

        } catch (e) {
            const error = e as Error;
            logToolEvent("getLogicalFileInfo", "invoke failed", { logicalFileName, error: error.message });
            throw new vscode.LanguageModelError(
                localize("Failed to retrieve logical file info: {0}", error.message),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetLogicalFileInfoParameters>, _token: vscode.CancellationToken): Promise<vscode.PreparedToolInvocation> {
        const connected = isPlatformConnected();
        const logicalFileName = typeof options.input.logicalFileName === "string" ? options.input.logicalFileName.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Getting detailed information for logical file '{0}'", logicalFileName || localize("(unspecified)"))
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

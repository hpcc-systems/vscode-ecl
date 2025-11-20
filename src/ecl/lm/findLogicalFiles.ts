import * as vscode from "vscode";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface IFindLogicalFilesParameters {
    pattern: string;
}

export class FindLogicalFilesTool implements vscode.LanguageModelTool<IFindLogicalFilesParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IFindLogicalFilesParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "findLogicalFiles" });
        const params = options.input;
        const pattern = typeof params.pattern === "string" ? params.pattern.trim() : "";
        if (pattern.length === 0) {
            throw new vscode.LanguageModelError(localize("Search pattern is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("findLogicalFiles", "invoke start", { pattern });

        try {
            const session = requireConnectedSession();

            throwIfCancellationRequested(token);

            const files = await session.findLogicalFiles(pattern);

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            if (files.length === 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("No logical files match \"{0}\".", pattern)));
            } else {
                parts.push(new vscode.LanguageModelTextPart(localize("Found {0} logical file(s) matching \"{1}\".", files.length.toString(), pattern)));

                const list = files.map(file => {
                    const name = file.Name || localize("Unnamed file");
                    const owner = file.Owner || localize("unknown owner");
                    const description = file.Description ? ` — ${file.Description}` : "";
                    return `- ${name} (${owner})${description}`;
                }).join("\n");

                parts.push(new vscode.LanguageModelTextPart(list));

                for (const file of files) {
                    parts.push(new vscode.LanguageModelTextPart(JSON.stringify(file, null, 2)));
                }
            }

            logToolEvent("findLogicalFiles", "invoke success", {
                pattern,
                fileCount: files.length,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logToolEvent("findLogicalFiles", "invoke failed", { pattern, error: message });
            throw new vscode.LanguageModelError(localize("Failed to search logical files: {0}", message), { cause: error });
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IFindLogicalFilesParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const pattern = typeof options.input.pattern === "string" ? options.input.pattern.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Searching HPCC Platform for \"{0}\"", pattern || localize("(empty pattern)"))
                : localize("Cannot search: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

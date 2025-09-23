import * as vscode from "vscode";
import { isPlatformConnected, sessionManager } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";

export interface IFindLogicalFilesParameters {
    pattern: string;
}

export class FindLogicalFilesTool implements vscode.LanguageModelTool<IFindLogicalFilesParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IFindLogicalFilesParameters>, token: vscode.CancellationToken) {
        if (!isPlatformConnected()) {
            throw new vscode.LanguageModelError(localize("HPCC Platform not connected"), { cause: "not_connected" });
        }
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "findLogicalFiles" });
        const params = options.input;
        return sessionManager.session?.findLogicalFiles(params.pattern).then((files) => {
            const parts: Array<vscode.LanguageModelTextPart | vscode.LanguageModelPromptTsxPart> = [];
            parts.push(new vscode.LanguageModelTextPart(localize("Found {0} files matching \"{1}\":", files.length.toString(), params.pattern)));
            for (const file of files) {
                parts.push(new vscode.LanguageModelPromptTsxPart({ kind: "hpccFile", ...file }));
            }
            return new vscode.LanguageModelToolResult(parts);
        });
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IFindLogicalFilesParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        return {
            invocationMessage: connected ? localize("Searching workspace for \"{0}\"", options.input.pattern) : localize("Cannot search: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

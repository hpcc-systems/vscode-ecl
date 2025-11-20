import * as vscode from "vscode";
import { Workunit } from "@hpcc-js/comms";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { createServiceOptions, logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface IGetWorkunitECLParameters {
    /**
     * Workunit ID (WUID) to fetch ECL source code from
     */
    wuid: string;
}

export class GetWorkunitECLTool implements vscode.LanguageModelTool<IGetWorkunitECLParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IGetWorkunitECLParameters>, token: vscode.CancellationToken): Promise<vscode.LanguageModelToolResult> {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "getWorkunitECL" });
        const params = options.input;

        const wuid = typeof params.wuid === "string" ? params.wuid.trim() : "";
        if (wuid.length === 0) {
            throw new vscode.LanguageModelError(localize("WUID is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("getWorkunitECL", "invoke start", { wuid });

        const session = requireConnectedSession();
        const opts = createServiceOptions(session);

        try {
            // Attach to the workunit
            const wu = Workunit.attach(opts, wuid);
            await wu.refresh();

            // Fetch the ECL source code using fetchQuery
            throwIfCancellationRequested(token);
            const queryInfo = await wu.fetchQuery();
            throwIfCancellationRequested(token);
            const eclText = queryInfo.Text || "";

            const info: Record<string, unknown> = {
                wuid: wu.Wuid,
                jobname: wu.Jobname,
                eclText: eclText
            };

            const parts: vscode.LanguageModelTextPart[] = [];

            const summary = localize(
                "Retrieved ECL for {0} ({1}).",
                wu.Wuid,
                wu.Jobname || localize("unnamed job")
            );
            parts.push(new vscode.LanguageModelTextPart(summary));

            const detailsUrl = session.wuDetailsUrl(wu.Wuid);
            if (detailsUrl) {
                parts.push(new vscode.LanguageModelTextPart(`${localize("ECL Watch URL:")} ${detailsUrl}`));
            }

            parts.push(new vscode.LanguageModelTextPart(JSON.stringify(info, null, 2)));

            const snippetLimit = 4000;
            if (eclText.length > 0) {
                const snippet = eclText.length > snippetLimit ? `${eclText.slice(0, snippetLimit)}\n…` : eclText;
                parts.push(new vscode.LanguageModelTextPart(`${localize("ECL source preview:")}\n${snippet}`));
            }

            logToolEvent("getWorkunitECL", "invoke success", {
                wuid: wu.Wuid,
                jobname: wu.Jobname,
                eclLength: eclText.length,
            });

            return new vscode.LanguageModelToolResult(parts);

        } catch (e) {
            const error = e as Error;
            logToolEvent("getWorkunitECL", "invoke failed", { wuid, error: error.message });
            throw new vscode.LanguageModelError(
                localize("Failed to fetch ECL from workunit: {0}", error.message),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IGetWorkunitECLParameters>, _token: vscode.CancellationToken): Promise<vscode.PreparedToolInvocation> {
        const connected = isPlatformConnected();
        const wuid = typeof options.input.wuid === "string" ? options.input.wuid.trim() : "";

        return {
            invocationMessage: connected
                ? localize("Fetching ECL source code from workunit '{0}'", wuid || localize("(unspecified)"))
                : localize("Cannot fetch: HPCC Platform not connected"),
            confirmationMessages: connected ? undefined : {
                title: localize("HPCC Platform not connected"),
                message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
            }
        };
    }
}

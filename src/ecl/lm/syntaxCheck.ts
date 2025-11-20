import * as vscode from "vscode";
import * as os from "os";
import { isPlatformConnected } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";
import { logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "./utils";

export interface ISyntaxCheckParameters {
    ecl: string;
}

export class SyntaxCheckTool implements vscode.LanguageModelTool<ISyntaxCheckParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<ISyntaxCheckParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "syntaxCheck" });
        const params = options.input;
        if (typeof params.ecl !== "string" || params.ecl.trim().length === 0) {
            throw new vscode.LanguageModelError(localize("ECL code is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("syntaxCheck", "invoke start", { inputLength: params.ecl.length });

        const session = requireConnectedSession();
        const tmpFileName = `ecl_syntax_check_${Date.now()}.ecl`;
        const tmpUri = vscode.Uri.joinPath(vscode.Uri.file(os.tmpdir()), tmpFileName);

        try {
            const eclContent = new TextEncoder().encode(params.ecl);
            await vscode.workspace.fs.writeFile(tmpUri, eclContent);

            throwIfCancellationRequested(token);

            const result = await session.checkSyntax(tmpUri);

            throwIfCancellationRequested(token);

            const errors = result?.errors ?? [];
            const checked = result?.checked ?? [];
            const issueCount = errors.length;
            const checkedCount = checked.length;

            const parts: vscode.LanguageModelTextPart[] = [];

            if (issueCount === 0) {
                parts.push(new vscode.LanguageModelTextPart(localize("No syntax errors found. Checked {0} file(s).", checkedCount.toString())));
            } else {
                parts.push(new vscode.LanguageModelTextPart(localize("Detected {0} syntax issue(s) across {1} file(s).", issueCount.toString(), Math.max(checkedCount, 1).toString())));

                const formatted = errors
                    .map((error: any, idx: number) => {
                        const filePath = typeof error.filePath === "string" && error.filePath.length > 0 ? error.filePath : checked[0] || tmpUri.fsPath;
                        const line = typeof error.line === "number" ? error.line : undefined;
                        const column = typeof error.col === "number" ? error.col : undefined;
                        const severity = typeof error.severity === "string" ? error.severity : "error";
                        const code = error.code ? `[${error.code}] ` : "";
                        const location = [filePath, line, column]
                            .filter(value => value !== undefined && value !== "")
                            .join(":");
                        const message = error.msg || error.message || localize("Unknown syntax issue");
                        return `${idx + 1}. ${location} ${severity.toUpperCase()} ${code}${message}`;
                    })
                    .join("\n");

                if (formatted) {
                    parts.push(new vscode.LanguageModelTextPart(formatted));
                }
            }

            if (checkedCount > 0) {
                const checkedFiles = checked.join("\n");
                parts.push(new vscode.LanguageModelTextPart(`${localize("Files checked:")}\n${checkedFiles}`));
            }

            logToolEvent("syntaxCheck", "invoke success", {
                issueCount,
                checkedCount,
                filesChecked: checked,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logToolEvent("syntaxCheck", "invoke failed", { error: message });
            throw new vscode.LanguageModelError(localize("Error checking syntax: {0}", message), { cause: error });
        } finally {
            try {
                await vscode.workspace.fs.delete(tmpUri);
            } catch {
                // ignore
            }
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<ISyntaxCheckParameters>, _token: vscode.CancellationToken) {
        const connected = isPlatformConnected();
        const eclPreview = options.input.ecl ? `\n\n${options.input.ecl.slice(0, 200)}${options.input.ecl.length > 200 ? "…" : ""}` : "";

        const confirmationMessages = connected ? {
            title: localize("Check ECL Syntax"),
            message: new vscode.MarkdownString(
                localize("Check the syntax of ECL code?") + eclPreview
            ),
        } : {
            title: localize("HPCC Platform not connected"),
            message: new vscode.MarkdownString(localize("This tool requires an active HPCC connection.")),
        };

        return {
            invocationMessage: connected
                ? localize("Checking ECL syntax")
                : localize("Cannot check syntax: HPCC Platform not connected"),
            confirmationMessages,
        };
    }
}

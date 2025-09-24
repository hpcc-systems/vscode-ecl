import * as vscode from "vscode";
import * as os from "os";
import { sessionManager } from "../../hpccplatform/session";
import { reporter } from "../../telemetry";
import localize from "../../util/localize";

export interface ISyntaxCheckParameters {
    ecl: string;
}

export class SyntaxCheckTool implements vscode.LanguageModelTool<ISyntaxCheckParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<ISyntaxCheckParameters>, _token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "syntaxCheck" });
        const params = options.input;
        if (typeof params.ecl === "string") {
            const tmpFileName = `ecl_syntax_check_${Date.now()}.ecl`;
            const tmpUri = vscode.Uri.joinPath(vscode.Uri.file(os.tmpdir()), tmpFileName);
            try {
                const eclContent = new TextEncoder().encode(params.ecl);
                await vscode.workspace.fs.writeFile(tmpUri, eclContent);
                const result = await sessionManager.session?.checkSyntax(tmpUri);
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(result ? localize("ECL syntax is valid.") : localize("ECL syntax is invalid."))
                ]);
            } catch (error) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`${localize("Error checking syntax:")}: ${error}`)
                ]);
            } finally {
                try {
                    await vscode.workspace.fs.delete(tmpUri);
                } catch (e) {
                    // ignore
                }
            }
        } else {
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(localize("Invalid input: ECL code must be a string."))
            ]);
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<ISyntaxCheckParameters>, _token: vscode.CancellationToken) {
        const confirmationMessages = {
            title: localize("Check ECL Syntax"),
            message: new vscode.MarkdownString(
                localize("Check the syntax of ECL code?") + (options.input.ecl !== undefined ? ` ${localize("in ECL code")} ${options.input.ecl}` : "")
            ),
        };

        return {
            invocationMessage: localize("Checking ECL syntax"),
            confirmationMessages,
        };
    }
}

import * as os from "os";
import * as vscode from "vscode";
import localize from "../../../util/localize";
import { reporter } from "../../../telemetry";
import { detectECLCallable, hasTerminalAction } from "../callable";
import { requireConnectedSession, throwIfCancellationRequested } from "../utils/index";
import { classifySyntaxStatus, hasSyntaxCheckEvidence, normalizeSyntaxIssues, toolchainFailureDetail } from "../syntaxResult";

export interface IIntegrationCheckParameters {
    ecl: string;
    exportName: string;
    harness: string;
}

function safeExportName(name: string): string {
    if (!/^[A-Za-z_]\w*$/.test(name)) {
        throw new vscode.LanguageModelError(localize("A valid ECL export name is required"), { cause: "invalid_parameters" });
    }
    return name;
}

// Both files are written to the same folder, so `$` is the only import root the harness can rely on.
function importsCallable(harness: string, exportName: string): boolean {
    return new RegExp(`\\bIMPORT\\s+\\$(\\s*\\.\\s*${exportName}\\b|\\s*;)`, "i").test(harness);
}

export class IntegrationCheckTool implements vscode.LanguageModelTool<IIntegrationCheckParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IIntegrationCheckParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "integrationCheck" });
        const source = options.input.ecl?.trim();
        const harness = options.input.harness?.trim();
        if (!source || !harness) {
            throw new vscode.LanguageModelError(
                localize("ECL source and a BWR harness are required"),
                { cause: "invalid_parameters" }
            );
        }
        const callable = detectECLCallable(source);
        if (!callable) {
            throw new vscode.LanguageModelError(
                localize("The ECL source does not contain a FUNCTION, FUNCTIONMACRO, MACRO, or MODULE definition"),
                { cause: "invalid_parameters" }
            );
        }
        if (hasTerminalAction(source)) {
            throw new vscode.LanguageModelError(
                localize("This tool is for callable ECL only; runnable ECL with a terminal action does not need an integration check"),
                { cause: "invalid_parameters" }
            );
        }

        const exportName = safeExportName(options.input.exportName || callable.name || "");

        if (!importsCallable(harness, exportName)) {
            throw new vscode.LanguageModelError(
                localize("The harness is compiled alongside the callable, so it must import it with \"IMPORT $.{0};\" (or \"IMPORT $;\")", exportName),
                { cause: "invalid_parameters" }
            );
        }

        let session: ReturnType<typeof requireConnectedSession>;
        try {
            session = requireConnectedSession();
        } catch (error) {
            if (error instanceof vscode.LanguageModelError && error.cause === "not_connected") {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(JSON.stringify({
                        status: "unavailable",
                        callable: { kind: callable.kind, exportName },
                        issueCount: 0,
                        checkedFiles: [],
                        issues: [],
                        reason: localize("HPCC Platform not connected"),
                    }, null, 2))
                ]);
            }
            throw error;
        }

        //  A stable folder keeps eclcc's cwd small and cacheable;  `$` in the harness resolves to it.
        const tempDirectory = vscode.Uri.joinPath(vscode.Uri.file(os.tmpdir()), "vscode-ecl-integration-check");
        const callableUri = vscode.Uri.joinPath(tempDirectory, `${exportName}.ecl`);
        const harnessUri = vscode.Uri.joinPath(tempDirectory, `BWR_IntegrationCheck_${Date.now()}.ecl`);

        try {
            await vscode.workspace.fs.createDirectory(tempDirectory);
            await Promise.all([
                vscode.workspace.fs.writeFile(callableUri, new TextEncoder().encode(source)),
                vscode.workspace.fs.writeFile(harnessUri, new TextEncoder().encode(harness)),
            ]);
            throwIfCancellationRequested(token);

            const result = await session.checkSyntax(harnessUri);
            const checked = result?.checked ?? [];
            const issues = normalizeSyntaxIssues(result?.errors ?? [], checked, harnessUri.fsPath, true);
            if (!hasSyntaxCheckEvidence(issues, checked)) {
                const detail = toolchainFailureDetail(issues);
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(JSON.stringify({
                        status: "unavailable",
                        callable: { kind: callable.kind, exportName },
                        issueCount: 0,
                        checkedFiles: [],
                        issues: [],
                        reason: detail
                            ? localize("ECL Client Tools failed before checking the source: {0}", detail)
                            : localize("ECL Client Tools did not return a compiler result"),
                    }, null, 2))
                ]);
            }
            const status = classifySyntaxStatus(issues);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(JSON.stringify({
                    status,
                    callable: {
                        kind: callable.kind,
                        exportName,
                    },
                    issueCount: issues.length,
                    checkedFiles: checked,
                    issues,
                }, null, 2))
            ]);
        } finally {
            //  Remove only this run's files;  the folder is reused so eclcc's primed workspace stays cached.
            await Promise.all([callableUri, harnessUri].map(async uri => {
                try {
                    await vscode.workspace.fs.delete(uri);
                } catch {
                    // The temporary file may already have been removed by the host.
                }
            }));
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IIntegrationCheckParameters>) {
        const callable = detectECLCallable(options.input.ecl ?? "");
        return {
            invocationMessage: localize("Compiling {0} with an integration harness", callable?.kind ?? "callable ECL"),
            confirmationMessages: {
                title: localize("Check callable ECL integration"),
                message: new vscode.MarkdownString(localize("Compile the callable and generated BWR harness without executing it?")),
            },
        };
    }
}

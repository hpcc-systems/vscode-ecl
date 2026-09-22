import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import { isPlatformConnected } from "../../../hpccplatform/session";
import { reporter } from "../../../telemetry";
import localize from "../../../util/localize";
import { logToolEvent, requireConnectedSession, throwIfCancellationRequested } from "../utils/index";
import { classifySyntaxStatus, hasSyntaxCheckEvidence, normalizeSyntaxIssues, toolchainFailureDetail } from "../syntaxResult";

export interface ISyntaxCheckParameters {
    ecl: string;
    filePath?: string;
}

function isContainedIn(folder: vscode.Uri, file: vscode.Uri): boolean {
    const relative = path.relative(path.resolve(folder.fsPath), path.resolve(file.fsPath));
    return relative.length > 0 && !relative.startsWith("..") && !path.isAbsolute(relative);
}

//  Only files inside an open workspace folder may be compiled in place, so a model-supplied path cannot escape the workspace.
async function resolveWorkspaceFile(filePath: string): Promise<vscode.Uri | undefined> {
    const folders = vscode.workspace.workspaceFolders ?? [];
    const candidates = path.isAbsolute(filePath)
        ? [vscode.Uri.file(filePath)]
        : folders.map(folder => vscode.Uri.joinPath(folder.uri, filePath));
    for (const candidate of candidates) {
        if (!folders.some(folder => isContainedIn(folder.uri, candidate))) {
            continue;
        }
        try {
            if ((await vscode.workspace.fs.stat(candidate)).type === vscode.FileType.File) {
                return candidate;
            }
        } catch {
            // Try the next workspace folder.
        }
    }
    return undefined;
}

function sameSource(lhs: string, rhs: string): boolean {
    return lhs.replace(/\r\n/g, "\n").trim() === rhs.replace(/\r\n/g, "\n").trim();
}

//  Checking the original file keeps `$` and relative IMPORTs pointing at its real folder;  a temp copy cannot resolve them.
async function resolveInPlaceTarget(params: ISyntaxCheckParameters): Promise<vscode.Uri | undefined> {
    if (!params.filePath) {
        return undefined;
    }
    const uri = await resolveWorkspaceFile(params.filePath);
    if (!uri) {
        return undefined;
    }
    try {
        const onDisk = new TextDecoder().decode(await vscode.workspace.fs.readFile(uri));
        return sameSource(onDisk, params.ecl) ? uri : undefined;
    } catch {
        return undefined;
    }
}

export class SyntaxCheckTool implements vscode.LanguageModelTool<ISyntaxCheckParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<ISyntaxCheckParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "syntaxCheck" });
        const params = options.input;
        if (typeof params.ecl !== "string" || params.ecl.trim().length === 0) {
            throw new vscode.LanguageModelError(localize("ECL code is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("syntaxCheck", "invoke start", { inputLength: params.ecl.length });

        let session: ReturnType<typeof requireConnectedSession>;
        try {
            session = requireConnectedSession();
        } catch (error) {
            if (error instanceof vscode.LanguageModelError && error.cause === "not_connected") {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(JSON.stringify({
                        status: "unavailable",
                        issueCount: 0,
                        checkedFiles: [],
                        issues: [],
                        reason: localize("HPCC Platform not connected"),
                    }, null, 2))
                ]);
            }
            throw error;
        }

        const inPlaceUri = await resolveInPlaceTarget(params);
        //  A small dedicated folder:  eclcc runs with this as its cwd, and the ECL workspace it primes walks the whole folder.
        const tmpFolder = vscode.Uri.joinPath(vscode.Uri.file(os.tmpdir()), "vscode-ecl-syntax-check");
        const tmpUri = vscode.Uri.joinPath(tmpFolder, `ecl_syntax_check_${Date.now()}.ecl`);
        const checkUri = inPlaceUri ?? tmpUri;
        const detached = !inPlaceUri;

        try {
            if (detached) {
                await vscode.workspace.fs.createDirectory(tmpFolder);
                await vscode.workspace.fs.writeFile(tmpUri, new TextEncoder().encode(params.ecl));
            }

            throwIfCancellationRequested(token);

            const result = await session.checkSyntax(checkUri);

            throwIfCancellationRequested(token);

            const errors = result?.errors ?? [];
            const checked = result?.checked ?? [];
            const issues = normalizeSyntaxIssues(errors, checked, checkUri.fsPath, detached);
            if (!hasSyntaxCheckEvidence(issues, checked)) {
                const detail = toolchainFailureDetail(issues);
                logToolEvent("syntaxCheck", "invoke unavailable", { detail });
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(JSON.stringify({
                        status: "unavailable",
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
            const issueCount = issues.length;
            const checkedCount = checked.length;

            const parts: vscode.LanguageModelTextPart[] = [];
            parts.push(new vscode.LanguageModelTextPart(JSON.stringify({
                status,
                scope: detached ? "snippet" : "file",
                checkedPath: detached ? undefined : vscode.workspace.asRelativePath(checkUri, false),
                issueCount,
                checkedFiles: checked,
                issues,
            }, null, 2)));

            logToolEvent("syntaxCheck", "invoke success", {
                issueCount,
                checkedCount,
                filesChecked: checked,
                detached,
            });

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logToolEvent("syntaxCheck", "invoke failed", { error: message });
            throw new vscode.LanguageModelError(localize("Error checking syntax: {0}", message), { cause: error });
        } finally {
            if (detached) {
                try {
                    await vscode.workspace.fs.delete(tmpUri);
                } catch {
                    // ignore
                }
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

import * as vscode from "vscode";
import { reporter } from "../../../telemetry";
import localize from "../../../util/localize";
import { logToolEvent, throwIfCancellationRequested } from "../utils";
import { fetchContext, fetchIndexes, Hit } from "../../docs/onlineHelp";
import { checkModelExists } from "../utils/model";
import { isECLContext } from "../utils/eclContext";

export interface IECLDocsParameters {
    query: string;
}

export class ECLDocsTool implements vscode.LanguageModelTool<IECLDocsParameters> {
    private modelPath: Promise<vscode.Uri>;
    private docsPath: vscode.Uri;

    constructor(ctx: vscode.ExtensionContext) {
        this.modelPath = checkModelExists(ctx);
        this.docsPath = vscode.Uri.joinPath(ctx.extensionUri, "dist", "docs.vecdb");
    }

    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IECLDocsParameters>,
        _token: vscode.CancellationToken
    ): Promise<vscode.PreparedToolInvocation> {
        const query = options.input.query || "ECL documentation";
        const inECLContext = isECLContext();

        return {
            invocationMessage: inECLContext
                ? localize("Searching ECL documentation for: {0}", query)
                : localize("Searching ECL documentation for: {0}", query)
        };
    }

    async invoke(options: vscode.LanguageModelToolInvocationOptions<IECLDocsParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "eclDocs" });
        const params = options.input;

        if (typeof params.query !== "string" || params.query.trim().length === 0) {
            throw new vscode.LanguageModelError(localize("Documentation query is required"), { cause: "invalid_parameters" });
        }

        logToolEvent("eclDocs", "invoke start", { queryLength: params.query.length });

        try {
            throwIfCancellationRequested(token);

            // Fetch relevant documentation context using the vector database
            const hits = await fetchContext(params.query, this.modelPath, this.docsPath);

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            if (!hits.length) {
                // No direct hits - fetch index and suggest links
                const indexes = await fetchIndexes();
                parts.push(new vscode.LanguageModelTextPart(
                    localize("No exact documentation match found. Here are relevant ECL documentation resources:")
                ));

                const suggestions = indexes.slice(0, 5).map((hit: Hit, idx: number) => {
                    return `${idx + 1}. ${hit.label || "Documentation"}: ${hit.url || ""}`;
                }).join("\n");

                parts.push(new vscode.LanguageModelTextPart(suggestions));

                logToolEvent("eclDocs", "invoke success - no hits", {
                    query: params.query,
                    suggestionsCount: indexes.length,
                });
            } else {
                // Found relevant documentation
                parts.push(new vscode.LanguageModelTextPart(
                    localize("Found {0} relevant documentation section(s):", hits.length.toString())
                ));

                const documentation = hits.map((hit: Hit, idx: number) => {
                    const title = hit.label ? `**${hit.label}**` : localize("Documentation Section {0}", (idx + 1).toString());
                    const url = hit.url ? `\n${localize("URL")}: ${hit.url}` : "";
                    const content = hit.content ? `\n\n${hit.content}` : "";

                    return `${idx + 1}. ${title}${url}${content}`;
                }).join("\n\n---\n\n");

                parts.push(new vscode.LanguageModelTextPart(documentation));

                logToolEvent("eclDocs", "invoke success", {
                    query: params.query,
                    hitsCount: hits.length,
                });
            }

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            logToolEvent("eclDocs", "invoke error", {
                error: error instanceof Error ? error.message : String(error),
            });

            if (error instanceof vscode.LanguageModelError) {
                throw error;
            }

            const errorMsg = error instanceof Error ? error.message : localize("Unknown error occurred");
            throw new vscode.LanguageModelError(
                localize("Failed to search ECL documentation: {0}", errorMsg),
                { cause: error }
            );
        }
    }
}

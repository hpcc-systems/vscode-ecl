import * as vscode from "vscode";
import { fetchContext, fetchIndexes } from "../../docs";
import { reporter } from "../../../telemetry";
import localize from "../../../util/localize";
import { logToolEvent, throwIfCancellationRequested } from "../utils/index";
import { checkModelExists } from "../utils/model";

export interface IECLDocsLookupParameters {
    query: string;
}

export class ECLDocsLookupTool implements vscode.LanguageModelTool<IECLDocsLookupParameters> {
    private modelPath: Promise<vscode.Uri>;
    private docsPath: vscode.Uri;

    constructor(ctx: vscode.ExtensionContext) {
        this.modelPath = checkModelExists(ctx);
        this.docsPath = vscode.Uri.joinPath(ctx.extensionUri, "dist", "docs.vecdb");
    }

    async invoke(options: vscode.LanguageModelToolInvocationOptions<IECLDocsLookupParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "eclDocsLookup" });
        const params = options.input;
        const query = typeof params.query === "string" ? params.query.trim() : "";
        if (query.length === 0) {
            throw new vscode.LanguageModelError(localize("Query is required for ECL documentation lookup"), { cause: "invalid_parameters" });
        }

        logToolEvent("eclDocsLookup", "invoke start", { queryLength: query.length });

        try {
            throwIfCancellationRequested(token);

            // Fetch relevant documentation using RAG (Retrieval-Augmented Generation)
            const hits = await fetchContext(query, this.modelPath, this.docsPath);

            throwIfCancellationRequested(token);

            const parts: vscode.LanguageModelTextPart[] = [];

            if (hits.length === 0) {
                // Fall back to suggesting web links from the indexes
                const indexHits = await fetchIndexes();
                parts.push(new vscode.LanguageModelTextPart(
                    localize("No specific documentation found for query: {0}. Suggesting general ECL documentation sources:", query)
                ));

                const friendlyLabels = [
                    localize("ECL Language Reference"),
                    localize("Standard Library Documentation"),
                    localize("Programmer's Guide")
                ];

                const suggestedLinks = indexHits
                    .map((hit, idx) => {
                        const label = friendlyLabels[idx] ?? localize("ECL Documentation");
                        return `${idx + 1}. ${label}: ${hit.url}`;
                    })
                    .join("\n");

                parts.push(new vscode.LanguageModelTextPart(
                    `${localize("Available Documentation:")}\n${suggestedLinks}`
                ));

                logToolEvent("eclDocsLookup", "invoke no hits", {
                    query,
                    indexCount: indexHits.length
                });
            } else {
                // Create summary with URLs first - this ensures the LM shows them to users
                const urlList = hits.map((hit, idx) => `${idx + 1}. ${hit.label}: ${hit.url}`).join("\n");

                parts.push(new vscode.LanguageModelTextPart(
                    `Authoritative documentation sources for this answer. Cite only URLs from this list when referencing the docs, and do not invent or guess additional links:\n\n${urlList}\n\n`
                ));

                // Format each documentation hit with its content
                const formattedHits = hits.map((hit, idx) => {
                    const header = `## ${idx + 1}. ${hit.label}`;
                    const content = hit.content ? `\n${hit.content}` : "";
                    const error = hit.error ? `\n**Error:** ${hit.error}\n` : "";
                    return `${header}${content}${error}`;
                }).join("\n\n---\n\n");

                parts.push(new vscode.LanguageModelTextPart(formattedHits));

                logToolEvent("eclDocsLookup", "invoke success", {
                    query,
                    hitCount: hits.length,
                    hits: hits.map(h => ({ label: h.label, url: h.url }))
                });
            }

            return new vscode.LanguageModelToolResult(parts);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logToolEvent("eclDocsLookup", "invoke failed", { error: message, query });
            throw new vscode.LanguageModelError(
                localize("Error looking up ECL documentation: {0}", message),
                { cause: error }
            );
        }
    }

    async prepareInvocation(options: vscode.LanguageModelToolInvocationPrepareOptions<IECLDocsLookupParameters>, _token: vscode.CancellationToken) {
        const queryPreview = options.input.query
            ? `\n\nQuery: "${options.input.query.slice(0, 100)}${options.input.query.length > 100 ? "…" : ""}"`
            : "";

        return {
            invocationMessage: localize("Looking up ECL documentation for: {0}", options.input.query || ""),
            confirmationMessages: {
                title: localize("Lookup ECL Documentation"),
                message: new vscode.MarkdownString(
                    localize("Search ECL documentation using AI-powered retrieval?") + queryPreview
                ),
            },
        };
    }
}

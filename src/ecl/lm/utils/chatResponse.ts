import * as vscode from "vscode";
import { BasePromptElementProps, PromptElementCtor, renderPrompt } from "@vscode/prompt-tsx";
import { MODEL_SELECTOR } from "../constants";
import { isToolValidatedForSource, MAX_REPAIR_ATTEMPTS, MAX_TOOL_ITERATIONS, nextRequiredTool, normalizeECLSource } from "../orchestration";
import { detectECLCallable, hasTerminalAction } from "../callable";

export interface PromptProps extends BasePromptElementProps {
    userQuery: string;
}

export interface IChatToolOptions {
    toolInvocationToken: vscode.ChatParticipantToolToken;
    progress: (message: string) => void;
    requiredTools?: string[];
    requireCallableIntegration?: boolean;
}

function toolResultNeedsRetry(toolName: string, result: vscode.LanguageModelToolResult): boolean {
    if (toolName !== "ecl-extension-eclCodeReview" && toolName !== "ecl-extension-syntaxCheck" && toolName !== "ecl-extension-integrationCheck") {
        return false;
    }
    const text = result.content.find(part => part instanceof vscode.LanguageModelTextPart);
    if (!(text instanceof vscode.LanguageModelTextPart)) {
        return false;
    }
    try {
        const status = JSON.parse(text.value)?.status;
        return status === "changes_required" || status === "fail";
    } catch {
        return false;
    }
}

// Only inspect fenced ```ecl blocks so prose mentioning FUNCTION/MODULE/etc. can't trigger a false-positive callable gate.
function extractECLCodeBlocks(markdown: string): string {
    const blocks: string[] = [];
    const fence = /```ecl\s*([\s\S]*?)```/gi;
    for (let match = fence.exec(markdown); match; match = fence.exec(markdown)) {
        blocks.push(match[1]);
    }
    return blocks.join("\n");
}

function toolCallECL(input: object): unknown {
    return "ecl" in input ? input.ecl : undefined;
}

export async function getChatResponse<T extends PromptElementCtor<P, any>, P extends PromptProps>(
    prompt: T,
    promptProps: P,
    token: vscode.CancellationToken,
    toolOptions?: IChatToolOptions
): Promise<string> {
    const models = await vscode.lm.selectChatModels({ vendor: MODEL_SELECTOR.vendor });
    if (!models.length) {
        throw new Error("No model found");
    }

    const model = models[0];
    const rendered = await renderPrompt(prompt, promptProps, { modelMaxPromptTokens: model.maxInputTokens }, model as any);
    const messages = [...rendered.messages];
    const tools = toolOptions ? vscode.lm.tools
        .filter(tool => tool.name.startsWith("ecl-extension-"))
        .map(tool => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
        })) : [];
    const toolValidations = new Map<string, { source: string, sequence: number }>();
    const toolFailures = new Map<string, number>();
    //  Tools the user declined, or that repeatedly failed - gating on them would discard an otherwise usable answer.
    const abandonedTools = new Set<string>();
    const isGateable = (name: string) => tools.some(tool => tool.name === name) && !abandonedTools.has(name);
    let toolSequence = 0;
    let forcedTool: string | undefined;
    let lastResponseText = "";

    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; ++iteration) {
        const forced = forcedTool && isGateable(forcedTool) ? forcedTool : undefined;
        const availableTools = forced ? tools.filter(tool => tool.name === forced) : tools;
        const response = await model.sendRequest(messages, {
            justification: "Answer the user's ECL development request using vscode-ecl tools.",
            tools: availableTools,
            toolMode: forced ? vscode.LanguageModelChatToolMode.Required : vscode.LanguageModelChatToolMode.Auto,
        }, token);
        forcedTool = undefined;

        const assistantParts: Array<vscode.LanguageModelTextPart | vscode.LanguageModelToolCallPart> = [];
        const text: string[] = [];
        const calls: vscode.LanguageModelToolCallPart[] = [];

        for await (const part of response.stream) {
            if (part instanceof vscode.LanguageModelTextPart) {
                assistantParts.push(part);
                text.push(part.value);
            } else if (part instanceof vscode.LanguageModelToolCallPart) {
                assistantParts.push(part);
                calls.push(part);
            }
        }

        if (calls.length === 0) {
            const responseText = text.join("");
            lastResponseText = responseText;
            const eclCode = extractECLCodeBlocks(responseText);
            const requiredTools = (toolOptions?.requiredTools ?? []).filter(isGateable);
            const missingTool = nextRequiredTool(requiredTools, toolValidations, eclCode);
            if (missingTool) {
                messages.push(vscode.LanguageModelChatMessage.Assistant(responseText));
                messages.push(vscode.LanguageModelChatMessage.User(
                    `Before returning the answer, call ${missingTool} with the exact ECL source you propose. Revise the source first if an earlier tool reported a failure.`
                ));
                forcedTool = missingTool;
                continue;
            }
            if (
                toolOptions?.requireCallableIntegration &&
                eclCode &&
                isGateable("ecl-extension-integrationCheck") &&
                detectECLCallable(eclCode) &&
                !hasTerminalAction(eclCode) &&
                !isToolValidatedForSource("ecl-extension-integrationCheck", toolValidations, eclCode)
            ) {
                messages.push(vscode.LanguageModelChatMessage.Assistant(responseText));
                messages.push(vscode.LanguageModelChatMessage.User(
                    "The proposed ECL is callable. Generate a minimal BWR harness with representative sample data, then call ecl-extension-integrationCheck before returning the final answer."
                ));
                forcedTool = "ecl-extension-integrationCheck";
                continue;
            }
            return responseText;
        }

        messages.push(vscode.LanguageModelChatMessage.Assistant(assistantParts));
        const results: vscode.LanguageModelToolResultPart[] = [];
        for (const call of calls) {
            if (token.isCancellationRequested) {
                throw new vscode.CancellationError();
            }
            toolOptions?.progress(`Using ${call.name}`);
            let result: vscode.LanguageModelToolResult;
            let declined = false;
            try {
                result = await vscode.lm.invokeTool(call.name, {
                    input: call.input,
                    toolInvocationToken: toolOptions?.toolInvocationToken,
                }, token);
            } catch (error) {
                if (token.isCancellationRequested) {
                    throw error;
                }
                //  A CancellationError without a cancelled token means the user declined the tool confirmation.
                declined = error instanceof vscode.CancellationError;
                // Surface the failure to the model as a tool result instead of aborting the whole turn.
                const message = error instanceof Error ? error.message : String(error);
                result = new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(JSON.stringify({
                        status: declined ? "declined" : "fail",
                        error: message,
                    }, null, 2))
                ]);
            }
            if (declined) {
                abandonedTools.add(call.name);
                toolValidations.delete(call.name);
            } else if (toolResultNeedsRetry(call.name, result)) {
                toolValidations.delete(call.name);
                const failures = (toolFailures.get(call.name) ?? 0) + 1;
                toolFailures.set(call.name, failures);
                if (failures >= MAX_REPAIR_ATTEMPTS) {
                    abandonedTools.add(call.name);
                }
            } else {
                toolValidations.set(call.name, {
                    source: normalizeECLSource(toolCallECL(call.input)),
                    sequence: toolSequence++,
                });
            }
            results.push(new vscode.LanguageModelToolResultPart(call.callId, result.content));
        }
        messages.push(vscode.LanguageModelChatMessage.User(results));
    }

    if (lastResponseText) {
        return lastResponseText;
    }
    throw new vscode.LanguageModelError("The ECL assistant exceeded the tool-call limit.", { cause: "tool_limit" });
}

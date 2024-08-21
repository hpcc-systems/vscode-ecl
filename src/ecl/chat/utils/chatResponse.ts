import * as vscode from "vscode";
import { BasePromptElementProps, PromptElementCtor, renderPrompt } from "@vscode/prompt-tsx";
import { MODEL_SELECTOR } from "../constants";

export interface PromptProps extends BasePromptElementProps {
    userQuery: string;
}

export async function getChatResponse<T extends PromptElementCtor<P, any>, P extends PromptProps>(prompt: T, promptProps: P, token: vscode.CancellationToken): Promise<Thenable<vscode.LanguageModelChatResponse>> {
    const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
    if (model) {
        const { messages } = await renderPrompt(prompt, promptProps, { modelMaxPromptTokens: model.maxInputTokens }, model);
        return await model.sendRequest(messages, {}, token);
    } else {
        throw new Error("No model found");
    }
}


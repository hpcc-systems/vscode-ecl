import * as vscode from "vscode";
import { BasePromptElementProps, PromptElementCtor, renderPrompt } from "@vscode/prompt-tsx";
import { MODEL_SELECTOR } from "../constants";

export interface PromptProps extends BasePromptElementProps {
    userQuery: string;
}

export async function getChatResponse<T extends PromptElementCtor<P, any>, P extends PromptProps>(prompt: T, promptProps: P, token: vscode.CancellationToken): Promise<Thenable<vscode.LanguageModelChatResponse>> {
    const models = await vscode.lm.selectChatModels({ family: MODEL_SELECTOR.family, vendor: MODEL_SELECTOR.vendor });
    if (models.length) {
        const { messages } = await renderPrompt(prompt, promptProps, { modelMaxPromptTokens: models[0].maxInputTokens }, models[0] as any);
        return await models[0].sendRequest(messages, {}, token);
    } else {
        throw new Error("No model found");
    }
}


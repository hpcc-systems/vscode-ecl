import * as vscode from "vscode";
import { AssistantMessage, BasePromptElementProps, PromptElement, PromptSizing, TextChunk, UserMessage, } from "@vscode/prompt-tsx";
import { commands, MODEL_SELECTOR } from "../../lm/constants";
import { getChatResponse } from "../../lm/utils/index";
import { fetchContext, fetchIndexes, Hit, matchTopics } from "../../docs";
import * as prompts from "./templates/default";
import { ECLTaskKind, requiresQualityPipeline } from "../orchestration";

export interface PromptProps extends BasePromptElementProps {
    userQuery: string;
}

export interface DocsPromptProps extends PromptProps {
    hits: Hit[];
    taskKind: ECLTaskKind;
    workspaceContext: string;
}

export class DocsPrompt extends PromptElement<DocsPromptProps, any> {

    render(state: void, sizing: PromptSizing) {
        return (
            <>
                <AssistantMessage priority={1000}>{prompts.SYSTEM_MESSAGE}</AssistantMessage>
                <UserMessage priority={500}>
                    {this.props.hits.map((hit, idx) => (
                        <TextChunk breakOn=' '>
                            {JSON.stringify(hit)}
                        </TextChunk>
                    ))}
                </UserMessage>
                <UserMessage priority={700}>{`Task classification: ${this.props.taskKind}`}</UserMessage>
                {this.props.workspaceContext && <UserMessage priority={800}>{this.props.workspaceContext}</UserMessage>}
                <UserMessage priority={1000}>{this.props.userQuery}</UserMessage>
            </>
        );
    }
}

export async function handleDocsCommand(
    request: vscode.ChatRequest,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken,
    modelPath: Promise<vscode.Uri>,
    docsPath: vscode.Uri,
    taskKind: ECLTaskKind,
    workspaceContext: string
): Promise<{ metadata: { command: string, hits: Hit[] } }> {
    const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
    if (model) {
        const hits = await fetchContext(request.prompt, modelPath, docsPath);
        let promptProps: DocsPromptProps;
        if (!hits.length) {
            promptProps = {
                userQuery: `Suggest several (more 3 or more) web links that exist in the previous html content above that might help with the following question "${request.prompt}".  The user can not see the above content. Explain why they might be helpful`,
                hits: await fetchIndexes(),
                taskKind,
                workspaceContext,
            };
        } else {
            promptProps = {
                userQuery: request.prompt,
                hits,
                taskKind,
                workspaceContext,
            };
        }

        const requiresWrite = requiresQualityPipeline(taskKind);
        const response = await getChatResponse(DocsPrompt, promptProps, token, {
            toolInvocationToken: request.toolInvocationToken,
            progress: message => stream.progress(message),
            requiredTools: requiresWrite
                ? ["ecl-extension-eclCodeReview", "ecl-extension-syntaxCheck"]
                : taskKind === "review"
                    ? ["ecl-extension-eclCodeReview"]
                    : taskKind === "compile"
                        ? ["ecl-extension-syntaxCheck"]
                        : [],
            requireCallableIntegration: requiresWrite,
        });
        stream.markdown(response);

        return {
            metadata: {
                command: commands.DOCS,
                hits: promptProps.hits,
            },
        };
    }
}

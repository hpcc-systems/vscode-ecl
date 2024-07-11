import { renderPrompt } from "@vscode/prompt-tsx";
import * as vscode from "vscode";
import { SummarizePrompt, CommentPrompt, CommentDetailedPrompt, CommentTersePrompt, FollowupQuestionsPrompt, GeneralECLQuestion } from "./prompts"

const ECLAGENT_SUMMARIZE_COMMAND = "eclagent.summarizeFileContent";
const ECLAGENT_COMMENT_COMMAND = "eclagent.commentFileContent";
const ECLAGENT_REVERT_COMMAND = "eclagent.revertFileContent";
const ECLAGENT_PARTICIPANT_ID = "chat-sample.eclagent";

const ECLTEACH_TOPICS = [
    "Overview ",
    "Constants",
    "Environment Variables",
    "Definitions",
    "Basic Definition Types",
    "Recordset Filtering",
    "Function Definitions (Parameter Passing)",
    "Definition Visibility",
    "Field and Definition Qualification",
    "Actions and Definitions"
];

interface ICatChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: "copilot", family: "gpt-3.5-turbo" };

let lastPrompt = {command: ECLAGENT_SUMMARIZE_COMMAND, prompt: SummarizePrompt};

export function activate(context: vscode.ExtensionContext) {

    // Define a eclagent chat handler. 
    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<ICatChatResult | undefined> => {
        // To talk to an LLM in your subcommand handler implementation, your
        // extension can use VS Code"s `requestChatAccess` API to access the Copilot API.
        // The GitHub Copilot Chat extension implements this provider.

        if (request.command == "summarize") {
            stream.progress("Summarizing your file...");
            vscode.commands.executeCommand(ECLAGENT_SUMMARIZE_COMMAND);
        }
        else if (request.command == "comment") {
            stream.progress("Commenting your file...");
            await vscode.commands.executeCommand(ECLAGENT_COMMENT_COMMAND, {prompt: CommentDetailedPrompt});
        }
        else if (request.command == "revert") {
            stream.progress("Reverting your file...");
            vscode.commands.executeCommand(ECLAGENT_REVERT_COMMAND);
        }
        else if (request.command == "teach") {
            stream.progress("Picking the right topic to teach...");
            const topic = getTopic(context.history);
            try {
                const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
                if (model) {
                    let messages = [
                        vscode.LanguageModelChatMessage.User("You are an ECL language expert! Your job is to explain ECL concepts. Always start your response by stating what concept you are explaining. Always include code samples."),
                            vscode.LanguageModelChatMessage.User(topic)
                    ];
                    let chatResponse = await model.sendRequest(messages, {}, token);
                    stream.markdown(`## Topic: ${topic}\n`);
                    for await (const fragment of chatResponse.text) {
                        stream.markdown(fragment);
                    }

                    await followupQuestions(eclagent, topic, model, request, context, stream, token);
                }
            } catch(err) {
                handleError(err, stream);
            }

            return { metadata: { command: "teach" } };
        } else {
            try {
                const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
                if (model) {
                    const { messages } = await renderPrompt(
                        GeneralECLQuestion,
                        { userQuery: request.prompt, topic: "ECL"},
                        { modelMaxPromptTokens: model.maxInputTokens },
                        model);
                    const chatResponse = await model.sendRequest(messages, {}, token);
                    for await (const fragment of chatResponse.text) {
                        stream.markdown(fragment);
                    }
                    await followupQuestions(eclagent, request.prompt, model, request, context, stream, token);
                }
            } catch(err) {
                handleError(err, stream);
            }

            return { metadata: { command: "" } };
        }
    };

    // Chat participants appear as top-level options in the chat input
    // when you type `@`, and can contribute sub-commands in the chat input
    // that appear when you type `/`.
    const eclagent = vscode.chat.createChatParticipant(ECLAGENT_PARTICIPANT_ID, handler);
    eclagent.iconPath = vscode.Uri.joinPath(context.extensionUri, "hpcc-icon.png");
    eclagent.followupProvider = {
        provideFollowups(result: ICatChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
            return [{
                prompt: "show me another topic",
                label: vscode.l10n.t("Show me another topic"),
                command: '/teach'
            } satisfies vscode.ChatFollowup];
        }
    };

    context.subscriptions.push(
        eclagent,
        vscode.commands.registerTextEditorCommand("eclagent.redoPrompt", async (textEditor: vscode.TextEditor) => {
            vscode.commands.executeCommand(ECLAGENT_REVERT_COMMAND).then(() => {
                vscode.commands.executeCommand(lastPrompt.command, {prompt: lastPrompt.prompt});
            });
        })
    );

    context.subscriptions.push(
        eclagent,
        vscode.commands.registerTextEditorCommand("eclagent.commentDetailedFileContent", async (textEditor: vscode.TextEditor) => {
            vscode.commands.executeCommand(ECLAGENT_COMMENT_COMMAND, {prompt: CommentDetailedPrompt});
        })
    );

    context.subscriptions.push(
        eclagent,
        vscode.commands.registerTextEditorCommand("eclagent.commentTerseFileContent", async (textEditor: vscode.TextEditor) => {
            vscode.commands.executeCommand(ECLAGENT_COMMENT_COMMAND, {prompt: CommentTersePrompt});
        })
    );

    context.subscriptions.push(
        eclagent,
        // Register the command handler for the /meow followup
        vscode.commands.registerTextEditorCommand(ECLAGENT_SUMMARIZE_COMMAND, async (textEditor: vscode.TextEditor) => {
            // Replace all variables in active editor with eclagent names and words
            const text = textEditor.document.getText();

            let chatResponse: vscode.LanguageModelChatResponse | undefined;
            try {
                const [model] = await vscode.lm.selectChatModels({ vendor: "copilot", family: "gpt-3.5-turbo" });
                if (!model) {
                    console.log("Model not found. Please make sure the GitHub Copilot Chat extension is installed and enabled.")
                    return;
                }

                const { messages } = await renderPrompt(
                    SummarizePrompt,
                    { userQuery: text, topic: "ECL"},
                    { modelMaxPromptTokens: model.maxInputTokens },
                    model);
                chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
                lastPrompt = {command: ECLAGENT_SUMMARIZE_COMMAND, prompt: SummarizePrompt};

            } catch (err) {
                if (err instanceof vscode.LanguageModelError) {
                    console.log(err.message, err.code, err.cause)
                } else {
                    throw err;
                }
                return;
            }

            // Stream the code into the editor as it is coming in from the Language Model
            try {
                const firstLine = new vscode.Position(0, 0);
                const startLine = new vscode.Position(2, 0);
                textEditor.selection = new vscode.Selection(firstLine, firstLine);

                await textEditor.edit(edit => {
                    edit.insert(firstLine, "/*\n\n\n\n*/\n\n");
                });

                let first = true;
                for await (const fragment of chatResponse.text) {
                    await textEditor.edit(edit => {
                        const cursorPosition = first? startLine : textEditor.selection.active; 
                        first = false;
                        edit.insert(cursorPosition, fragment);
                        const ppp = new vscode.Position(cursorPosition.line, cursorPosition.character + fragment.length);
                        textEditor.selection = new vscode.Selection(ppp, ppp);
                    });
                }

            } catch (err) {
                // async response stream may fail, e.g network interruption or server side error
                await textEditor.edit(edit => {
                    const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                    const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                    edit.insert(position, (<Error>err).message);
                });
            }
        }),
    );

    context.subscriptions.push(
        eclagent,
        // Register the command handler for the /meow followup
        vscode.commands.registerTextEditorCommand(ECLAGENT_COMMENT_COMMAND, async (textEditor: vscode.TextEditor, edit, args) => {
            const text = textEditor.document.getText();

            let chatResponse: vscode.LanguageModelChatResponse | undefined;
            try {
                const [model] = await vscode.lm.selectChatModels({ vendor: "copilot", family: "gpt-3.5-turbo" });
                if (!model) {
                    console.log("Model not found. Please make sure the GitHub Copilot Chat extension is installed and enabled.")
                    return;
                } 

                let prompt = CommentPrompt;
                if (args.prompt !== undefined) {
                    prompt = args.prompt;
                }

                const { messages } = await renderPrompt(
                    prompt,
                    { userQuery: text, topic: "ECL"},
                    { modelMaxPromptTokens: model.maxInputTokens },
                    model);

                chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
                lastPrompt = {command: ECLAGENT_COMMENT_COMMAND, prompt: prompt};

            } catch (err) {
                if (err instanceof vscode.LanguageModelError) {
                    console.log(err.message, err.code, err.cause)
                } else {
                    throw err;
                }
                return;
            }
            
            await textEditor.edit(edit => {
                const start = new vscode.Position(0, 0);
                const end = new vscode.Position(textEditor.document.lineCount - 1, textEditor.document.lineAt(textEditor.document.lineCount - 1).text.length);
                edit.delete(new vscode.Range(start, end));
            });

            // Stream the code into the editor as it is coming in from the Language Model
            try {
                for await (const fragment of chatResponse.text) {
                    await textEditor.edit(edit => {
                        const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                        const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                        edit.insert(position, fragment);
                    });
                }

            } catch (err) {
                // async response stream may fail, e.g network interruption or server side error
                await textEditor.edit(edit => {
                    const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
                    const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
                    edit.insert(position, (<Error>err).message);
                });
            }
        }),
    );

    context.subscriptions.push(
        eclagent,
        // Register the command handler for the /meow followup
        vscode.commands.registerTextEditorCommand(ECLAGENT_REVERT_COMMAND, async (textEditor: vscode.TextEditor) => {

            const filePath = textEditor.document.uri.fsPath;
            try {
                const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
                const newText = Buffer.from(fileContent).toString("utf-8").substring(1);
                await textEditor.edit((editBuilder) => {
                    const firstLine = new vscode.Position(0, 0);
                    editBuilder.replace(new vscode.Range(firstLine, textEditor.document.positionAt(textEditor.document.getText().length)), newText);
                });
            } catch (error) {
                console.error("Error reading file:", error);
            }
        }),
    );
}

async function followupQuestions(eclagent: vscode.ChatParticipant, topic: string, model: vscode.LanguageModelChat, request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<ICatChatResult | undefined> {
    let chatResponse = undefined;
    try {
        const { messages } = await renderPrompt(
            FollowupQuestionsPrompt,
            { userQuery: request.prompt, topic: topic},
            { modelMaxPromptTokens: model.maxInputTokens },
            model);
        chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);

    } catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            console.log(err.message, err.code, err.cause)
        } else {
            throw err;
        }
        return;
    }

    if (!chatResponse) {
        return { metadata: { command: "teach" } };
    }
    try {
        let answer = "";
        for await (const fragment of chatResponse.text) {
            answer += fragment;
        }
        stream.markdown("\n## Follow up questions:\n");
        const lines = answer.split("\n");
        let questions = [];
        let count = 0;
        for (const line of lines) {
            if (/^\d/.test(line) || line.startsWith("*")) {
                const index = line.indexOf(' ');
                const str = index !== -1 ? line.substring(index + 1) : line;
                questions.push(str);
                // stream.markdown(`${str}\n`);
                count++;
            }
            if (count >= 3) {
                break;
            }
        }

        const followups: vscode.ChatFollowup[] = [];
        for (let i = 0; i < count; i++) {
            const question = questions[i];
            followups.push({
                prompt: question,
                command: "",
                label: vscode.l10n.t(question)
            });
        }
        followups.push({
            prompt: "show me another topic",
            label: vscode.l10n.t("Show me another topic"),
            command: ""
        });
        eclagent.followupProvider = {
            provideFollowups(result: ICatChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
                return followups;
            }
        };
    }
     catch (err) {
        let donothing = true;
    }
}

function handleError(err: any, stream: vscode.ChatResponseStream): void {
    // making the chat request might fail because
    // - model does not exist
    // - user consent not given
    // - quote limits exceeded
    if (err instanceof vscode.LanguageModelError) {
        console.log(err.message, err.code, err.cause);
        if (err.cause instanceof Error && err.cause.message.includes("off_topic")) {
            stream.markdown(vscode.l10n.t("I'm sorry, I can only explain computer science concepts."));
        }
    } else {
        // re-throw other errors so they show up in the UI
        throw err;
    }
}

// Get a random topic that the eclagent has not taught in the chat history yet
function getTopic(history: ReadonlyArray<vscode.ChatRequestTurn | vscode.ChatResponseTurn>): string {
    const topics = ECLTEACH_TOPICS;
    // Filter the chat history to get only the responses from the eclagent
    const previousCatResponses = history.filter(h => {
        return h instanceof vscode.ChatResponseTurn && h.participant == ECLAGENT_PARTICIPANT_ID
    }) as vscode.ChatResponseTurn[];
    // Filter the topics to get only the topics that have not been taught by the eclagent yet
    const topicsNoRepetition = topics.filter(topic => {
        return !previousCatResponses.some(catResponse => {
            return catResponse.response.some(r => {
                return r instanceof vscode.ChatResponseMarkdownPart && r.value.value.includes(topic)
            });
        });
    });

    return topicsNoRepetition[Math.floor(Math.random() * topicsNoRepetition.length)] || "I have taught you everything I know. Meow!";
}

export function deactivate() { }

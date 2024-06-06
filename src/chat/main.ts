import * as vscode from "vscode";

const ECLAGENT_NAMES_COMMAND_ID = "eclagent.doSomething";
const ECLAGENT_PARTICIPANT_ID = "chat-ecl.eclagent";

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
interface IECLChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: "copilot", family: "gpt-3.5-turbo" };

export function activate(context: vscode.ExtensionContext) {

    // Define an ECL chat handler. 

    const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, context: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<IECLChatResult> => {
        // To talk to an LLM in your subcommand handler implementation, your
        // extension can use VS Code's `requestChatAccess` API to access the Copilot API.
        // The GitHub Copilot Chat extension implements this provider.

        const config = vscode.workspace.getConfiguration("ecl");
        const languageModelId: string = config.get("languageModel");

        if (request.command == "teach") {
            stream.progress("Picking the right topic to teach...");
            const topic = getTopic(context.history);
            try {
                const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
                if (model) {
                    const messages = [
                        vscode.LanguageModelChatMessage.User("You are an ECL language expert! Your job is to explain ECL concepts. Always start your response by stating what concept you are explaining. Always include code samples."),
                        vscode.LanguageModelChatMessage.User(topic)
                    ];

                    const chatResponse = await model.sendRequest(messages, {}, token);
                    for await (const fragment of chatResponse.text) {
                        stream.markdown(fragment);
                    }
                }
            } catch (err) {
                handleError(err, stream);
            }

            stream.button({
                command: ECLAGENT_NAMES_COMMAND_ID,
                title: vscode.l10n.t("Do something"),
            });

            return { metadata: { command: "teach" } };
            // } else if (request.command == "play") {
            //     stream.progress("Preparing to look at some ECL code...");
            //     const messages = [
            //         vscode.LanguageModelChatMessage.User("You are an ECL language expert! You are also very knowledgable about HPCC."),
            //         vscode.LanguageModelChatMessage.User("Give small random ECL code samples. " + request.prompt)
            //     ];
            //     const chatResponse = await vscode.lm.sendChatRequest(languageModelId, messages, {}, token);
            //     for await (const fragment of chatResponse.stream) {
            //         stream.markdown(fragment);
            //     }
            //     return { metadata: { command: "play" } };
        } else {
            try {
                const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
                if (model) {
                    const messages = [
                        vscode.LanguageModelChatMessage.User(`You are an ECL language expert! Think carefully and step by step like an ECL language expert who is good at explaining something.
                    Your job is to explain computer science concepts in fun and entertaining way. Always start your response by stating what concept you are explaining. Always include code samples.`),
                        vscode.LanguageModelChatMessage.User("In the ECL language, explain " + request.prompt)
                    ];
                    const chatResponse = await model.sendRequest(messages, {}, token);
                    for await (const fragment of chatResponse.text) {
                        // Process the output from the language model
                        stream.markdown(fragment);
                    }
                }
            } catch (err) {
                handleError(err, stream);
            }

            return { metadata: { command: "" } };
        }
    };

    // Chat participants appear as top-level options in the chat input
    // when you type `@`, and can contribute sub-commands in the chat input
    // that appear when you type `/`.
    const eclagent = vscode.chat.createChatParticipant(ECLAGENT_PARTICIPANT_ID, handler);
    eclagent.iconPath = vscode.Uri.joinPath(context.extensionUri, "resources/hpcc-icon.png");
    eclagent.followupProvider = {
        provideFollowups(result: IECLChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
            return [{
                prompt: "let us learn",
                label: vscode.l10n.t("Play with ECL Code"),
                command: "play"
            } satisfies vscode.ChatFollowup];
        }
    };

    vscode.chat.registerChatVariableResolver("ECLAGENT_context", "Describes the state of mind and version of the ECL agent", {
        resolve: (name, context, token) => {
            if (name == "ECLAGENT_context") {
                const mood = Math.random() > 0.5 ? "happy" : "grumpy";
                return [
                    {
                        level: vscode.ChatVariableLevel.Short,
                        value: "version 1.3 " + mood
                    },
                    {
                        level: vscode.ChatVariableLevel.Medium,
                        value: "I am the ECL agent, version 1.3, and I am " + mood
                    },
                    {
                        level: vscode.ChatVariableLevel.Full,
                        value: "I am the ECL agent, version 1.3, and I am " + mood
                    }
                ];
            }
        }
    });

    context.subscriptions.push(
        eclagent,
        // Register the command handler for the do something followup
        vscode.commands.registerTextEditorCommand(ECLAGENT_NAMES_COMMAND_ID, async (textEditor: vscode.TextEditor) => {
            const config = vscode.workspace.getConfiguration("ecl");
            const languageModelId: string = config.get("languageModel");
            const text = textEditor.document.getText();

            let chatResponse: vscode.LanguageModelChatResponse | undefined;
            try {
                const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-3.5-turbo' });
                if (!model) {
                    console.log('Model not found. Please make sure the GitHub Copilot Chat extension is installed and enabled.')
                    return;
                }

                const messages = [
                    vscode.LanguageModelChatMessage.User(`You are an ECL expert! Think carefully and step by step.
                Your job is to be as clear as possible and be encouraging. Be creative. IMPORTANT respond just with code. Do not use markdown!`),
                    vscode.LanguageModelChatMessage.User(text)
                ];

                let chatResponse: vscode.LanguageModelChatResponse | undefined;
                chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);

            } catch (err) {
                // making the chat request might fail because
                // - model does not exist
                // - user consent not given
                // - quote limits exceeded
                if (err instanceof vscode.LanguageModelError) {
                    console.log(err.message, err.code, err.cause);
                } else {
                    throw err;
                }
                return;
            }

            // Clear the editor content before inserting new content
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

// Get a random topic that the ECL agent has not taught in the chat history yet
function getTopic(history: ReadonlyArray<vscode.ChatRequestTurn | vscode.ChatResponseTurn>): string {
    // Filter the chat history to get only the responses from the ecl agent
    const previousEclAgentResponses = history.filter(h => {
        return h instanceof vscode.ChatResponseTurn && h.participant == ECLAGENT_PARTICIPANT_ID;
    }) as vscode.ChatResponseTurn[];
    // Filter the topics to get only the topics that have not been taught by the ecl agent yet
    const topicsNoRepetition = ECLTEACH_TOPICS.filter(topic => {
        return !previousEclAgentResponses.some(eclAgentResponse => {
            return eclAgentResponse.response.some(r => {
                return r instanceof vscode.ChatResponseMarkdownPart && r.value.value.includes(topic);
            });
        });
    });

    return topicsNoRepetition[Math.floor(Math.random() * topicsNoRepetition.length)] || "I have taught you everything I know.";
}

export function deactivate() { }

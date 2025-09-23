import * as vscode from "vscode";
import { commands, getRandomGreeting } from "./constants";
import localize from "../../util/localize";
import { handleDocsCommand } from "./prompts/docs";
import { handleIssueManagement } from "./prompts/issues";
import { checkModelExists } from "./utils/model";

const ECL_PARTICIPANT_ID = "chat.ecl";

interface IECLChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

function handleError(logger: vscode.TelemetryLogger, err: any, stream: vscode.ChatResponseStream): void {
    logger.logError(err);

    if (err instanceof vscode.LanguageModelError) {
        console.log(err.message, err.code, err.cause);
        if (err.cause instanceof Error && err.cause.message.includes("off_topic")) {
            stream.markdown(localize("I'm sorry, I can only explain ECL related topics."));
        }
    } else {
        throw err;
    }
}

let eclChat: ECLChat;

export class ECLChat {
    modelPath: Promise<vscode.Uri>;

    protected constructor(ctx: vscode.ExtensionContext) {
        this.modelPath = checkModelExists(ctx);

        const handler: vscode.ChatRequestHandler = async (request: vscode.ChatRequest, chatCtx: vscode.ChatContext, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<IECLChatResult> => {
            let cmdResult: any;
            stream.progress(localize(getRandomGreeting()));
            try {
                if (request.command === commands.ISSUES) {
                    cmdResult = await handleIssueManagement(request, stream, token);
                    logger.logUsage("request", { kind: commands.ISSUES });
                } else {
                    cmdResult = await handleDocsCommand(request, stream, token, this.modelPath, vscode.Uri.joinPath(ctx.extensionUri, "dist", "docs.vecdb"));
                }
            } catch (err) {
                handleError(logger, err, stream);
            }

            return {
                metadata: {
                    command: request.command || "",
                },
            };

        };

        const chatParticipant = vscode.chat.createChatParticipant(ECL_PARTICIPANT_ID, handler);
        chatParticipant.iconPath = vscode.Uri.joinPath(ctx.extensionUri, "resources/hpcc-icon.png");

        chatParticipant.followupProvider = {
            provideFollowups(result: IECLChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
                return [];
            }
        };

        const logger = vscode.env.createTelemetryLogger({
            sendEventData(eventName, data) {
                // Capture event telemetry
                console.log(`Event: ${eventName}`);
                console.log(`Data: ${JSON.stringify(data)}`);
            },
            sendErrorData(error, data) {
                console.error(`Error: ${error}`);
                console.error(`Data: ${JSON.stringify(data)}`);
            }
        });

        ctx.subscriptions.push(chatParticipant.onDidReceiveFeedback((feedback: vscode.ChatResultFeedback) => {
            logger.logUsage("chatResultFeedback", {
                kind: feedback.kind
            });
        }));
    }

    static attach(ctx: vscode.ExtensionContext): ECLChat {
        if (!eclChat) {
            eclChat = new ECLChat(ctx);
        }
        return eclChat;
    }
}

export function deactivate() { }


import * as vscode from "vscode";
import { BasePromptElementProps, PromptElement, PromptSizing, UserMessage, } from "@vscode/prompt-tsx";
import localize from "../../../util/localize";
import { commands } from "../../lm/constants";
import { Comment, fetchAllIssues, fetchIssueDetailsByNumber, fetchLatestIssueDetails, getGitHubClient, Issue } from "../../lm/utils/github";
import { FETCH_ISSUE_DETAIL_CMD } from "../../lm/constants";
import { getChatResponse } from "../../lm/utils/index";

export const SYSTEM_MESSAGE = `You are a software product owner and you help your developers providing additional information 
for working on current software development task from github issue details.`;

export interface PromptProps extends BasePromptElementProps {
    userQuery: string;
}

export interface IssuesManagePromptProps extends PromptProps {
    issueDetails: string;
}

export interface IssuesManagePromptProps extends PromptProps {
    issueDetails: string;
}

export class IssuesManagePrompt extends PromptElement<IssuesManagePromptProps, any> {

    render(state: void, sizing: PromptSizing) {
        return (
            <>
                <UserMessage>{SYSTEM_MESSAGE}</UserMessage>
                <UserMessage>
                    Here are the Github issue details<br />
                    {this.props.issueDetails} <br />
                    Explain the issue details to the developer and probably provide some additional information.<br />
                    Provide the response in nice markdown format to the user.
                </UserMessage>
            </>
        );
    }
}

// Extracts owner and repo name from the workspace's Git configuration
async function extractRepoDetailsFromWorkspace(): Promise<{ owner: string; repoName: string } | null> {
    const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
    if (!gitExtension) {
        vscode.window.showErrorMessage("Unable to load Git extension");
        return null;
    }

    const api = gitExtension.getAPI(1);
    if (api.repositories.length === 0) {
        vscode.window.showInformationMessage("No Git repositories found");
        return null;
    }

    const repo = api.repositories[0];
    const remotes = repo.state.remotes;
    if (remotes.length === 0) {
        vscode.window.showInformationMessage("No remotes found");
        return null;
    }

    const remoteUrl = remotes[0].fetchUrl;
    const match = remoteUrl?.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/);
    if (!match) {
        vscode.window.showErrorMessage("Unable to parse GitHub repository URL");
        return null;
    }

    return { owner: match[1], repoName: match[2] };
}

function streamIssueDetails(
    stream: vscode.ChatResponseStream,
    issue: any,
    comments: Comment[]
) {
    stream.progress(`Issue "${issue.title}" loaded.`);
    stream.markdown(`Issue: **${issue.title}**\n\n`);
    stream.markdown(issue.body?.replaceAll("\n", "\n> ") + "");
    if (comments?.length > 0) {
        stream.markdown("\n\n_Comments_\n");
        comments?.map((comment) =>
            stream.markdown(`\n> ${comment.body?.replaceAll("\n", "\n> ") + ""}\n`)
        );
    }
    stream.markdown("\n\n----\n\n");
}

async function streamCopilotResponse(stream: vscode.ChatResponseStream, issueDetails: Issue, promptProps: IssuesManagePromptProps, token: vscode.CancellationToken) {
    stream.progress("Copilot suggestion....");
    try {
        const issueDetailsStr = `The issue to work on has the title: "${issueDetails?.title}" and the description: ${issueDetails?.body}. Use that information to give better answer for the following user query.` +
            (issueDetails?.comments && issueDetails?.comments?.length > 0
                ? `Do also regard the comments: ${issueDetails?.comments
                    ?.map((comment) => comment.body)
                    .join("\n\n") + ""
                }`
                : "");
        promptProps.issueDetails = issueDetailsStr;
        const chatResponse = await getChatResponse(IssuesManagePrompt, promptProps, token,);
        for await (const fragment of chatResponse.text) {
            stream.markdown(fragment);
        }
    } catch (error) {
        stream.markdown("Some Network issues. Please try again..");
    }
}

// Main handler for issue management
export async function handleIssueManagement(request: vscode.ChatRequest, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<{ metadata: { command: string } }> {
    const userQuery = request.prompt.toLowerCase();
    const workspaceDetails = await extractRepoDetailsFromWorkspace();
    if (!workspaceDetails) {
        stream.markdown("Repository details not found.");
        return { metadata: { command: commands.ISSUES } };
    }

    const promptProps: IssuesManagePromptProps = {
        userQuery: request.prompt,
        issueDetails: "",
    };

    const octokit = await getGitHubClient();

    // Determine action based on user query
    if (userQuery.includes("latest issue")) {
        const issueDetails = await fetchLatestIssueDetails(workspaceDetails.owner, workspaceDetails.repoName, octokit);
        if (!issueDetails) {
            stream.markdown("Latest issue details not found.");
            return { metadata: { command: commands.ISSUES } };
        }
        streamIssueDetails(stream, issueDetails, issueDetails.comments);
        await streamCopilotResponse(stream, issueDetails, promptProps, token);
    } else if (userQuery.match(/issue #(\d+)/)) {
        const match = userQuery.match(/issue #(\d+)/);
        const issueNumber = match ? parseInt(match[1]) : null;
        if (!issueNumber) {
            stream.markdown("Issue number not found.");
            return { metadata: { command: commands.ISSUES } };
        }
        const issueDetails = await fetchIssueDetailsByNumber(workspaceDetails.owner, workspaceDetails.repoName, issueNumber, octokit);
        if (!issueDetails) {
            stream.markdown(`Details for issue #${issueNumber} not found.`);
            return { metadata: { command: commands.ISSUES } };
        }
        streamIssueDetails(stream, issueDetails, issueDetails.comments);
        await streamCopilotResponse(stream, issueDetails, promptProps, token);
    } else if (userQuery.includes("list")) {
        const issuesList = await fetchAllIssues(workspaceDetails.owner, workspaceDetails.repoName, octokit, 5);
        if (!issuesList || issuesList.length === 0) {
            stream.markdown("No issues found.");
            return { metadata: { command: commands.ISSUES } };
        }
        stream.markdown("Here are the latest issues:\n");
        issuesList.forEach((issue: any) => {
            stream.button({
                command: FETCH_ISSUE_DETAIL_CMD,
                title: `${issue.number}:    ${issue.title}`,
                tooltip: localize(`Fetch details for Issue #${issue.number}`),
                arguments: [issue],

            });
        });
    } else {
        stream.markdown("I'm not sure how to help with that. You can ask for the 'latest issue', 'list all issues', or about a specific 'issue #number'.");
        return { metadata: { command: commands.ISSUES } };
    }

    return { metadata: { command: commands.ISSUES } };
}

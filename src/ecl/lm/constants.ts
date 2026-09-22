import * as vscode from "vscode";

export const ECL_COMMAND_ID = "ecl";
export const PROCESS_COPILOT_CREATE_CMD = "ecl.createFiles";
export const PROCESS_COPILOT_CREATE_CMD_TITLE = "Create ECL file";
export const COPILOT_CREATE_CMD = "ECL file";

export const OWNER = "hpcc-systems";
export const REPO = "HPCC-Platform";
export const BRANCH = "master";
export const SAMPLE_COLLECTION_URL = `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}/`;

export const MODEL_VENDOR: string = "copilot";

// Only constrain the vendor so VS Code can honor the user's currently selected reasoning model.
export const MODEL_SELECTOR: vscode.LanguageModelChatSelector = { vendor: MODEL_VENDOR };

export const FETCH_ISSUE_DETAIL_CMD = "Fetch Issue Details Command";

export enum commands {
    DOCS = "docs",
    ISSUES = "issues",
}

const GREETINGS = [
    "Analyzing the ECL request...",
    "Checking ECL context and documentation...",
    "Preparing an ECL-specific response..."
];

export const getRandomGreeting = () => {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
};

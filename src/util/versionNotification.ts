import * as vscode from "vscode";
import localize from "./localize";
import { logEvent } from "../telemetry";

const LAST_VERSION_KEY = "ecl.lastVersion";

interface ReleaseNote {
    previousVersion: string;
    message: string;
    learnMoreUrl?: string;
}

export async function checkForUpgrade(context: vscode.ExtensionContext): Promise<void> {
    const currentVersion = context.extension.packageJSON.version as string;
    const lastVersion = context.globalState.get<string>(LAST_VERSION_KEY);

    if (lastVersion !== currentVersion) {
        logEvent("versionNotification.upgradeDetected", {
            currentVersion,
            previousVersion: lastVersion ?? "none"
        });
        await showWhatsNewNotification(context, currentVersion, lastVersion);
    }

    await context.globalState.update(LAST_VERSION_KEY, currentVersion);
}

async function showWhatsNewNotification(
    context: vscode.ExtensionContext,
    currentVersion: string,
    lastVersion: string
): Promise<void> {
    const releaseNotes = context.extension.packageJSON.releaseNotes as ReleaseNote[] | undefined;
    if (!releaseNotes || releaseNotes.length === 0) {
        return;
    }

    const relevantNotes = releaseNotes.filter(note => {
        return shouldShowReleaseNote(note.previousVersion, lastVersion);
    });

    if (relevantNotes.length === 0) {
        return;
    }

    const note = relevantNotes[0];
    const learnMore = localize("Learn More");
    const dismiss = localize("Dismiss");

    const buttons = note.learnMoreUrl ? [learnMore, dismiss] : [dismiss];
    const action = await vscode.window.showInformationMessage(
        `${localize("ECL Extension Updated")} (v${currentVersion}): ${localize(note.message)}`,
        ...buttons
    );

    logEvent("versionNotification.shown", { currentVersion });

    if (action === learnMore && note.learnMoreUrl) {
        logEvent("versionNotification.learnMore", { currentVersion });
        await openLearnMoreUrl(context, note.learnMoreUrl);
    } else if (action === dismiss) {
        logEvent("versionNotification.dismissed", { currentVersion });
    }
}

function shouldShowReleaseNote(notePreviousVersion: string, lastVersion: string): boolean {
    try {
        const prevVer = parseVersion(notePreviousVersion);
        const last = parseVersion(lastVersion);

        return compareVersions(last, prevVer) <= 0;
    } catch {
        return true;
    }
}

async function openLearnMoreUrl(context: vscode.ExtensionContext, url: string): Promise<void> {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        await vscode.env.openExternal(vscode.Uri.parse(url));
    } else {
        const [filePath, fragment] = url.split("#");
        const docUri = vscode.Uri.joinPath(context.extensionUri, filePath);
        const uriWithFragment = fragment ? docUri.with({ fragment }) : docUri;
        await vscode.commands.executeCommand("markdown.showPreview", uriWithFragment);
    }
}

function compareVersions(
    a: { major: number; minor: number; patch: number },
    b: { major: number; minor: number; patch: number }
): number {
    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;
    return a.patch - b.patch;
}

function parseVersion(versionStr: string): { major: number; minor: number; patch: number } {
    const parts = versionStr.split(".").map(p => parseInt(p, 10));
    return {
        major: parts[0] || 0,
        minor: parts[1] || 0,
        patch: parts[2] || 0
    };
}

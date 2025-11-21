import * as vscode from "vscode";
import { isPlatformConnected, sessionManager } from "../../../hpccplatform/session";
import localize from "../../../util/localize";

export function requireConnectedSession(): NonNullable<typeof sessionManager.session> {
    if (!isPlatformConnected()) {
        throw new vscode.LanguageModelError(localize("HPCC Platform not connected"), { cause: "not_connected" });
    }

    const session = sessionManager.session;
    if (!session) {
        throw new vscode.LanguageModelError(localize("No active session configuration"), { cause: "not_connected" });
    }

    return session;
}

export async function createServiceOptions(session?: NonNullable<typeof sessionManager.session>) {
    const activeSession = session ?? requireConnectedSession();
    return activeSession.options();
}

export function throwIfCancellationRequested(token: vscode.CancellationToken): void {
    if (token.isCancellationRequested) {
        throw new vscode.LanguageModelError(localize("Operation cancelled"), { cause: "cancelled" });
    }
}

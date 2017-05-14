import * as vscode from "vscode";
import { IECLError, locateClientTools } from "../hpcc-js-comms/src/index-node"; //  npm link ../jpcc-js/hpcc-js-comms
import { outputChannel } from "./eclStatus";

export function check(filename: string, eclConfig: vscode.WorkspaceConfiguration): Promise<IECLError[]> {
    outputChannel.clear();
    return locateClientTools(eclConfig["eclccPath"], vscode.workspace.rootPath, eclConfig["includeFolders"], eclConfig["legacyMode"]).then((clientTools) => {
        if (!clientTools) {
            vscode.window.showInformationMessage('Cannot find "ecl" binary. Update PATH or ECLROOT appropriately');
        } else if (!!eclConfig["syntaxCheckOnSave"]) {
            return clientTools.syntaxCheck(filename);
        }
        return Promise.resolve([]);
    });
}

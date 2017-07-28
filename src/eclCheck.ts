import { IECLError, locateClientTools } from "@hpcc-js/comms"; //  npm link ../jpcc-js/hpcc-js-comms
import * as vscode from "vscode";

export function check(filename: string, eclConfig: vscode.WorkspaceConfiguration): Promise<IECLError[]> {
    return locateClientTools(eclConfig["eclccPath"], vscode.workspace.rootPath, eclConfig["includeFolders"], eclConfig["legacyMode"]).then((clientTools) => {
        if (!clientTools) {
            throw new Error();
        } else if (!!eclConfig["syntaxCheckOnSave"]) {
            return clientTools.syntaxCheck(filename);
        }
        return Promise.resolve([]);
    }).catch(e => {
        vscode.window.showInformationMessage('Unable to locate "eclcc" binary.  Ensure ECL ClientTools is installed.');
        return Promise.resolve([]);
    });
}

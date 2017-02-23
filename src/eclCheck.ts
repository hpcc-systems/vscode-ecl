import vscode = require("vscode");
import { outputChannel } from "./eclStatus";
import { IECLError, locateClientTools } from "./files/clientTools";

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

import { attachWorkspace, IECLError, locateClientTools } from "@hpcc-js/comms"; //  npm link ../jpcc-js/hpcc-js-comms
import fs = require("fs");
import os = require("os");
import path = require("path");
import * as vscode from "vscode";
import { logger } from "./util";

function calcIncludeFolders(wsPath: string): string[] {
    const dedup: { [key: string]: boolean } = {};
    const retVal = [];
    function safeAppend(fsPath: string) {
        attachWorkspace(fsPath);    //  Just to prime autocompletion  ---
        if (wsPath !== fsPath && !dedup[fsPath]) {
            dedup[fsPath] = true;
            retVal.push(fsPath);
        }
    }
    for (const wuf of vscode.workspace.workspaceFolders) {
        safeAppend(wuf.uri.fsPath);
        const eclConfig = vscode.workspace.getConfiguration("ecl", wuf.uri);
        for (const fsPath of eclConfig["includeFolders"]) {
            safeAppend(fsPath);
        }
    }
    return retVal;
}

export function check(fileUri: vscode.Uri, eclConfig: vscode.WorkspaceConfiguration): Promise<IECLError[]> {
    const currentWorkspace = vscode.workspace.getWorkspaceFolder(fileUri) ? vscode.workspace.getWorkspaceFolder(fileUri).uri.fsPath : "";
    const includeFolders = calcIncludeFolders(currentWorkspace);
    return locateClientTools(eclConfig["eclccPath"], currentWorkspace, includeFolders, eclConfig["legacyMode"]).then((clientTools): Promise<IECLError[]> => {
        if (!clientTools) {
            throw new Error();
        } else if (!!eclConfig["syntaxCheckOnSave"]) {
            logger.warning("syntaxCheck", fileUri.fsPath.toString());
            return clientTools.syntaxCheck(fileUri.fsPath).then(errors => {
                if (errors[1].length) {
                    logger.warning("clientTools.syntaxCheck", errors[1].toString());
                }
                return errors[0];
            });
        }
        return Promise.resolve([]);
    }).catch(e => {
        vscode.window.showInformationMessage('Unable to locate "eclcc" binary.  Ensure ECL ClientTools is installed.');
        return Promise.resolve([]);
    });
}

import { attachWorkspace, IECLError, locateClientTools } from "@hpcc-js/comms"; //  npm link ../jpcc-js/hpcc-js-comms
import * as path from "path";
import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";

const logger = scopedLogger("debugger/ECLDEbugSession.ts");

let _diagnosticCollection: vscode.DiagnosticCollection;
export function diagnosticCollection(_?: vscode.DiagnosticCollection): vscode.DiagnosticCollection {
    if (!_) return _diagnosticCollection;
    const retVal = _diagnosticCollection;
    _diagnosticCollection = _;
    return retVal;
}

function calcIncludeFolders(wsPath: string): string[] {
    const dedup: { [key: string]: boolean } = {};
    const retVal: string[] = [];
    function safeAppend(fsPath: string) {
        attachWorkspace(fsPath);    //  Just to prime autocompletion  ---
        if (wsPath !== fsPath && !dedup[fsPath]) {
            dedup[fsPath] = true;
            retVal.push(fsPath);
        }
    }
    if (vscode.workspace.workspaceFolders) {
        for (const wuf of vscode.workspace.workspaceFolders) {
            safeAppend(wuf.uri.fsPath);
            const eclConfig = vscode.workspace.getConfiguration("ecl", wuf.uri);
            for (const fsPath of eclConfig["includeFolders"]) {
                safeAppend(path.isAbsolute(fsPath) ? fsPath : path.resolve(wsPath, fsPath));
            }
        }
    }
    return retVal;
}

export function check(fileUri: vscode.Uri, eclConfig: vscode.WorkspaceConfiguration): Promise<IECLError[]> {
    const currentWorkspace = vscode.workspace.getWorkspaceFolder(fileUri);
    const currentWorkspacePath = currentWorkspace ? currentWorkspace.uri.fsPath : "";
    const includeFolders = calcIncludeFolders(currentWorkspacePath);
    return locateClientTools(eclConfig["eclccPath"], currentWorkspacePath, includeFolders, eclConfig["legacyMode"]).then((clientTools): Promise<IECLError[]> => {
        if (!clientTools) {
            throw new Error();
        } else if (!!eclConfig["syntaxCheckOnSave"]) {
            logger.debug(`syntaxCheck:  ${fileUri.fsPath.toString()}`);
            return clientTools.syntaxCheck(fileUri.fsPath).then(errors => {
                if (errors[1].length) {
                    logger.warning(`syntaxCheck:  ${errors[1].toString()}`);
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

function mapSeverityToVSCodeSeverity(sev: string) {
    switch (sev) {
        case "error": return vscode.DiagnosticSeverity.Error;
        case "warning": return vscode.DiagnosticSeverity.Warning;
        default: return vscode.DiagnosticSeverity.Error;
    }
}

export function checkTextDocument(document: vscode.TextDocument, eclConfig: vscode.WorkspaceConfiguration) {
    if (document.languageId !== "ecl") return;

    const uri = document.uri;
    check(uri, eclConfig).then((errors) => {
        _diagnosticCollection.delete(uri);

        const diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();

        errors.forEach(error => {
            const canonicalFile = vscode.Uri.file(error.filePath).toString();
            const range = new vscode.Range(error.line - 1, error.col, error.line - 1, error.col);
            const diagnostic = new vscode.Diagnostic(range, error.msg, mapSeverityToVSCodeSeverity(error.severity));
            let diagnostics = diagnosticMap.get(canonicalFile);
            if (!diagnostics) {
                diagnostics = [];
            }
            diagnostics.push(diagnostic);
            diagnosticMap.set(canonicalFile, diagnostics);
        });
        diagnosticMap.forEach((diags, file) => {
            _diagnosticCollection.set(vscode.Uri.parse(file), diags);
        });
    }).catch((err) => {
        vscode.window.showInformationMessage("Error: " + err);
    });
}

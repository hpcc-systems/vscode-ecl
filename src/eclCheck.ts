import { attachWorkspace, IECLError, locateClientTools } from "@hpcc-js/comms"; //  npm link ../jpcc-js/hpcc-js-comms
import { scopedLogger } from "@hpcc-js/util";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { eclDiagnostic } from "./eclDiagnostic";

const logger = scopedLogger("debugger/ECLDEbugSession.ts");

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

function check(fileUri: vscode.Uri, eclConfig: vscode.WorkspaceConfiguration): Promise<IECLError[]> {
    const currentWorkspace = vscode.workspace.getWorkspaceFolder(fileUri);
    const currentWorkspacePath = currentWorkspace ? currentWorkspace.uri.fsPath : "";
    const includeFolders = calcIncludeFolders(currentWorkspacePath);
    return locateClientTools(eclConfig["eclccPath"], currentWorkspacePath, includeFolders, eclConfig["legacyMode"]).then((clientTools): Promise<IECLError[]> => {
        if (!clientTools) {
            throw new Error();
        } else {
            logger.debug(`syntaxCheck-promise:  ${fileUri.fsPath}`);
            return clientTools.syntaxCheck(fileUri.fsPath, eclConfig.get<string[]>("syntaxArgs")).then(errors => {
                if (errors[1].length) {
                    logger.warning(`syntaxCheck-warning:  ${fileUri.fsPath} ${errors[1].toString()}`);
                }
                logger.debug(`syntaxCheck-resolve:  ${fileUri.fsPath} ${errors[0].length} total.`);
                return errors[0];
            }).catch(e => {
                logger.debug(`syntaxCheck-reject:  ${fileUri.fsPath} ${e.msg}`);
                vscode.window.showInformationMessage(`Syntax check exception:  ${fileUri.fsPath} ${e.msg}`);
                return Promise.resolve([]);
            });
        }
        logger.debug(`syntaxCheck-skipped:  ${fileUri.fsPath}`);
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

const checking = [new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), "...checking...")];
function checkUri(uri: vscode.Uri, eclConfig: vscode.WorkspaceConfiguration): Promise<void> {
    if (uri) {
        const wsf = vscode.workspace.getWorkspaceFolder(uri);
        if (wsf) {
            vscode.window.setStatusBarMessage(`Syntax Check:  ${path.relative(wsf.uri.fsPath, uri.fsPath)}`);
        }
    }
    eclDiagnostic.set(uri, checking);
    return check(uri, eclConfig).then((errors) => {
        eclDiagnostic.set(uri, []);

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
            eclDiagnostic.set(vscode.Uri.parse(file), diags);
        });
        vscode.window.setStatusBarMessage("");
    }).catch((err) => {
        eclDiagnostic.set(uri, []);
        vscode.window.showInformationMessage("Error: " + err);
        vscode.window.setStatusBarMessage("");
    });
}

export function checkTextDocument(document: vscode.TextDocument, eclConfig: vscode.WorkspaceConfiguration): Promise<void> {
    if (document.languageId !== "ecl") return Promise.resolve();
    return checkUri(document.uri, eclConfig);
}

const isDirectory = source => source.indexOf(".") !== 0 && fs.lstatSync(source).isDirectory();
const isEcl = source => path.extname(source).toLowerCase() === ".ecl";
const modAttrs = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(fsPath => isDirectory(fsPath) || isEcl(fsPath));

function walkFolders(folderPath: string, cb: (fsPath: string) => void) {
    for (const child of modAttrs(folderPath)) {
        if (isDirectory(child)) {
            walkFolders(child, cb);
        } else {
            cb(child);
        }
    }
}

export async function checkWorkspace(wsf: vscode.WorkspaceFolder): Promise<void> {
    const files: string[] = [];
    walkFolders(wsf.uri.fsPath, filePath => {
        files.push(filePath);
    });
    for (const file of files) {
        await checkUri(vscode.Uri.file(file), vscode.workspace.getConfiguration("ecl", wsf.uri));
    }
}

import { IECLErrorWarning } from "@hpcc-js/comms";
import { scopedLogger } from "@hpcc-js/util";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { eclDiagnostic } from "../diagnostic";
import { locateClientTools } from "../ecl/clientTools";

const logger = scopedLogger("debugger/ECLDEbugSession.ts");

interface CheckResponse {
    errors: IECLErrorWarning[];
    checked: string[];
}

function check(fileUri: vscode.Uri, eclConfig: vscode.WorkspaceConfiguration): Promise<CheckResponse> {
    return locateClientTools().then((clientTools): Promise<CheckResponse> => {
        if (!clientTools) {
            throw new Error();
        } else {
            logger.debug(`envCheck-promise:  ${fileUri.fsPath}`);
            return clientTools.envCheck(fileUri.fsPath, eclConfig.get<string[]>("envchkArgs")).then((errors) => {
                if (errors.hasUnknown()) {
                    logger.warning(`envCheck-warning:  ${fileUri.fsPath} ${errors.unknown().toString()}`);
                }
                logger.debug(`envCheck-resolve:  ${fileUri.fsPath} ${errors.errors().length} total.`);
                return { errors: errors.all(), checked: errors.checked() };
            }).catch(e => {
                logger.debug(`envCheck-reject:  ${fileUri.fsPath} ${e.message}`);
                vscode.window.showInformationMessage(`Syntax check exception:  ${fileUri.fsPath} ${e.message}`);
                return Promise.resolve({ errors: [], checked: [] });
            });
        }
    }).catch(e => {
        vscode.window.showInformationMessage('Unable to locate "envchk" binary.  Ensure ECL ClientTools is installed.');
        return Promise.resolve({ errors: [], checked: [] });
    });
}

function mapSeverityToVSCodeSeverity(sev: string) {
    switch (sev) {
        case "Error": return vscode.DiagnosticSeverity.Error;
        case "Warning": return vscode.DiagnosticSeverity.Warning;
        default: return vscode.DiagnosticSeverity.Information;
    }
}

const checking = [new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), "...checking...", vscode.DiagnosticSeverity.Information)];
function checkUri(uri: vscode.Uri, eclConfig: vscode.WorkspaceConfiguration): Promise<void> {
    if (uri) {
        const wsf = vscode.workspace.getWorkspaceFolder(uri);
        if (wsf) {
            vscode.window.setStatusBarMessage(`Syntax Check:  ${path.relative(wsf.uri.fsPath, uri.fsPath)}`);
        }
    }
    eclDiagnostic.set(uri, checking);
    return check(uri, eclConfig).then(({ errors, checked }) => {
        const diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();

        for (const checkedPath of checked) {
            eclDiagnostic.set(vscode.Uri.file(checkedPath), []);
        }
        errors.forEach(error => {
            const errorFilePath = path.normalize(error.filePath).toString();
            const canonicalFile = vscode.Uri.file(errorFilePath).toString();
            const line = +error.line > 0 ? +error.line - 1 : 0;
            const col = +error.col >= 0 ? +error.col : 0;
            const range = new vscode.Range(line, col, line, col);
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
    if (document.languageId !== "xml") return Promise.resolve();
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

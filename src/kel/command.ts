import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
import localize from "../util/localize";
import { KELClientTools, KelProcessOutputHandler, locateClientTools, selectCTVersion } from "./clientTools";
import { Diagnostic } from "./diagnostic";

const logger = scopedLogger("kel/command.ts");

function mapSeverityToVSCodeSeverity(sev: string) {
    switch (sev) {
        case "error": return vscode.DiagnosticSeverity.Error;
        case "warning": return vscode.DiagnosticSeverity.Warning;
        default: return vscode.DiagnosticSeverity.Information;
    }
}

const checking = new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), `...${localize("checking")}...`, vscode.DiagnosticSeverity.Information);
const generating = new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), `...${localize("generating")}...`, vscode.DiagnosticSeverity.Information);
const noClientTools = new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), `...${localize("unable to locate KEL client tools")}...`, vscode.DiagnosticSeverity.Information);

function setReportedDiagnostics(diagnostic: Diagnostic, documentUri: vscode.Uri, errors: Awaited<ReturnType<KELClientTools["generate"]>>["errors"]) {
    const mappedErrors: { [filePath: string]: vscode.Diagnostic[] } = {
        [documentUri.fsPath]: []
    };
    errors.all().forEach(error => {
        const errorFilePath = error.filePath || documentUri.fsPath;
        const line = +error.line > 0 ? +error.line - 1 : 0;
        const col = +error.col >= 0 ? +error.col : 0;
        const range = new vscode.Range(line, col, line, col);
        if (!mappedErrors[errorFilePath]) {
            mappedErrors[errorFilePath] = [];
        }
        mappedErrors[errorFilePath].push(new vscode.Diagnostic(range, error.msg, mapSeverityToVSCodeSeverity(error.severity)));
    });
    for (const filePath in mappedErrors) {
        diagnostic.set(vscode.Uri.file(filePath), mappedErrors[filePath]);
    }
}

function createProcessStatusHandler(): { onOutput: KelProcessOutputHandler; dispose: () => void } {
    let processStatus: vscode.Disposable | undefined;
    return {
        onOutput: (_stream, text) => {
            const singleLineText = text.replace(/\s+/g, " ").trim();
            processStatus?.dispose();
            processStatus = vscode.window.setStatusBarMessage(`$(sync~spin) ${localize("KEL")}: ${singleLineText}`);
        },
        dispose: () => processStatus?.dispose()
    };
}

export let commands: Commands;
export class Commands {
    _ctx: vscode.ExtensionContext;
    _diagnostic: Diagnostic;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._diagnostic = Diagnostic.attach(ctx);

        ctx.subscriptions.push(vscode.commands.registerCommand("kel.checkSyntax", this.activeCheckSyntax, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("kel.generate", this.activeGenerate, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("kel.reveal", this.activeReveal, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("kel.selectCTVersion", selectCTVersion));
    }

    static attach(ctx: vscode.ExtensionContext): Commands {
        if (!commands) {
            commands = new Commands(ctx);
        }
        return commands;
    }

    activeCheckSyntax() {
        return this.checkSyntax(vscode.window.activeTextEditor?.document);
    }

    async checkSyntax(doc?: vscode.TextDocument): Promise<void> {
        if (doc) {
            logger.debug(`checkSyntax-request: ${doc.uri.fsPath}`);
            logger.debug("checkSyntax-start");
            this._diagnostic.set(doc.uri, [checking]);
            const checkingStatus = vscode.window.setStatusBarMessage(`$(sync~spin) ${localize("KEL")}: ${localize("Syntax Check")}...`);
            const processStatus = createProcessStatusHandler();
            let stage = "save";
            let toolPath = "unknown";
            try {
                await doc.save();
                stage = "tool-lookup";
                const clientTools = await locateClientTools();
                if (!clientTools) {
                    logger.debug("checkSyntax-noClientTools");
                    this._diagnostic.set(doc.uri, [noClientTools]);
                    vscode.window.setStatusBarMessage(`$(error) ${localize("KEL")}: ${localize("Failed")}`, 5000);
                } else {
                    stage = "checkSyntax";
                    toolPath = clientTools.kelPath;
                    logger.debug("checkSyntax-check-start");
                    const response = await clientTools.checkSyntax(doc.uri.fsPath, undefined, processStatus.onOutput);
                    logger.debug(`checkSyntax-check-response: stdout=${response.stdout.length} chars, errors=${response.errors.all().length}`);
                    setReportedDiagnostics(this._diagnostic, doc.uri, response.errors);
                    const hasErrors = response.errors.all().some(error => error.severity.toLowerCase() === "error");
                    vscode.window.setStatusBarMessage(`$(${hasErrors ? "error" : "check"}) ${localize("KEL")}: ${localize(hasErrors ? "Failed" : "Completed")}`, 5000);
                    logger.debug("checkSyntax-check-response-end");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.stack || error.message : String(error);
                logger.error(`checkSyntax-failed: stage=${stage}, file=${doc.uri.fsPath}, tool=${toolPath}, error=${errorMessage}`);
                this._diagnostic.set(doc.uri, []);
                vscode.window.setStatusBarMessage(`$(error) ${localize("KEL")}: ${localize("Failed")}`, 5000);
            } finally {
                checkingStatus.dispose();
                processStatus.dispose();
            }
        }
    }

    activeGenerate() {
        return this.generate(vscode.window.activeTextEditor?.document);
    }

    async generate(doc?: vscode.TextDocument): Promise<void> {
        if (doc) {
            logger.debug(`generate-request: ${doc.uri.fsPath}`);
            this._diagnostic.set(doc.uri, [generating]);
            const generatingStatus = vscode.window.setStatusBarMessage(`$(sync~spin) ${localize("KEL")}: ${localize("Generate")}...`);
            const processStatus = createProcessStatusHandler();
            let stage = "save";
            let toolPath = "unknown";
            try {
                await doc.save();
                stage = "tool-lookup";
                const clientTools = await locateClientTools();
                if (clientTools) {
                    stage = "generate";
                    toolPath = clientTools.kelPath;
                    logger.debug(`generate-tool: ${clientTools.kelPath}`);
                    const response = await clientTools.generate(doc.uri, processStatus.onOutput);
                    logger.debug(`generate-complete: stdout=${response.stdout.length} chars, errors=${response.errors.all().length}`);
                    setReportedDiagnostics(this._diagnostic, doc.uri, response.errors);
                    const hasErrors = response.errors.all().some(error => error.severity.toLowerCase() === "error");
                    vscode.window.setStatusBarMessage(`$(${hasErrors ? "error" : "check"}) ${localize("KEL")}: ${localize(hasErrors ? "Failed" : "Completed")}`, 5000);
                } else {
                    logger.debug("generate-noClientTools");
                    this._diagnostic.set(doc.uri, [noClientTools]);
                    vscode.window.setStatusBarMessage(`$(error) ${localize("KEL")}: ${localize("Failed")}`, 5000);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.stack || error.message : String(error);
                logger.error(`generate-failed: stage=${stage}, file=${doc.uri.fsPath}, tool=${toolPath}, error=${errorMessage}`);
                this._diagnostic.set(doc.uri, []);
                vscode.window.setStatusBarMessage(`$(error) ${localize("KEL")}: ${localize("Failed")}`, 5000);
            } finally {
                generatingStatus.dispose();
                processStatus.dispose();
            }
        }
    }

    activeReveal() {
        return this.reveal(vscode.window.activeTextEditor?.document);
    }

    reveal(doc?: vscode.TextDocument) {
        if (doc) {
            locateClientTools().then(clientTools => {
                if (clientTools) {
                    const location = clientTools.genFolder(doc.uri);
                    vscode.env.openExternal(vscode.Uri.file(location));
                }
            });
        }
    }
}

import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
import localize from "../util/localize";
import { locateClientTools, selectCTVersion } from "./clientTools";
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

    checkSyntax(doc?: vscode.TextDocument) {
        if (doc) {
            logger.debug(`checkSyntax-request: ${doc.uri.fsPath}`);
            doc.save();
            logger.debug("checkSyntax-start");
            this._diagnostic.set(doc.uri, [checking]);
            locateClientTools().then(clientTools => {
                if (!clientTools) {
                    logger.debug("checkSyntax-noClientTools");
                    this._diagnostic.set(doc.uri, [noClientTools]);
                } else {
                    logger.debug("checkSyntax-check-start");
                    clientTools.checkSyntax(doc.uri.fsPath).then(response => {
                        logger.debug(`checkSyntax-check-response: stdout=${response.stdout.length} chars, errors=${response.errors.all().length}`);
                        const mappedErrors: { [fp: string]: vscode.Diagnostic[] } = {};
                        mappedErrors[doc.uri.fsPath] = [];
                        response.errors.all().forEach(error => {
                            const errorFilePath = error.filePath || doc.uri.fsPath;
                            const line = +error.line > 0 ? +error.line - 1 : 0;
                            const col = +error.col >= 0 ? +error.col : 0;
                            const range = new vscode.Range(line, col, line, col);
                            if (!mappedErrors[errorFilePath]) {
                                mappedErrors[errorFilePath] = [];
                            }
                            mappedErrors[errorFilePath].push(new vscode.Diagnostic(range, error.msg, mapSeverityToVSCodeSeverity(error.severity)));
                        });
                        for (const fp in mappedErrors) {
                            const uri = vscode.Uri.file(fp);
                            const uri2 = doc.uri;
                            // console.log(uri, uri2);
                            this._diagnostic.set(uri, mappedErrors[fp]);
                        }
                        logger.debug("checkSyntax-check-response-end");
                    }).catch(error => {
                        logger.error(`checkSyntax-failed: ${error?.message || error}`);
                    });
                }
            }).catch(error => {
                logger.error(`checkSyntax-tool-lookup-failed: ${error?.message || error}`);
            });
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
                    const response = await clientTools.generate(doc.uri);
                    logger.debug(`generate-complete: stdout=${response.stdout.length} chars, errors=${response.errors.all().length}`);
                    this._diagnostic.set(doc.uri, []);
                    vscode.window.setStatusBarMessage(`$(check) ${localize("KEL")}: ${localize("Completed")}`, 5000);
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

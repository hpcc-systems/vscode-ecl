import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
import localize from "../util/localize";
import { locateClientTools, selectCTVersion } from "./clientTools";
import { Diagnostic } from "./diagnostic";
import { registerCommand, logEvent, logError } from "../telemetry";

const logger = scopedLogger("kel/command.ts");

function mapSeverityToVSCodeSeverity(sev: string) {
    switch (sev) {
        case "error": return vscode.DiagnosticSeverity.Error;
        case "warning": return vscode.DiagnosticSeverity.Warning;
        default: return vscode.DiagnosticSeverity.Information;
    }
}

const checking = new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), `...${localize("checking")}...`, vscode.DiagnosticSeverity.Information);
const noClientTools = new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), `...${localize("unable to locate KEL client tools")}...`, vscode.DiagnosticSeverity.Information);

export let commands: Commands;
export class Commands {
    _ctx: vscode.ExtensionContext;
    _diagnostic: Diagnostic;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._diagnostic = Diagnostic.attach(ctx);

        registerCommand(ctx, "kel.checkSyntax", this.activeCheckSyntax, this);
        registerCommand(ctx, "kel.generate", this.activeGenerate, this);
        registerCommand(ctx, "kel.reveal", this.activeReveal, this);
        registerCommand(ctx, "kel.selectCTVersion", selectCTVersion);
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
            doc.save();
            logger.debug("checkSyntax-start");
            logEvent("kel.checkSyntax.start");
            this._diagnostic.set(doc.uri, [checking]);
            locateClientTools().then(clientTools => {
                if (!clientTools) {
                    logger.debug("checkSyntax-noClientTools");
                    logEvent("kel.checkSyntax.noClientTools");
                    this._diagnostic.set(doc.uri, [noClientTools]);
                } else {
                    logger.debug("checkSyntax-check-start");
                    clientTools.checkSyntax(doc.uri.fsPath).then(response => {
                        logger.debug("checkSyntax-check-response");
                        const mappedErrors: { [fp: string]: vscode.Diagnostic[] } = {};
                        mappedErrors[doc.uri.fsPath] = [];
                        response.errors.all().forEach(error => {
                            const errorFilePath = error.filePath;
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
                        logEvent("kel.checkSyntax.success", {}, { errorCount: response.errors.all().length });
                    }).catch(e => {
                        logError("kel.checkSyntax.error", e);
                    });
                }
            });
        }
    }

    activeGenerate() {
        return this.generate(vscode.window.activeTextEditor?.document);
    }

    generate(doc?: vscode.TextDocument) {
        if (doc) {
            doc.save();
            logEvent("kel.generate.start");
            locateClientTools().then(clientTools => {
                if (clientTools) {
                    return clientTools.generate(doc.uri).then(() => {
                        logEvent("kel.generate.success");
                    }, e => {
                        logError("kel.generate.error", e);
                    });
                } else {
                    logEvent("kel.generate.noClientTools");
                }
            });
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

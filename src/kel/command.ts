import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
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

const checking = new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), "...checking...", vscode.DiagnosticSeverity.Information);
const noClientTools = new vscode.Diagnostic(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)), "...unable to locate KEL client tools...", vscode.DiagnosticSeverity.Information);

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
                            console.log(uri, uri2);
                            this._diagnostic.set(uri, mappedErrors[fp]);
                        }
                        logger.debug("checkSyntax-check-response-end");
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
            locateClientTools().then(clientTools => {
                if (clientTools) {
                    clientTools.generate(doc.uri);
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

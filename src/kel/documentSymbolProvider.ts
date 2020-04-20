import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
import { parse } from "./parser";
import { Diagnostic } from "./diagnostic";

const logger = scopedLogger("documentSymbolProvider.ts");

export let documentSymbolProvider: DocumentSymbolProvider;
export class DocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    protected _ctx: vscode.ExtensionContext;

    protected _Diagnostic: Diagnostic;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider("kel", this));
        this._Diagnostic = Diagnostic.attach(ctx);
    }

    static attach(ctx: vscode.ExtensionContext): DocumentSymbolProvider {
        if (!documentSymbolProvider) {
            documentSymbolProvider = new DocumentSymbolProvider(ctx);
        }
        return documentSymbolProvider;
    }

    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const retVal: vscode.DocumentSymbol[] = [];
        function addSymbol(name: string | undefined, detail: string, kind: vscode.SymbolKind, range: vscode.Range, selectionRange: vscode.Range | undefined) {
            if (name) {
                retVal.push(new vscode.DocumentSymbol(name, detail, kind, range, selectionRange ?? range));
            }
        }

        const parsed = parse(document);
        if (parsed) {
            const parserErrors = parsed.errors.map(e => {
                return new vscode.Diagnostic(e.range, e.error.message, vscode.DiagnosticSeverity.Warning);
            });
            this._Diagnostic.setQuick(document.uri, parserErrors);
        }

        return retVal;
    }
}

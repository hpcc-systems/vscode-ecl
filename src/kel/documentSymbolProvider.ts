import * as vscode from "vscode";
import { KEL_MODE } from "../mode";
import { Diagnostic } from "./diagnostic";
import { Parsed, parse } from "./parser";
import { KELImport, KELSymbol, KELSymbolKind } from "./visitor";

const KEL_KEYWORDS = [
    "ASSOCIATION", "ENTITY", "ERA", "FROM", "FUNCTION", "IMPORT", "PACKAGE", "QUERY", "SHELL", "USE"
];

export interface IdentifierAtOffset {
    text: string;
    start: number;
    stop: number;
}

export interface KELDefinitionTarget {
    source?: string;
    symbol?: string;
    local?: KELSymbol;
}

export function identifierAtOffset(text: string, offset: number): IdentifierAtOffset | undefined {
    const isIdentifierChar = (char: string) => /[A-Za-z0-9_.]/.test(char);
    let start = offset;
    let stop = offset;
    while (start > 0 && isIdentifierChar(text[start - 1])) {
        --start;
    }
    while (stop < text.length && isIdentifierChar(text[stop])) {
        ++stop;
    }
    const identifier = text.slice(start, stop).replace(/^\.+|\.+$/g, "");
    if (!identifier || !/^[A-Za-z_][A-Za-z0-9_.]*$/.test(identifier)) {
        return undefined;
    }
    const leadingDots = text.slice(start, stop).length - text.slice(start, stop).replace(/^\.+/, "").length;
    return { text: identifier, start: start + leadingDots, stop: start + leadingDots + identifier.length };
}

function importBinding(item: KELImport): string {
    return item.alias ?? item.source.split(".").at(-1) ?? item.source;
}

export function definitionTarget(parsed: Parsed, identifier: string): KELDefinitionTarget | undefined {
    const parts = identifier.split(".");
    const localName = parts.at(-1) ?? identifier;
    const local = parsed.symbols.find(symbol => symbol.name.toLowerCase() === localName.toLowerCase());
    if (local && parts.length === 1) {
        return { local };
    }

    if (parts.length > 1) {
        const imported = parsed.imports.find(item => importBinding(item).toLowerCase() === parts[0].toLowerCase());
        if (imported) {
            return { source: imported.source, symbol: localName };
        }
    }

    const packageImport = parsed.imports.find(item => item.names.some(name => name.toLowerCase() === identifier.toLowerCase()));
    if (packageImport) {
        return { source: packageImport.source, symbol: identifier };
    }

    const moduleImport = parsed.imports.find(item => importBinding(item).toLowerCase() === identifier.toLowerCase());
    if (moduleImport) {
        return { source: moduleImport.source };
    }
    return local ? { local } : undefined;
}

function symbolKind(kind: KELSymbolKind): vscode.SymbolKind {
    switch (kind) {
        case "package": return vscode.SymbolKind.Package;
        case "entity": return vscode.SymbolKind.Class;
        case "association": return vscode.SymbolKind.Interface;
        case "function": return vscode.SymbolKind.Function;
        case "query": return vscode.SymbolKind.Method;
        case "shell": return vscode.SymbolKind.Method;
        case "era": return vscode.SymbolKind.Enum;
    }
}

function completionKind(kind: KELSymbolKind): vscode.CompletionItemKind {
    switch (kind) {
        case "package": return vscode.CompletionItemKind.Module;
        case "entity": return vscode.CompletionItemKind.Class;
        case "association": return vscode.CompletionItemKind.Interface;
        case "function": return vscode.CompletionItemKind.Function;
        case "query": return vscode.CompletionItemKind.Method;
        case "shell": return vscode.CompletionItemKind.Method;
        case "era": return vscode.CompletionItemKind.Enum;
    }
}

export let documentSymbolProvider: DocumentSymbolProvider;
export class DocumentSymbolProvider implements vscode.DocumentSymbolProvider, vscode.HoverProvider, vscode.CompletionItemProvider, vscode.DefinitionProvider {
    protected _ctx: vscode.ExtensionContext;
    protected _Diagnostic: Diagnostic;
    private _models = new WeakMap<vscode.TextDocument, { version: number; parsed: Parsed }>();

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider(KEL_MODE, this),
            vscode.languages.registerHoverProvider(KEL_MODE, this),
            vscode.languages.registerCompletionItemProvider(KEL_MODE, this, "."),
            vscode.languages.registerDefinitionProvider(KEL_MODE, this)
        );
        this._Diagnostic = Diagnostic.attach(ctx);
    }

    static attach(ctx: vscode.ExtensionContext): DocumentSymbolProvider {
        if (!documentSymbolProvider) {
            documentSymbolProvider = new DocumentSymbolProvider(ctx);
        }
        return documentSymbolProvider;
    }

    private model(document: vscode.TextDocument): Parsed {
        const cached = this._models.get(document);
        if (cached?.version === document.version) {
            return cached.parsed;
        }
        const parsed = parse(document);
        this._models.set(document, { version: document.version, parsed });
        return parsed;
    }

    private range(document: vscode.TextDocument, start: number, stop: number): vscode.Range {
        return new vscode.Range(document.positionAt(start), document.positionAt(stop + 1));
    }

    private symbolDocumentation(document: vscode.TextDocument, symbol: KELSymbol): vscode.MarkdownString {
        const markdown = new vscode.MarkdownString();
        markdown.appendCodeblock(`${symbol.detail} ${symbol.name}`.trim(), "kel");
        const prefix = document.getText().slice(0, symbol.start);
        const docComment = prefix.match(/\/\*\*((?:(?!\/\*\*)[\s\S])*?)\*\/\s*$/)?.[1]
            ?.replace(/^\s*\* ?/gm, "")
            .trim();
        if (docComment) {
            markdown.appendMarkdown(`\n${docComment}`);
        }
        return markdown;
    }

    private completionForSymbol(document: vscode.TextDocument, symbol: KELSymbol): vscode.CompletionItem {
        const item = new vscode.CompletionItem(symbol.name, completionKind(symbol.kind));
        item.detail = symbol.detail;
        item.documentation = this.symbolDocumentation(document, symbol);
        return item;
    }

    private async importedDocument(source: string, document: vscode.TextDocument): Promise<vscode.TextDocument | undefined> {
        const relativePath = `${source.replace(/\./g, "/")}.kel`;
        const fileName = `${source.split(".").at(-1)}.kel`;
        const exclude = "**/{node_modules,.git,dist}/**";
        let matches = await vscode.workspace.findFiles(`**/${relativePath}`, exclude, 20);
        if (!matches.length && fileName !== relativePath) {
            matches = await vscode.workspace.findFiles(`**/${fileName}`, exclude, 20);
        }
        if (!matches.length) {
            return undefined;
        }
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        const preferred = workspaceFolder
            ? matches.find(uri => uri.path.toLowerCase().startsWith(workspaceFolder.uri.path.toLowerCase()))
            : undefined;
        return vscode.workspace.openTextDocument(preferred ?? matches[0]);
    }

    private async resolveTarget(document: vscode.TextDocument, target: KELDefinitionTarget): Promise<{ document: vscode.TextDocument; symbol?: KELSymbol } | undefined> {
        if (target.local) {
            return { document, symbol: target.local };
        }
        if (!target.source) {
            return undefined;
        }
        const imported = await this.importedDocument(target.source, document);
        if (!imported) {
            return undefined;
        }
        const symbol = target.symbol
            ? this.model(imported).symbols.find(item => item.name.toLowerCase() === target.symbol?.toLowerCase())
            : this.model(imported).symbols.find(item => item.kind === "package");
        if (target.symbol && !symbol) {
            return undefined;
        }
        return { document: imported, symbol };
    }

    provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
        const parsed = this.model(document);
        const parserErrors = parsed.errors.map(error => new vscode.Diagnostic(error.range, error.error.message, vscode.DiagnosticSeverity.Warning));
        this._Diagnostic.setQuick(document.uri, parserErrors);

        const symbols = new Map<KELSymbol, vscode.DocumentSymbol>();
        for (const symbol of parsed.symbols) {
            symbols.set(symbol, new vscode.DocumentSymbol(
                symbol.name,
                symbol.detail,
                symbolKind(symbol.kind),
                this.range(document, symbol.start, symbol.stop),
                this.range(document, symbol.selectionStart, symbol.selectionStop)
            ));
        }
        const result: vscode.DocumentSymbol[] = [];
        for (const [symbol, documentSymbol] of symbols) {
            const parent = symbol.container
                ? [...symbols].find(([candidate]) => candidate.kind === "package" && candidate.name === symbol.container)?.[1]
                : undefined;
            if (parent) {
                parent.children.push(documentSymbol);
            } else {
                result.push(documentSymbol);
            }
        }
        return result;
    }

    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
        const parsed = this.model(document);
        const offset = document.offsetAt(position);
        const beforeCursor = document.getText().slice(0, offset);
        const qualifier = beforeCursor.match(/([A-Za-z_][A-Za-z0-9_]*)\.[A-Za-z0-9_]*$/)?.[1];
        if (qualifier) {
            const imported = parsed.imports.find(item => importBinding(item).toLowerCase() === qualifier.toLowerCase());
            if (!imported || token.isCancellationRequested) {
                return [];
            }
            const importedDoc = await this.importedDocument(imported.source, document);
            return importedDoc && !token.isCancellationRequested
                ? this.model(importedDoc).symbols.filter(symbol => symbol.kind !== "package").map(symbol => this.completionForSymbol(importedDoc, symbol))
                : [];
        }

        const result = parsed.symbols.map(symbol => this.completionForSymbol(document, symbol));
        for (const item of parsed.imports) {
            const names = item.names.length ? item.names : [importBinding(item)];
            for (const name of names) {
                const completion = new vscode.CompletionItem(item.alias ?? name, vscode.CompletionItemKind.Module);
                completion.detail = `Imported from ${item.source}`;
                result.push(completion);
            }
        }
        for (const keyword of KEL_KEYWORDS) {
            result.push(new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword));
        }
        return result;
    }

    async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | undefined> {
        const identifier = identifierAtOffset(document.getText(), document.offsetAt(position));
        if (!identifier) {
            return undefined;
        }
        const parsed = this.model(document);
        const importedAtCursor = parsed.imports.find(item => identifier.start >= item.sourceStart && identifier.stop - 1 <= item.sourceStop);
        if (importedAtCursor) {
            return new vscode.Hover(`KEL import \`${importedAtCursor.source}\``, this.range(document, identifier.start, identifier.stop - 1));
        }
        const resolved = await this.resolveTarget(document, definitionTarget(parsed, identifier.text) ?? {});
        if (!resolved?.symbol) {
            return undefined;
        }
        return new vscode.Hover(this.symbolDocumentation(resolved.document, resolved.symbol), this.range(document, identifier.start, identifier.stop - 1));
    }

    async provideDefinition(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Location | undefined> {
        const identifier = identifierAtOffset(document.getText(), document.offsetAt(position));
        if (!identifier) {
            return undefined;
        }
        const parsed = this.model(document);
        const importedAtCursor = parsed.imports.find(item => identifier.start >= item.sourceStart && identifier.stop - 1 <= item.sourceStop);
        const target = importedAtCursor ? { source: importedAtCursor.source } : definitionTarget(parsed, identifier.text);
        if (!target) {
            return undefined;
        }
        const resolved = await this.resolveTarget(document, target);
        if (!resolved) {
            return undefined;
        }
        const range = resolved.symbol
            ? this.range(resolved.document, resolved.symbol.selectionStart, resolved.symbol.selectionStop)
            : new vscode.Range(0, 0, 0, 0);
        return new vscode.Location(resolved.document.uri, range);
    }
}

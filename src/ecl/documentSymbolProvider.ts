import { attachWorkspace, Definition, ECLScope, Import, Source, Workspace } from "@hpcc-js/comms";
import * as vscode from "vscode";

const knownTypes = {};

export let eclDocumentSymbolProvider: ECLDocumentSymbolProvider;
export class ECLDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    protected _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider("ecl", this));
    }

    static attach(ctx: vscode.ExtensionContext): ECLDocumentSymbolProvider {
        if (!eclDocumentSymbolProvider) {
            eclDocumentSymbolProvider = new ECLDocumentSymbolProvider(ctx);
        }
        return eclDocumentSymbolProvider;
    }

    typeToSymbolKind(type: string): vscode.SymbolKind {
        switch (type) {
            case "module":
                return vscode.SymbolKind.Module;
            case "attribute":
                return vscode.SymbolKind.Variable;
            case "record":
                return vscode.SymbolKind.Struct;
            case "macro":
                return vscode.SymbolKind.Function;
            case "function":
                return vscode.SymbolKind.Function;
            case "transform":
                return vscode.SymbolKind.Operator;
            default:
                if (!knownTypes[type]) {
                    knownTypes[type] = true;
                    console.log(`case "${type}":\n    break;`);
                }
        }
        return vscode.SymbolKind.Variable;
    }

    calcPos(document: vscode.TextDocument, pos: number, line: number) {
        return pos ? document.positionAt(pos) : new vscode.Position(line || 0, 0);
    }

    calcRange(document: vscode.TextDocument, scope: ECLScope): vscode.Range {
        const startPos = this.calcPos(document, scope.start, scope.line);
        const endPos = this.calcPos(document, scope.end, scope.line + 1);
        return new vscode.Range(startPos, endPos);
    }

    calcSelectionRange(document: vscode.TextDocument, scope: ECLScope): vscode.Range {
        const startPos = this.calcPos(document, scope.start, scope.line);
        const endPos = this.calcPos(document, scope["body"] || scope.end, scope.line + 1);
        return new vscode.Range(startPos, endPos);
    }

    parseImports(document: vscode.TextDocument, imports: Import[]): vscode.DocumentSymbol[] {
        const retVal: vscode.DocumentSymbol[] = [];
        imports.forEach(imp => {
            const nullPos = new vscode.Position(0, 0);
            const nullRange = new vscode.Range(nullPos, nullPos);
            const docSymbol = new vscode.DocumentSymbol(imp.name, "import", vscode.SymbolKind.Namespace, nullRange, nullRange);
            retVal.push(docSymbol);
        });
        return retVal;
    }

    parseDefinitions(document: vscode.TextDocument, parentName: string, defs: Definition[]): vscode.DocumentSymbol[] {
        const retVal: vscode.DocumentSymbol[] = [];
        defs.forEach(def => {
            console.log(`${def.fullname.toLowerCase()}.indexOf(${parentName.toLowerCase()}) === ${def.fullname.toLowerCase().indexOf(parentName.toLowerCase())}`);
            if (!parentName || def.fullname.toLowerCase().indexOf(parentName.toLowerCase()) === 0) {
                const docSymbol = new vscode.DocumentSymbol(def.name, def.type, this.typeToSymbolKind(def.type), this.calcRange(document, def), this.calcSelectionRange(document, def));
                docSymbol.children = this.parseDefinitions(document, def.fullname, def.definitions);
                def.fields.forEach(field => {
                    if (field.definition !== def) {
                        docSymbol.children = docSymbol.children.concat(this.parseDefinitions(document, def.fullname, [field.definition]));
                    }
                });
                retVal.push(docSymbol);
            }
        });
        return retVal;
    }

    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        let retVal: vscode.DocumentSymbol[] = [];
        let metaWorkspace: undefined | Workspace;
        if (vscode.workspace.rootPath) {
            metaWorkspace = attachWorkspace(vscode.workspace.rootPath);
        } else if (vscode.workspace.workspaceFolders) {
            for (const wuf of vscode.workspace.workspaceFolders) {
                if (wuf.uri.fsPath !== vscode.workspace.rootPath) {
                    metaWorkspace = attachWorkspace(wuf.uri.fsPath);
                    break;
                }
            }
        }
        if (metaWorkspace !== undefined) {
            const eclSource: Source = metaWorkspace._sourceByPath.get(document.fileName);
            if (eclSource) {
                retVal = retVal.concat(this.parseImports(document, eclSource.imports));
                retVal = retVal.concat(this.parseDefinitions(document, "", eclSource.definitions));
            }
        }
        return retVal;
    }
}

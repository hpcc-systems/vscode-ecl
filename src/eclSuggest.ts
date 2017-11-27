import { attachWorkspace, qualifiedIDBoundary } from "@hpcc-js/comms";
import * as vscode from "vscode";

interface ECLCodeSuggestion {
    class: string;
    name: string;
    type: string;
}

interface PackageInfo {
    name: string;
    path: string;
}

export class ECLCompletionItemProvider implements vscode.CompletionItemProvider {

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {
        return this.provideCompletionItemsInternal(document, position, token, vscode.workspace.getConfiguration("ecl", document.uri));
    }

    private vscodeKindFromECLType(type: string): vscode.CompletionItemKind {
        switch (type) {
            case "record":
                return vscode.CompletionItemKind.Module;
            case "source":
                return vscode.CompletionItemKind.File;
            default:
        }
        return vscode.CompletionItemKind.Variable;
    }

    resolvePartialID(rootPath: string, filePath: string, partialID: string, offsetAt: number): vscode.CompletionItem[] | null {
        const metaWorkspace = attachWorkspace(rootPath);
        const eclDef = metaWorkspace.resolvePartialID(filePath, partialID, offsetAt);

        if (eclDef) {
            return eclDef.suggestions().map((suggestion) => {
                return new vscode.CompletionItem(suggestion.name, this.vscodeKindFromECLType(suggestion.type));
            });
        }
        return null;
    }

    public provideCompletionItemsInternal(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, config: vscode.WorkspaceConfiguration): Thenable<vscode.CompletionItem[]> {

        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {

            const lineText = document.lineAt(position.line).text;

            const lineTillCurrentPosition = lineText.substr(0, position.character);

            if (lineText.match(/^\s*\/\//)) {
                return resolve([]);
            }

            // Count the number of quotes in the line till current position. Ignore escaped double quotes
            let quoteCnt = (lineTillCurrentPosition.match(/[^\\]\'/g) || []).length;
            quoteCnt += lineTillCurrentPosition.startsWith("'") ? 1 : 0;
            const inString = (quoteCnt % 2 === 1);

            if (!inString && lineTillCurrentPosition.endsWith('\"')) {
                return resolve([]);
            }

            const startCharPos = qualifiedIDBoundary(lineText, position.character - 1, true);
            const partialID = lineText.substring(startCharPos, position.character + 1);

            let completionItems = this.resolvePartialID(vscode.workspace.rootPath, document.fileName, partialID, document.offsetAt(position));
            if (!completionItems) {
                for (const wuf of vscode.workspace.workspaceFolders) {
                    if (wuf.uri.fsPath !== vscode.workspace.rootPath) {
                        completionItems = this.resolvePartialID(wuf.uri.fsPath, document.fileName, partialID, document.offsetAt(position));
                        if (completionItems) {
                            break;
                        }
                    }
                }
            }
            resolve(completionItems);
        });
    }
}

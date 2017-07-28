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
        return this.provideCompletionItemsInternal(document, position, token, vscode.workspace.getConfiguration("ecl"));
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

    public provideCompletionItemsInternal(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, config: vscode.WorkspaceConfiguration): Thenable<vscode.CompletionItem[]> {

        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {

            const lineText = document.lineAt(position.line).text;

            const lineTillCurrentPosition = lineText.substr(0, position.character);

            if (lineText.match(/^\s*\/\//)) {
                return resolve([]);
            }

            // Count the number of double quotes in the line till current position. Ignore escaped double quotes
            let quoteCnt = (lineTillCurrentPosition.match(/[^\\]\'/g) || []).length;
            quoteCnt += lineTillCurrentPosition.startsWith("'") ? 1 : 0;
            const inString = (quoteCnt % 2 === 1);

            if (!inString && lineTillCurrentPosition.endsWith('\"')) {
                return resolve([]);
            }

            const startCharPos = qualifiedIDBoundary(lineText, position.character - 1, true);
            const partialID = lineText.substring(startCharPos, position.character + 1);

            const metaWorkspace = attachWorkspace(vscode.workspace.rootPath);
            const eclDef = metaWorkspace.resolvePartialID(document.fileName, partialID, document.offsetAt(position));

            if (eclDef) {
                resolve(eclDef.suggestions().map((suggestion) => {
                    return new vscode.CompletionItem(suggestion.name, this.vscodeKindFromECLType(suggestion.type));
                }));

            } else {
                resolve(null);
            }
        });
    }
}

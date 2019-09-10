import { attachWorkspace, ECLScope, qualifiedIDBoundary } from "@hpcc-js/comms";
import * as vscode from "vscode";

export class ECLDefinitionProvider implements vscode.DefinitionProvider {

    definitionLocation(document: vscode.TextDocument, position: vscode.Position, includeDocs = true): Promise<ECLScope | undefined> {
        return new Promise<ECLScope | undefined>((resolve, reject) => {
            const wordAtPosition = document.getWordRangeAtPosition(position);
            if (wordAtPosition) {
                const line = wordAtPosition.start.line;
                const lineText = document.lineAt(line).text;
                const startCharPos = qualifiedIDBoundary(lineText, wordAtPosition.start.character - 1, true);
                const endCharPos = qualifiedIDBoundary(lineText, wordAtPosition.end.character, false);
                const qualifiedID = lineText.substring(startCharPos, endCharPos + 1);

                if (vscode.workspace.rootPath) {
                    let metaWorkspace = attachWorkspace(vscode.workspace.rootPath);
                    let eclDef = metaWorkspace.resolveQualifiedID(document.fileName, qualifiedID, document.offsetAt(position));
                    if (!eclDef && vscode.workspace.workspaceFolders) {
                        for (const wuf of vscode.workspace.workspaceFolders) {
                            if (wuf.uri.fsPath !== vscode.workspace.rootPath) {
                                metaWorkspace = attachWorkspace(wuf.uri.fsPath);
                                eclDef = metaWorkspace.resolveQualifiedID(document.fileName, qualifiedID, document.offsetAt(position));
                                if (eclDef) {
                                    break;
                                }
                            }
                        }
                    }
                    resolve(eclDef);
                }
            }
            resolve(undefined);
        });
    }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Location | undefined> {
        return this.definitionLocation(document, position, false).then((definitionInfo) => {
            if (definitionInfo === undefined) return undefined;
            const definitionResource = vscode.Uri.file(definitionInfo.sourcePath);
            const pos = new vscode.Position(definitionInfo.line, 0);
            return new vscode.Location(definitionResource, pos);
        });
    }
}

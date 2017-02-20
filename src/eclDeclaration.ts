import { attachWorkspace, ECLScope, qualifiedIDBoundary } from "./files/ECLMeta";

import vscode = require("vscode");

export function definitionLocation(document: vscode.TextDocument, position: vscode.Position, includeDocs = true): Promise<ECLScope> {
    return new Promise<ECLScope>((resolve, reject) => {
        const wordAtPosition = document.getWordRangeAtPosition(position);
        if (wordAtPosition) {
            const line = wordAtPosition.start.line;
            const lineText = document.lineAt(line).text;
            const startCharPos = qualifiedIDBoundary(lineText, wordAtPosition.start.character - 1, true);
            const endCharPos = qualifiedIDBoundary(lineText, wordAtPosition.end.character, false);
            const qualifiedID = lineText.substring(startCharPos, endCharPos + 1);

            const metaWorkspace = attachWorkspace(vscode.workspace.rootPath);
            resolve(metaWorkspace.resolveQualifiedID(document.fileName, qualifiedID, document.offsetAt(position)));
        }
        resolve(null);
    });
}

export class ECLDefinitionProvider implements vscode.DefinitionProvider {

    public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Location> {
        return definitionLocation(document, position, false).then((definitionInfo) => {
            if (definitionInfo === null) return null;
            const definitionResource = vscode.Uri.file(definitionInfo.sourcePath);
            const pos = new vscode.Position(definitionInfo.line, 0);
            return new vscode.Location(definitionResource, pos);
        });
    }
}

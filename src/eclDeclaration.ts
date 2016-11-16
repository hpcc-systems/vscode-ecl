import { attachECLWorkspace } from './files/ECLWorkspace';
import { qualifiedIDBoundary, ECLDefinitionLocation } from './files/ECLMeta'

import vscode = require('vscode');

export function definitionLocation(document: vscode.TextDocument, position: vscode.Position, includeDocs = true): Promise<ECLDefinitionLocation> {
	return new Promise<ECLDefinitionLocation>((resolve, reject) => {
		let wordAtPosition = document.getWordRangeAtPosition(position);
		if (wordAtPosition) {
			const line = wordAtPosition.start.line;
			const lineText = document.lineAt(line).text;
			const startCharPos = qualifiedIDBoundary(lineText, wordAtPosition.start.character - 1, true);
			const endCharPos = qualifiedIDBoundary(lineText, wordAtPosition.end.character, false);
			const qualifiedID = lineText.substring(startCharPos, endCharPos + 1);

			const eclWorkspace = attachECLWorkspace();
			resolve(eclWorkspace.locateQualifiedID(document.fileName, qualifiedID, document.offsetAt(position)));
		}
		resolve(null);
	});
}

export class ECLDefinitionProvider implements vscode.DefinitionProvider {

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Location> {
		return definitionLocation(document, position, false).then(definitionInfo => {
			if (definitionInfo === null) return null;
			let definitionResource = vscode.Uri.file(definitionInfo.filePath);
			let pos = new vscode.Position(definitionInfo.line, definitionInfo.charPos);
			return new vscode.Location(definitionResource, pos);
		});
	}

}

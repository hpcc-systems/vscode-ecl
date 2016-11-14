import { attachECLWorkspace } from './files/ECLWorkspace';
import { ECLDefinitionInformtation } from './files/ECLMeta'

import vscode = require('vscode');

function isQualifiedIDChar(document: vscode.TextDocument, line: number, charPos: number) {
	if (charPos < 0) return false;
	let testChar = document.getText(new vscode.Range(line, charPos, line, charPos + 1));
	return /[a-zA-Z_\.]/.test(testChar);
}

function qualifiedIDBoundary(doc: vscode.TextDocument, line: number, charPos: number, reverse: boolean) {
	while (isQualifiedIDChar(doc, line, charPos)) {
		charPos += reverse ? -1 : 1;
	}
	return charPos + (reverse ? 1 : -1);
}

export function definitionLocation(document: vscode.TextDocument, position: vscode.Position, includeDocs = true): Promise<ECLDefinitionInformtation> {
	return new Promise<ECLDefinitionInformtation>((resolve, reject) => {
		let wordAtPosition = document.getWordRangeAtPosition(position);
		if (wordAtPosition) {
			const eclWorkspace = attachECLWorkspace();
			const line = wordAtPosition.start.line;
			const origCharPos = wordAtPosition.start.character;
			const startCharPos = qualifiedIDBoundary(document, line, origCharPos - 1, true);
			const endCharPos = qualifiedIDBoundary(document, line, origCharPos + 1, false);
			const qualifiedID = document.getText(new vscode.Range(line, startCharPos, line, endCharPos + 1));
			resolve(eclWorkspace.locateQualifiedID(document.fileName, qualifiedID, origCharPos - startCharPos));
		}
		resolve(null);
	});
}

export class ECLDefinitionProvider implements vscode.DefinitionProvider {

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Location> {
		return definitionLocation(document, position, false).then(definitionInfo => {
			if (definitionInfo === null) return null;
			let definitionResource = vscode.Uri.file(definitionInfo.filePath);
			let pos = new vscode.Position(definitionInfo.definition.line, 0);
			return new vscode.Location(definitionResource, pos);
		});
	}

}

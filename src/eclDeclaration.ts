import { attachECLWorkspace } from './files/ECLWorkspace';
import { byteOffsetAt } from './util';

import vscode = require('vscode');

export interface ECLDefinitionInformtation {
	filePath: string;
	line: number;
	col: number;
	lines: string[];
	doc: string;
}

export function definitionLocation(document: vscode.TextDocument, position: vscode.Position, includeDocs = true): Promise<ECLDefinitionInformtation> {
	return new Promise<ECLDefinitionInformtation>((resolve, reject) => {
		let startColumn = 0;
		let endColumn = 1;

		let wordAtPosition = document.getWordRangeAtPosition(position);
		if (wordAtPosition) {
			let word = document.getText(wordAtPosition);
			let line = wordAtPosition.start.line;
			let char = wordAtPosition.start.character - 1;
			while (char >= 0) {
				let testChar = document.getText(new vscode.Range(line, char, line, char + 1));
				if (!/[a-zA-Z_\.]/.test(testChar)) {
					break;
				}
				--char;
			}
			let qualifiedID = document.getText(new vscode.Range(line, char + 1, wordAtPosition.end.line, wordAtPosition.end.character));
			console.log(qualifiedID);
			let eclWorkspace = attachECLWorkspace(vscode.workspace.rootPath);
		}
		return null;
	});
}

export class ECLDefinitionProvider implements vscode.DefinitionProvider {

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Location> {
		return definitionLocation(document, position, false).then(definitionInfo => {
			if (definitionInfo === null) return null;
			let definitionResource = vscode.Uri.file(definitionInfo.filePath);
			let pos = new vscode.Position(definitionInfo.line, definitionInfo.col);
			return new vscode.Location(definitionResource, pos);
		});
	}

}

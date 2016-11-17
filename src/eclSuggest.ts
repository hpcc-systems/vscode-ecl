import vscode = require('vscode');
import { attachWorkspace, qualifiedIDBoundary } from './files/ECLMeta';

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
		return this.provideCompletionItemsInternal(document, position, token, vscode.workspace.getConfiguration('ecl'));
	}

	public provideCompletionItemsInternal(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, config: vscode.WorkspaceConfiguration): Thenable<vscode.CompletionItem[]> {
		return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
			let lineText = document.lineAt(position.line).text;
			let lineTillCurrentPosition = lineText.substr(0, position.character);

			if (lineText.match(/^\s*\/\//)) {
				return resolve([]);
			}

			// Count the number of double quotes in the line till current position. Ignore escaped double quotes
			let quoteCnt = (lineTillCurrentPosition.match(/[^\\]\'/g) || []).length;
			quoteCnt += lineTillCurrentPosition.startsWith('\'') ? 1 : 0;
			let inString = (quoteCnt % 2 === 1);

			if (!inString && lineTillCurrentPosition.endsWith('\"')) {
				return resolve([]);
			}

			const startCharPos = qualifiedIDBoundary(lineText, position.character - 1, true);
			const partialID = lineText.substring(startCharPos, position.character + 1);

			const metaWorkspace = attachWorkspace();
			const eclDef = metaWorkspace.locatePartialID(document.fileName, partialID, document.offsetAt(position));
			if (eclDef) {
				if (eclDef.definition) {
					resolve(eclDef.definition.definitions.map(def => {
						return new vscode.CompletionItem(def.name);
					}).concat(eclDef.definition.fields.map(field => {
						return new vscode.CompletionItem(field.name);
					})));
				} else if (eclDef.source) {
					resolve(eclDef.source.definitions.map(def => {
						return new vscode.CompletionItem(def.name);
					}));
				}
			} else {
				resolve(null);
			}
		});
	}

}

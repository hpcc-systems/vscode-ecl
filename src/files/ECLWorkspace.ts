import { ISource, ECLDefinitionInformtation, defMatch } from './ECLMeta';
import { ECLFile, createECLFile } from './ECLFile';

const vscode = require('vscode');
const path = require('path');

class ECLWorkspace {
	_workspacePath;
	_eclFilesByID = new Map<string, ECLFile>();
	_eclFilesByPath = new Map<string, ECLFile>();

	constructor(workspacePath) {
		this._workspacePath = workspacePath;
	}


	locateQualifiedID(filePath: string, qualifiedID: string, charPos: number): ECLDefinitionInformtation {
		qualifiedID = qualifiedID.toLowerCase();
		let retVal = null;
		if (this._eclFilesByPath.has(filePath)) {
			const eclFile = this._eclFilesByPath.get(filePath);
			let def = defMatch(eclFile.definitions(), qualifiedID);
			if (def) {
				retVal = <ECLDefinitionInformtation>{
					filePath: eclFile.filePath,
					definition: def
				};
			}
			if (!retVal) {
				const imports = eclFile.imports();
				imports.some(imp => {
					if (qualifiedID.indexOf(imp.name) === 0) {
						if (this._eclFilesByID.has(imp.ref)) {
							const impRefParts = imp.ref.split('.');
							const partialID = impRefParts[impRefParts.length - 1] + '.' + qualifiedID.substring(imp.name.length + 1);
							retVal = this.locateQualifiedID(this._eclFilesByID.get(imp.ref).filePath, partialID, charPos);
						}

					}
					return retVal !== null;
				});
			}
		}
		return retVal;
	}

	updateMeta(sourcesMeta: ISource[], _includeFolders: string[]) {
		const includeFolders = [this._workspacePath].concat(_includeFolders.map(includeFolder => {
			return path.normalize(this._workspacePath + path.sep + includeFolder);
		}));
		sourcesMeta.forEach(source => {
			const eclFile = createECLFile(source.filePath);
			eclFile.imports(source.imports);
			eclFile.definitions(source.defiitions);
			const qualifiedID = eclFile.calcQualifiedID(includeFolders);
			if (qualifiedID) {
				this._eclFilesByID.set(qualifiedID, eclFile);
				this._eclFilesByPath.set(eclFile.filePath, eclFile);
			}
		});
	}
}

const workspaceCache = new Map<string, ECLWorkspace>();
export function attachECLWorkspace(_workspacePath = vscode.workspace.rootPath): ECLWorkspace {
	const workspacePath = path.normalize(_workspacePath);
	if (!workspaceCache.has(workspacePath)) {
		workspaceCache.set(workspacePath, new ECLWorkspace(workspacePath));
	}
	return workspaceCache.get(workspacePath);
}

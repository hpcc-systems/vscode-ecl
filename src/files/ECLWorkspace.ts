import { ISource, ECLDefinitionLocation, importMatch, defMatch } from './ECLMeta';
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

	locateQualifiedID(filePath: string, qualifiedID: string, charOffset: number): ECLDefinitionLocation {
		qualifiedID = qualifiedID.toLowerCase();
		let retVal = null;
		if (this._eclFilesByPath.has(filePath)) {
			const eclFile = this._eclFilesByPath.get(filePath);
			let def;
			let defs = eclFile.definitionStackAt(charOffset);
			defs.some(_def => {
				def = defMatch(_def.definitions, qualifiedID);
				return !!def;
			});
			if (def) {
				retVal = <ECLDefinitionLocation>{
					filePath: eclFile.filePath,
					line: def.line,
					charPos: 0,
					definition: def
				};
			}
			if (!retVal) {
				const imports = eclFile.imports();
				let bestSource: ISource;
				imports.some(imp => {
					if (qualifiedID.indexOf(imp.name) === 0) {
						if (this._eclFilesByID.has(imp.ref)) {
							const eclFile = this._eclFilesByID.get(imp.ref);
							bestSource = eclFile.toISource();
							const impRefParts = imp.ref.split('.');
							const partialID = impRefParts[impRefParts.length - 1] + '.' + qualifiedID.substring(imp.name.length + 1);
							retVal = this.locateQualifiedID(eclFile.filePath, partialID, charOffset);
						}

					}
					return retVal !== null;
				});
				if (!retVal && bestSource) {
					retVal = this.locateQualifiedID(bestSource.filePath, qualifiedID, charOffset);
					if (!retVal) {
						retVal = <ECLDefinitionLocation>{
							filePath: bestSource.filePath,
							line: 0,
							charPos: 0,
							source: bestSource
						};
					}
				}
			}
		}
		return retVal;
	}

	locatePartialID(filePath: string, partialID: string, charOffset: number): ECLDefinitionLocation {
		partialID = partialID.toLowerCase();
		if (this._eclFilesByPath.has(filePath)) {
			const eclFile = this._eclFilesByPath.get(filePath);
			const partialIDParts = partialID.split('.');
			partialIDParts.pop();
			const partialIDQualifier = partialIDParts.join('.');
			return this.locateQualifiedID(filePath, partialIDQualifier, charOffset);
		}
		return null;
	}

	updateMeta(sourcesMeta: ISource[], _includeFolders: string[]) {
		const includeFolders = [this._workspacePath].concat(_includeFolders.map(includeFolder => {
			return path.normalize(this._workspacePath + path.sep + includeFolder);
		}));
		sourcesMeta.forEach(source => {
			const eclFile = createECLFile(source.filePath);
			if (source.imports.length) {
				eclFile.imports(source.imports);
			}
			if (source.definitions.length) {
				eclFile.definitions(source.definitions);
			}
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

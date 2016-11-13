import { ISource } from './ECLMeta';
import { ECLFile, createECLFile } from './ECLFile';

const path = require('path');

class ECLWorkspace {
	_workspacePath;
	_eclFilesByID = new Map<string, ECLFile>();

	constructor(workspacePath) {
		this._workspacePath = workspacePath;
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
			}
		});
	}
}

const workspaceCache = new Map<string, ECLWorkspace>();
export function attachECLWorkspace(_workspacePath): ECLWorkspace {
	const workspacePath = path.normalize(_workspacePath);
	if (!workspaceCache.has(workspacePath)) {
		workspaceCache.set(workspacePath, new ECLWorkspace(workspacePath));
	}
	return workspaceCache.get(workspacePath);
}

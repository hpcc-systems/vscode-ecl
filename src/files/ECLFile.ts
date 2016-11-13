import { IImport, IDefinition } from './ECLMeta';

const path = require('path');

export class ECLFile {
	readonly filePath: string;
	private _imports: IImport[];
	private _definitions: IDefinition[];

	constructor(filePath) {
		this.filePath = filePath;
	}

	calcQualifiedID(includeFolders: string[]): string {
		let retVal = '';
		includeFolders.some(folder => {
			if (this.filePath.indexOf(folder) === 0) {
				const relPath = this.filePath.substring(folder.length + 1);
				let relPathInfo = path.parse(relPath);
				retVal = relPathInfo.dir.split(path.sep).join('.') + '.' + relPathInfo.name;
				return true;
			}
			return false;
		});
		if (!retVal) console.log('Unable to calculate Qualified ID:  ' + this.filePath);
		return retVal;
	}

	clearDefinitions() {
		this._definitions = [];
	}

	imports(_: IImport[]): any {
		if (!arguments.length) return this._imports;
		this._imports = _;
		_.forEach(imp => {
			console.log('\t- ' + imp.ref + ' AS ' + imp.name);
		});
		return this;
	}

	definitions(_: IDefinition[]): any {
		if (!arguments.length) return this._definitions;
		this._definitions = _;
		_.forEach(def => {
			console.log('\t* ' + def.id + ' - ' + def.exported);
			def.definitions.forEach(def => {
				console.log('\t\t* ' + def.id);
			});
		});
		return this;
	}
}

const fileCache = new Map<string, ECLFile>();

export function createECLFile(_filePath): ECLFile {
	const filePath = path.normalize(_filePath);
	if (!fileCache.has(filePath)) {
		fileCache.set(filePath, new ECLFile(filePath));
	}
	return fileCache.get(filePath);
}


import { ISource, IImport, IDefinition } from './ECLMeta';

const path = require('path');

export class ECLFile {
	readonly filePath: string;
	private _imports: IImport[] = [];
	private _definitions: IDefinition[] = [];

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

	imports(_?: IImport[]): any {
		if (!arguments.length) return this._imports;
		this._imports = _;
		_.forEach(imp => {
			console.log('\t- ' + imp.ref + ' AS ' + imp.name);
		});
		return this;
	}

	definitions(_?: IDefinition[]): any {
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

	private _defAt(defs: IDefinition[], charOffset: number, stack: IDefinition[]) {
		for (let i = 0; i < defs.length; ++i) {
			const def = defs[i];
			let retVal = this._defAt(def.definitions, charOffset, stack);
			if (retVal) {
				stack.push(def);
				return;
			}
			if (charOffset >= def.start && charOffset <= def.end) {
				stack.push(def);
				return;
			}
		}
	}

	definitionStackAt(charOffset: number): IDefinition[] {
		const retVal = [];
		this._defAt(this.definitions(), charOffset, retVal);
		retVal.push(this.toISource());
		return retVal;
	}

	toISource(): ISource {
		return {
			filePath: this.filePath,
			imports: this.imports(),
			definitions: this.definitions()
		};
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


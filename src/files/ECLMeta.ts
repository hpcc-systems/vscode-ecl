const vscode = require('vscode');
const path = require('path');
const xml2js = require('xml2js');

const _knownKeys = {};
const _inspect = true;
function inspect(obj, _id, known) {
	if (_inspect) {
		for (let key in obj) {
			const id = `${_id}.${key}`;
			if (key !== '$' && known[key] === undefined && known[key.toLowerCase() + 's'] === undefined) {
				console.log(id);
			}
		}
		if (obj.$) {
			inspect(obj.$, _id + '.$', known);
		}
	}
}

export function importMatch(imps: Import[], qualifiedID: string) {
	let retVal = imps.find(imp => {
		if (imp.name === qualifiedID) {
			return true;
		}
		return false;
	});
	return retVal;
}

export class Attr {
	name: string;

	constructor(xmlAttr) {
		this.name = xmlAttr.$.name;
	}
}

export class Field {
	name: string;
	type: string;

	constructor(xmlField) {
		this.name = xmlField.$.name;
		this.type = xmlField.$.type;
	}
}

export interface ECLDefinitionLocation {
	filePath: string;
	line: number;
	charPos: number;
	definition?: Definition;
	source?: Source;
}

export interface ISuggestion {
	name: string;
	type: string;
}

export class ECLScope {
	name: string;
	type: string;
	sourcePath: string;
	line: number;
	definitions: Definition[];

	constructor(name, type, sourcePath, line: number, xmlDefinitions) {
		this.name = name;
		this.type = type;
		console.log(type);
		this.sourcePath = sourcePath;
		this.line = line;
		this.definitions = this.parseDefinitions(xmlDefinitions);
	}

	private parseDefinitions(definitions = [], parentID = ''): Definition[] {
		return definitions.map(definition => {
			const retVal = new Definition(this.sourcePath, definition);
			inspect(definition, 'definition', retVal);
			return retVal;
		});
	}

	private _resolve(defs: Definition[] = [], qualifiedID: string) {
		const qualifiedIDParts = qualifiedID.split('.');
		const top = qualifiedIDParts.shift();
		let retVal = defs.find(def => {
			if (def.name === top) {
				return true;
			}
			return false;
		});
		if (retVal && retVal.definitions.length && qualifiedIDParts.length) {
			return this._resolve(retVal.definitions, qualifiedIDParts.join('.'));
		}
		return retVal;
	}

	resolve(qualifiedID: string) {
		return this._resolve(this.definitions, qualifiedID);
	}

	suggestions(): ISuggestion[] {
		return this.definitions.map(def => {
			return {
				name: def.name,
				type: this.type
			};
		});
	}
}

export class Definition extends ECLScope {
	start: number;
	body: number;
	end: number;
	exported: boolean;
	shared: boolean;
	attrs?: Attr[];
	fields?: Field[];

	constructor(sourcePath, xmlDefinition) {
		super(xmlDefinition.$.name, xmlDefinition.$.type, sourcePath, xmlDefinition.$.line - 1, xmlDefinition.Definition);
		this.start = xmlDefinition.$.start;
		this.body = xmlDefinition.$.body;
		this.end = xmlDefinition.$.end;
		this.exported = !!xmlDefinition.$.exported;
		this.shared = !!xmlDefinition.$.shared;
		this.attrs = this.parseAttrs(xmlDefinition.Attr);
		this.fields = this.parseFields(xmlDefinition.Field);
	}

	private parseAttrs(attrs = []): Attr[] {
		return attrs.map(attr => {
			const retVal = new Attr(attr);
			inspect(attr, 'attr', retVal);
			return retVal;
		});
	}

	private parseFields(fields = []): Field[] {
		return fields.map(field => {
			const retVal = new Field(field);
			inspect(field, 'field', retVal);
			return retVal;
		});
	}

	suggestions() {
		return super.suggestions().concat(this.fields.map(field => {
			return {
				name: field.name,
				type: field.type
			};
		}));
	}
}

export class Import {
	name: string;
	ref: string;
	start: number;
	end: number;
	line: number;

	constructor(xmlImport) {
		this.name = xmlImport.$.name;
		this.ref = xmlImport.$.ref;
		this.start = xmlImport.$.start;
		this.end = xmlImport.$.end;
		this.line = xmlImport.$.line;
	}
}

export class Source extends ECLScope {
	imports: Import[];

	constructor(xmlSource) {
		super(xmlSource.$.name, 'source', xmlSource.$.sourcePath, 0, xmlSource.Definition);
		this.imports = this.parseImports(xmlSource.Import);
	}

	private parseImports(imports = []): Import[] {
		return imports.map(imp => {
			const retVal = new Import(imp);
			inspect(imp, 'import', retVal);
			return retVal;
		});
	}

	private _defAt(defs: Definition[], charOffset: number, stack: Definition[]) {
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

	scopeStackAt(charOffset: number): ECLScope[] {
		const retVal = [];
		this._defAt(this.definitions, charOffset, retVal);
		retVal.push(this);
		return retVal;
	}
}

export class Workspace {
	_workspacePath;
	_sourceByID = new Map<string, Source>();
	_sourceByPath = new Map<string, Source>();

	constructor(workspacePath) {
		this._workspacePath = workspacePath;
	}

	parseSources(sources = []) {
		return sources.map(_source => {
			const source = new Source(_source);
			inspect(_source, 'source', source);
			this._sourceByID.set(source.name, source);
			this._sourceByPath.set(source.sourcePath, source);
		});
	}

	parseMetaXML(metaXML) {
		let retVal = [];
		let parser = new xml2js.Parser();
		parser.parseString(metaXML, (err, result) => {
			if (result && result.Meta && result.Meta.Source) {
				this.parseSources(result.Meta.Source);
			}
		});
		return retVal;
	}

	resolveQualifiedID(filePath: string, qualifiedID: string, charOffset: number): ECLScope {
		qualifiedID = qualifiedID.toLowerCase();
		let retVal: ECLScope = null;
		if (this._sourceByPath.has(filePath)) {
			const eclSource = this._sourceByPath.get(filePath);
			let scopes = eclSource.scopeStackAt(charOffset);
			scopes.some(scope => {
				retVal = scope.resolve(qualifiedID);
				return !!retVal;
			});
			if (!retVal) {
				const imports = eclSource.imports;
				let bestSource: Source;
				imports.some(imp => {
					if (this._sourceByID.has(imp.ref)) {
						const eclFile = this._sourceByID.get(imp.ref);
						if (qualifiedID === imp.ref.toLowerCase()) {
							// bestSource = eclFile.toISource();
						}
						if (qualifiedID === imp.name || qualifiedID.indexOf(imp.name + '.') === 0) {
							// bestSource = eclFile.toISource();
							const impRefParts = imp.ref.split('.');
							const partialID = impRefParts[impRefParts.length - 1] + '.' + qualifiedID.substring(imp.name.length + 1);
							retVal = this.resolveQualifiedID(eclFile.sourcePath, partialID, charOffset);
						}
					}
					return retVal !== null;
				});
				if (!retVal && bestSource) {
					retVal = this.resolveQualifiedID(bestSource.sourcePath, qualifiedID, charOffset);
				}
			}
		}
		return retVal;
	}

	resolvePartialID(filePath: string, partialID: string, charOffset: number): ECLScope {
		partialID = partialID.toLowerCase();
		if (this._sourceByPath.has(filePath)) {
			const partialIDParts = partialID.split('.');
			partialIDParts.pop();
			const partialIDQualifier = partialIDParts.length === 1 ? partialIDParts[0] : partialIDParts.join('.');
			return this.resolveQualifiedID(filePath, partialIDQualifier, charOffset);
		}
		return null;
	}


	locateQualifiedIDXXX(filePath: string, qualifiedID: string, charOffset: number): ECLDefinitionLocation {
		qualifiedID = qualifiedID.toLowerCase();
		let retVal = null;
		if (this._sourceByPath.has(filePath)) {
			const eclSource = this._sourceByPath.get(filePath);
			let scopes = eclSource.scopeStackAt(charOffset);
			scopes.some(scope => {
				let def = scope.resolve(qualifiedID);
				if (def) {
					retVal = <ECLDefinitionLocation>{
						filePath: eclSource.sourcePath,
						line: def.line,
						charPos: 0,
						definition: def
					};
				}
				return !!retVal;
			});
			if (!retVal) {
				const imports = eclSource.imports;
				let bestSource: Source;
				imports.some(imp => {
					if (this._sourceByID.has(imp.ref)) {
						const eclFile = this._sourceByID.get(imp.ref);
						if (qualifiedID === imp.ref.toLowerCase()) {
							// bestSource = eclFile.toISource();
						}
						if (qualifiedID === imp.name || qualifiedID.indexOf(imp.name + '.') === 0) {
							// bestSource = eclFile.toISource();
							const impRefParts = imp.ref.split('.');
							const partialID = impRefParts[impRefParts.length - 1] + '.' + qualifiedID.substring(imp.name.length + 1);
							retVal = this.locateQualifiedIDXXX(eclFile.sourcePath, partialID, charOffset);
						}
					}
					return retVal !== null;
				});
				if (!retVal && bestSource) {
					retVal = this.locateQualifiedIDXXX(bestSource.sourcePath, qualifiedID, charOffset);
					if (!retVal) {
						retVal = <ECLDefinitionLocation>{
							filePath: bestSource.sourcePath,
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

	locatePartialIDXXX(filePath: string, partialID: string, charOffset: number): ECLDefinitionLocation {
		partialID = partialID.toLowerCase();
		if (this._sourceByPath.has(filePath)) {
			const partialIDParts = partialID.split('.');
			partialIDParts.pop();
			const partialIDQualifier = partialIDParts.length === 1 ? partialIDParts[0] : partialIDParts.join('.');
			return this.locateQualifiedIDXXX(filePath, partialIDQualifier, charOffset);
		}
		return null;
	}

}

const workspaceCache = new Map<string, Workspace>();
export function attachWorkspace(_workspacePath = vscode.workspace.rootPath): Workspace {
	const workspacePath = path.normalize(_workspacePath);
	if (!workspaceCache.has(workspacePath)) {
		workspaceCache.set(workspacePath, new Workspace(workspacePath));
	}
	return workspaceCache.get(workspacePath);
}

function isQualifiedIDChar(lineText: string, charPos: number) {
	if (charPos < 0) return false;
	let testChar = lineText.charAt(charPos);
	return /[a-zA-Z\d_\.]/.test(testChar);
}

export function qualifiedIDBoundary(lineText: string, charPos: number, reverse: boolean) {
	while (isQualifiedIDChar(lineText, charPos)) {
		charPos += reverse ? -1 : 1;
	}
	return charPos + (reverse ? 1 : -1);
}


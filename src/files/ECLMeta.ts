const xml2js = require('xml2js');

export interface IImport {
	name: string;
	ref: string;
	start: number;
	end: number;
	line: number;
}

export function importMatch(imps: IImport[], qualifiedID: string) {
	let retVal = imps.find(imp => {
		if (imp.name === qualifiedID) {
			return true;
		}
		return false;
	});
	return retVal;
}

export interface IAttr {
	name: string;
}

export interface IField {
	name: string;
	type: string;
}

export interface IDefinition {
	id: string;
	name: string;
	start: number;
	body: number;
	end: number;
	line: number;
	type: string;
	exported: boolean;
	shared: boolean;
	attrs?: IAttr[];
	definitions?: IDefinition[];
	fields?: IField[];
}

export function defMatch(defs: IDefinition[] = [], qualifiedID: string) {
	const qualifiedIDParts = qualifiedID.split('.');
	const top = qualifiedIDParts.shift();
	let retVal = defs.find(def => {
		if (def.name === top) {
			return true;
		}
		return false;
	});
	if (retVal && retVal.definitions.length && qualifiedIDParts.length) {
		return defMatch(retVal.definitions, qualifiedIDParts.join('.'));
	}
	return retVal;
}

export interface ISource {
	filePath: string;
	imports: IImport[];
	definitions: IDefinition[];
}

export interface ECLDefinitionLocation {
	filePath: string;
	line: number;
	charPos: number;
	definition?: IDefinition;
	source?: ISource;
}

const _knownKeys = {};
const _inspect = false;
function inspect(obj, _id) {
	if (_inspect) {
		for (let key in obj) {
			const id = `${_id}.${key}`;
			if (!_knownKeys[id]) {
				_knownKeys[id] = true;
				console.log(id);
			}
		}
		if (obj.$) {
			inspect(obj.$, _id + '.$');
		}
	}
}

function parseAttrs(attrs = []): IAttr[] {
	return attrs.map(attr => {
		inspect(attr, 'attr');
		return <IAttr>{
			name: attr.$.name
		};
	});
}

function parseFields(fields = []): IField[] {
	return fields.map(field => {
		inspect(field, 'field');
		return <IField>{
			name: field.$.name,
			type: field.$.type
		};
	});
}

function parseImports(imports = [], parentID = ''): IImport[] {
	return imports.map(imp => {
		inspect(imp, 'import');
		return <IImport>{
			name: imp.$.name,
			ref: imp.$.ref,
			start: imp.$.start,
			end: imp.$.end,
			line: imp.$.line
		};
	});
}

function parseDefinitions(definitions = [], parentID = ''): IDefinition[] {
	return definitions.map(definition => {
		inspect(definition, 'definition');
		const id = parentID ? parentID + '.' + definition.$.name : definition.$.name;
		return <IDefinition>{
			id: id,
			name: definition.$.name,
			start: definition.$.start,
			body: definition.$.body,
			end: definition.$.end,
			line: definition.$.line - 1,
			type: definition.$.type,
			exported: !!definition.$.exported,
			shared: !!definition.$.shared,
			attrs: parseAttrs(definition.Attr),
			definitions: parseDefinitions(definition.Definition, id),
			fields: parseFields(definition.Field)
		};

	});
}

function parseSources(sources = []): ISource[] {
	return sources.map(source => {
		inspect(source, 'source');
		return <ISource>{
			filePath: source.$.sourcePath,
			imports: parseImports(source.Import),
			definitions: parseDefinitions(source.Definition)
		};
	});
}

export function parseMetaXML(metaXML) {
	let retVal = [];
	let parser = new xml2js.Parser();
	parser.parseString(metaXML, (err, result) => {
		if (result && result.Meta && result.Meta.Source) {
			retVal = parseSources(result.Meta.Source);
		}
	});
	return retVal;
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

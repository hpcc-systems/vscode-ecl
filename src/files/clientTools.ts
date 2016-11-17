import { attachWorkspace } from './ECLMeta';

const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const semver = require('semver');
const tmp = require('tmp');
const xml2js = require('xml2js');

interface IExecFile {
	stderr: string;
	stdout: string;
}

export interface IECLError {
	filePath: string;
	line: number;
	col: number;
	msg: string;
	severity: string;
}

function correctBinname(binname: string) {
	if (process.platform === 'win32')
		return binname + '.exe';
	else
		return binname;
}

export function exists(prop, scope) {
	if (!prop || !scope) {
		return false;
	}
	let propParts = prop.split('.');
	let testScope = scope;
	for (let i = 0; i < propParts.length; ++i) {
		let item = propParts[i];
		if (testScope[item] === undefined) {
			return false;
		}
		testScope = testScope[item];
	}
	return true;
}

export function walkXmlJson(node, callback, stack?) {
	stack = stack || [];
	stack.push(node);
	for (let key in node) {
		if (node.hasOwnProperty(key)) {
			let childNode = node[key];
			callback(key, childNode, stack);
			if (childNode instanceof Array) {
				childNode.forEach(child => {
					walkXmlJson(child, callback, stack);
				});
			} else if (typeof childNode === 'object') {
				walkXmlJson(childNode, callback, stack);
			}
		}
	}
	stack.pop();
}

export class LocalWorkunit {
	jsonWU: any;

	constructor(jsonWU: any) {
		this.jsonWU = jsonWU;
	}

	bpGetValidLocations(path) {
		let retVal = [];
		if (exists('W_LOCAL.Graphs', this.jsonWU)) {
			let id = '';
			walkXmlJson(this.jsonWU.W_LOCAL.Graphs, (key, item, stack) => {
				if (key === '$' && item.id) {
					id = item.id;
				}
				if (key === '$' && item.name === 'definition') {
					let match = /([a-z]:\\(?:[-\w\.\d]+\\)*(?:[-\w\.\d]+)?|(?:\/[\w\.\-]+)+)\((\d*),(\d*)\)/.exec(item.value);
					if (match) {
						let [_, file, row, _col] = match;
						let line: number = +row;
						let col: number = +_col;
						if (path === file) {
							retVal.push({ file, line, col, id });
						}
					}
				}
				// console.log(`${key}:  ` + JSON.stringify(item));
			});
		}
		return retVal;
	}
}

export class ClientTools {
	rootPath: string;
	protected binPath: string;
	protected cwd: string;
	protected includeFolders: string[];
	protected _versionPrefix: string;
	protected _version: string;

	constructor(rootPath: string, cwd?: string, includeFolders?: string[]) {
		this.rootPath = rootPath;
		this.binPath = path.join(this.rootPath, 'bin');
		this.cwd = path.normalize(cwd || this.binPath);
		this.includeFolders = includeFolders || [];
	}

	clone(cwd?: string, includeFolders?: string[]) {
		return new ClientTools(this.rootPath, cwd, includeFolders);
	}

	exists(filePath: string) {
		try {
			fs.accessSync(filePath);
			return true;
		} catch (e) { }
		return false;
	}

	exe(binName: string): string {
		return path.join(this.binPath, correctBinname(binName));
	}

	exeExists(binName: string): boolean {
		return this.exists(path.join(this.binPath, correctBinname(binName)));
	}

	version() {
		if (this._version) {
			return Promise.resolve(this._version);
		}
		let eclccPath = this.exe('eclcc');
		return this.execFile(eclccPath, ['--version'], this.binPath, 'eclcc', `Cannot find ${eclccPath}`).then((response: IExecFile) => {
			if (response && response.stdout && response.stdout.length) {
				let versions = response.stdout.split(' ');
				if (versions.length > 1) {
					let fullVersionParts = versions[1].split('_');
					if (fullVersionParts.length > 1) {
						let versionPrefix = fullVersionParts.shift();
						let version = fullVersionParts.join('_');
						if (semver.valid(version)) {
							this._versionPrefix = versionPrefix;
							this._version = version;
						}
					}
				} else if (versions.length) {
					if (semver.valid(versions[0])) {
						this._version = versions[0];
					}
				}
			}
			return this._version;
		});
	}

	versionSync() {
		return this._version;
	}

	private loadXMLDoc(filePath, removeOnRead?: boolean) {
		return new Promise((resolve, reject) => {
			let fileData = fs.readFileSync(filePath, 'ascii');
			let parser = new xml2js.Parser();
			parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
				if (removeOnRead) {
					fs.unlink(filePath);
				}
				resolve(result);
			});
		});
	}

	createWU(filename) {
		let eclccPath = this.exe('eclcc');
		let tmpName = tmp.tmpNameSync({ prefix: 'eclcc-wu-tmp', postfix: '' });
		let args = ['-o' + tmpName, '-wu'];
		args = args.concat(this.includeFolders.map(includePath => {
			let tmp = path.normalize(includePath);
			return '-I' + tmp;
		}));
		return this.execFile(eclccPath, args.concat([filename]), this.cwd, 'eclcc', `Cannot find ${eclccPath}`).then((response: IExecFile) => {
			let xmlPath = path.normalize(tmpName + '.xml');
			let contentPromise = this.exists(xmlPath) ? this.loadXMLDoc(xmlPath, true) : Promise.resolve({});
			return contentPromise.then((content) => {
				return new LocalWorkunit(content);
			});
		});
	}

	createArchive(filename: string) {
		let eclccPath = this.exe('eclcc');
		let args = ['-E'];
		args = args.concat(this.includeFolders.map(includePath => {
			let tmp = path.normalize(includePath);
			return '-I' + tmp;
		}));
		return this.execFile(eclccPath, args.concat([filename]), this.cwd, 'eclcc', `Cannot find ${eclccPath}`).then((response: IExecFile) => {
			if (response && response.stderr && response.stderr.length) {
			}
			return response.stdout;
		});
	}

	syntaxCheck(filePath: string) {
		let eclccPath = this.exe('eclcc');
		let args = ['-syntax', '-M'];
		args = args.concat(this.includeFolders.map(includePath => {
			return '-I' + path.normalize(includePath);
		}));
		return this.execFile(eclccPath, args.concat([filePath]), this.cwd, 'eclcc', `Cannot find ${eclccPath}`).then((response: IExecFile) => {
			let retVal: IECLError[] = [];
			if (response && response.stderr && response.stderr.length) {
				response.stderr.split(os.EOL).forEach(line => {
					let match = /([a-z]:\\(?:[-\w\.\d]+\\)*(?:[-\w\.\d]+)?|(?:\/[\w\.\-]+)+)\((\d*),(\d*)\): (error|warning|info) C(\d*): (.*)/.exec(line);
					if (match) {
						let [_, filePath, row, _col, severity, code, _msg] = match;
						let line: number = +row;
						let col: number = +_col;
						let msg = code + ':  ' + _msg;
						retVal.push({ filePath, line, col, msg, severity });
					}
				});
			}
			if (response && response.stdout && response.stdout.length) {
				const metaWorkspace = attachWorkspace(this.cwd);
				metaWorkspace.parseMetaXML(response.stdout);
			}
			return retVal;
		});
	}

	private execFile(cmd: string, args: string[], cwd: string, toolName: string, notFoundError?: string) {
		return new Promise((resolve, reject) => {
			console.log(`${cmd} ${args.join(' ')}`);
			let child = cp.spawn(cmd, args, { cwd: cwd });
			let stdOut = '';
			let stdErr = '';
			child.stdout.on('data', function (data) {
				stdOut += data.toString();
			});
			child.stderr.on('data', function (data) {
				stdErr += data.toString();
			});
			child.on('close', function (code, signal) {
				resolve({
					stdout: stdOut.trim(),
					stderr: stdErr.trim()
				});
			});
		});
	}
}

let allClientToolsCache: ClientTools[] = [];
export function locateAllClientTools() {
	if (allClientToolsCache.length) return Promise.resolve(allClientToolsCache);
	let rootFolder = '';
	switch (os.type()) {
		case 'Windows_NT':
			rootFolder = process.env['ProgramFiles(x86)'];
			if (!rootFolder) {
				rootFolder = process.env['ProgramFiles'];
			}
			if (!rootFolder) {
				rootFolder = 'c:\\Program Files (x86)';
			}
			break;
		case 'Linux':
		case 'Darwin':
			rootFolder = '/opt';
			break;
		default:
			break;
	}

	let promiseArray = [];
	if (rootFolder) {
		let hpccSystemsFolder = path.join(rootFolder, 'HPCCSystems');
		if (fs.existsSync(hpccSystemsFolder) && fs.statSync(hpccSystemsFolder).isDirectory()) {
			if (os.type() !== 'Windows_NT') {
				let clientToolsPath = path.join(hpccSystemsFolder, 'bin', 'eclcc');
				if (fs.existsSync(clientToolsPath)) {
					let clientTools = new ClientTools(hpccSystemsFolder);
					allClientToolsCache.push(clientTools);
					promiseArray.push(clientTools.version());
				}
			}
			fs.readdirSync(hpccSystemsFolder).forEach(function (versionFolder) {
				let clientToolsPath = path.join(hpccSystemsFolder, versionFolder, 'clienttools');
				if (fs.existsSync(clientToolsPath) && fs.statSync(clientToolsPath).isDirectory()) {
					let name = path.basename(versionFolder);
					if (semver.valid(name)) {
						let clientTools = new ClientTools(clientToolsPath);
						allClientToolsCache.push(clientTools);
						promiseArray.push(clientTools.version());
					}
				}
			});
		}
	}
	return Promise.all(promiseArray).then(function () {
		allClientToolsCache.sort(function (l: ClientTools, r: ClientTools) {
			return semver.compare(r.versionSync(), l.versionSync());
		});
		return allClientToolsCache;
	});
}

export function locateClientTools(version: string = '', cwd?: string, includeFolders?: string[]) {
	return locateAllClientTools().then((allClientToolsCache) => {
		//  TODO find best match  ---
		return allClientToolsCache[0].clone(cwd, includeFolders);
	});
}

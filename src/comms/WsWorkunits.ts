const os = require('os');
const node_url = require('url');
const request = require('request');
const xml2js = require('xml2js');

class ESPPostResponse {
	protected action: string;
	protected form: Object;
	protected error: any;
	protected exceptions: any;
	protected _content: Object;

	constructor(action: string, form: Object, error?, postResponse?, body?) {
		this.action = action;
		this.form = form;
		this.error = error;
		if (postResponse && postResponse.statusCode === 200) {
			for (let key in body) {
				switch (key) {
					case 'Exceptions':
						this.exceptions = body[key];
						return;
					default:
						if (this._content) {
							throw 'Two responses';
						}
						this._content = body[key];
						break;
				}
			}
		}
	}

	hasContent(): boolean {
		return this._content !== undefined;
	}

	content() {
		return this._content;
	}

	hasPostErrors(): boolean {
		return this.error;
	}

	postErrorsMessage() {
		return this.error.message;
	}

	hasExceptions(): boolean {
		return this.exceptions && this.exceptions.Exception.length;
	}

	exceptionsMessage(): string {
		let retVal: string = `${os.EOL}${this.action}(` + JSON.stringify(this.form) + `))${os.EOL}ESP Exception:  ${this.exceptions.Source}`;
		this.exceptions.Exception.forEach(function (exception) {
			if (retVal) retVal += os.EOL;
			retVal += exception.Code + ':  ' + exception.Message;
		});
		return retVal;
	}
}

class WUCDebugResponse extends ESPPostResponse {
	constructor(action: string, form: Object, debugResponse) {
		super(action, form);

		const parser = new xml2js.Parser();
		this._content = '';
		parser.parseString(`<root>${debugResponse.Result}</root>`, (err, root) => {
			if (err) {
				this.error = err;
			}
			if (root && root.root) {
				root = root.root;
				if (root.Exception) {
					this.exceptions = {
						Source: 'xml2js',
						Exception: root.Exception
					};
				} else if (root.Debug && root.Debug.length && root.Debug[0][this.action] && root.Debug[0][this.action].length) {
					this._content = root.Debug[0][this.action][0];
				}
			}
		});
	}
}


class ESPConnection {
	protected urlObject;

	constructor(protocol: string, hostname: string, port: number) {
		this.href(protocol + '//' + hostname + ':' + port + '/WsWorkunits');
	}

	href(_?: string) {
		if (!arguments.length) return node_url.format(this.urlObject);
		this.urlObject = node_url.parse(_);
		return this;
	}

	protected post(action: string, form: Object): Promise<any> {
		return new Promise<ESPPostResponse>((resolve, reject) => {
			request.post({
				uri: this.href() + '/' + action + '.json',
				json: true,
				form: form
			}, (error, response, body) => {
				resolve(new ESPPostResponse(action, form, error, response, body));
			});
		}).then(postResponse => {
			if (postResponse.hasPostErrors()) {
				throw new Error(postResponse.postErrorsMessage());
			}
			if (postResponse.hasExceptions()) {
				throw new Error(postResponse.exceptionsMessage());
			}
			return postResponse.content();
		});
	}
}

export class WsWorkunitsConnection extends ESPConnection {

	constructor(protocol: string, hostname: string, port: number) {
		super(protocol, hostname, port);
	}

	wuCreateAndUpdate(queryText, resultLimits: number = 100, debug: boolean = false) {
		let form: any = {
			QueryText: queryText,
			ResultLimit: resultLimits
		};
		if (debug) {
			form['DebugValues.DebugValue.0.Name'] = 'Debug';
			form['DebugValues.DebugValue.0.Value'] = 1;
			form['DebugValues.DebugValue.itemcount'] = 1;
		}
		return this.post('WUCreateAndUpdate', form).then((response) => {
			return response.Workunit;
		});
	}

	WUQuery(wuid: string) {
		return this.post('WUQuery', {
			Wuid: wuid
		}).then(response => response.Workunits.ECLWorkunit[0]);
	}

	WUSubmit(wuid: string, cluster: string) {
		return this.post('WUSubmit', {
			Wuid: wuid,
			Cluster: cluster
		});
	}

	WUAction(wuid: string, actionType: string) {
		return this.post('WUAction', {
			Wuids: wuid,
			WUActionType: actionType,
			ActionType: actionType
		}).then(response => {
			return response;
		});
	}

	WUInfo(wuid: string, opts = {}) {
		let form = {
			Wuid: wuid,
			TruncateEclTo64k: true,
			IncludeExceptions: false,
			IncludeGraphs: true,
			IncludeSourceFiles: false,
			IncludeResults: false,
			IncludeResultsViewNames: false,
			IncludeVariables: false,
			IncludeTimers: false,
			IncludeDebugValues: false,
			IncludeApplicationValues: false,
			IncludeWorkflows: false,
			IncludeXmlSchemas: false,
			IncludeResourceURLs: false,
			SuppressResultSchemas: true
		};
		for (let key in opts) {
			form[key] = opts[key];
		}
		return this.post('WUInfo', form);
	}

	WUGetGraph(wuid: string, graphName: string, subgraphId: string = '') {
		return this.post('WUGetGraph', {
			Wuid: wuid,
			GraphName: graphName,
			SubGraphId: subgraphId
		});
	}

	WUCDebug(wuid: string, command: string, opts: Object = {}) {
		let optsStr = '';
		for (let key in opts) {
			optsStr += ` ${key}='${opts[key]}'`;
		}
		return this.post('WUCDebug', {
			Wuid: wuid,
			Command: `<debug:${command} uid='${wuid}'${optsStr}/>`
		}).then(response => {
			return new WUCDebugResponse(command, opts, response);
		}).then(debugResponse => {
			if (debugResponse.hasPostErrors()) {
				throw new Error(debugResponse.postErrorsMessage());
			}
			if (debugResponse.hasExceptions()) {
				return {
					$: {
						sequence: undefined,
						state: 'exception'
					}
				};
			}
			return debugResponse.content();
		});
	}
}


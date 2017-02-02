const os = require('os');
const node_url = require('url');
const request = require('request');
const xml2js = require('xml2js');

export enum WUAction {
	Unknown = 0,
	Compile,
	Check,
	Run,
	ExecuteExisting,
	Pause,
	PauseNow,
	Resume,
	Debug,
	__size
};

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
	user: string;
	pw: string;
	rejectUnauthorized: boolean;

	constructor(protocol: string, hostname: string, port: number, user: string, pw: string, rejectUnauthorized: boolean = false) {
		this.href(protocol + '//' + hostname + ':' + port + '/WsWorkunits');
		this.user = user;
		this.pw = pw;
		this.rejectUnauthorized = rejectUnauthorized;
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
				'auth': {
					'user': this.user,
					'pass': this.pw,
					'sendImmediately': true
				},
				json: true,
				form: form,
				rejectUnauthorized: this.rejectUnauthorized
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

	constructor(protocol: string, hostname: string, port: number, user: string, pw: string, rejectUnauthorized: boolean = false) {
		super(protocol, hostname, port, user, pw, rejectUnauthorized);
	}

	WUQuery(wuid: string) {
		return this.post('WUQuery', {
			Wuid: wuid
		}).then(response => response.Workunits.ECLWorkunit[0]);
	}

	private objToESPArray(id: string, obj: any, request: any) {
		let count = 0;
		for (let key in obj) {
			request[`${id}s.${id}.${count}.Name`] = key;
			request[`${id}s.${id}.${count}.Value`] = obj[key];
			++count;
		}
		request[`${id}s.${id}.itemcount`] = count;
	}

	private WUUpdateRequest(wuid: string, request: any, appValues: any, debugValues: any) {
		if (wuid) {
			request.Wuid = wuid;
		}
		this.objToESPArray('ApplicationValue', appValues, request);
		this.objToESPArray('DebugValue', debugValues, request);
		return request;
	}

	wuCreateAndUpdate(action: WUAction, queryText, resultLimits: number = 100) {
		let debug = false;
		if (action === WUAction.Debug) {
			action = WUAction.Run;
			debug = true;
		}
		let request: any = {
			QueryText: queryText,
			ResultLimit: resultLimits,
			Action: action
		};
		return this.WUCreateAndUpdate(request, {}, { Debug: debug });
	}

	WUCreateAndUpdate(request: any, appValues: any = {}, debugValues: any = {}) {
		return this.post('WUCreateAndUpdate', this.WUUpdateRequest(null, request, appValues, debugValues)).then((response) => {
			return response.Workunit;
		});
	}

	WUUpdate(wuid: string, request: any, appValues: any, debugValues: any) {
		return this.post('WUUpdate', this.WUUpdateRequest(wuid, request, appValues, debugValues)).then((response) => {
			return response.Workunit;
		});
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


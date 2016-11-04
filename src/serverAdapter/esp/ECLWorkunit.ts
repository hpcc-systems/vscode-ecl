import { WsWorkunitsConnection } from './WsWorkunits';
import { createGraph, Graph } from './ESPGraph';

export enum WUAction {
	Unknown = 0,
	Compile,
	Check,
	Run,
	ExecuteExisting,
	Pause,
	PauseNow,
	Resume,
	__size
};

export class ECLWorkunit {
	protected connection: WsWorkunitsConnection;
	wuid: string;
	submitAction: WUAction;
	debugMode: boolean;

	private _state: any = {
		State: 'Unknown'
	};

	private _debugState: any = {
		sequence: 0,
		State: 'Unknown'
	};

	_debugAllGraph: any;

	constructor(connection: WsWorkunitsConnection, wuid: string, submitAction: WUAction = WUAction.Run, debugMode = false) {
		this.connection = connection;
		this.wuid = wuid;
		this.debugMode = debugMode;
		this.submitAction = submitAction;
	}

	query() {
		return this.connection.WUQuery(this.wuid).then((workunit) => {
			for (let key in workunit) {
				if (workunit[key]) {
					this._state[key] = workunit[key];
				}
			}
			return workunit;
		});
	}

	submit(cluster): Promise<void> {
		return this.connection.WUSubmit(this.wuid, cluster).then(() => {
			if (this.debugMode) {
				return new Promise<void>((resolve, reject) => {
					let wuMonitor = this.monitor(() => {
						this.debugStatus().then(response => {
							switch (response.state) {
								case 'created':
									wuMonitor.dispose();
									resolve();
									break;
							}
						});
					});
				});
			}
			return;
		});
	}

	protected action(actionType: string) {
		return this.connection.WUAction(this.wuid, actionType);
	}

	abort() {
		return this.action('Abort');
	}

	pauseNow() {
		return this.action('PauseNow');
	}

	resume() {
		return this.action('Resume');
	}

	stateObj() {
		return this._state;
	}

	state() {
		return this._state.State;
	}

	isComplete() {
		switch (this._state.State) {
			case 'compiled':
				return this.submitAction === WUAction.Compile;
			case 'completed':
			case 'failed':
			case 'archived':
			case 'aborted':
				return true;
		}
		return false;
	}

	isDebugging() {
		switch (this._state.State) {
			case 'debugging':
			case 'debug_running':
				return true;
		}
		return false;
	}

	debugStateObj() {
		return this._debugState;
	}

	debugState() {
		return this._debugState.State;
	}

	debug(command, opts?): Promise<any> {
		if (!this.isDebugging()) {
			return Promise.resolve({});
		}
		return this.connection.WUCDebug(this.wuid, command, opts)
		.catch((e) => {
			console.log(e);
		});
	}

	debugStatus() {
		if (!this.isDebugging()) {
			return Promise.resolve<any>({ state: 'unknown' });
		}
		return this.debug('status').then(rootNode => {
			rootNode = rootNode || {
				$: { state: 'unknown' }
			};
			for (let key in rootNode.$) {
				if (rootNode.$[key]) {
					this._debugState[key] = rootNode.$[key];
				}
			}
			return rootNode.$;
		});
	}

	debugContinue(mode = '') {
		return this.debug('continue', {
			mode: mode
		}).then(rootNode => rootNode ? rootNode.$ : null);
	}

	debugStep(mode) {
		return this.debug('step', {
			mode: mode
		}).then(rootNode => rootNode.$);
	}

	debugPause() {
		return this.debug('interrupt');
	}

	debugQuit() {
		return this.debug('quit').then(rootNode => rootNode ? rootNode.$ : null);
	}

	debugDeleteAllBreakpoints() {
		return this.debug('delete', {
			idx: 0
		});
	}

	protected debugBreakpointResponseParser(rootNode) {
		if (rootNode.break) {
			return rootNode.break.map((brk) => {
				return brk.$;
			});
		}
		return [];
	}

	debugBreakpointAdd(id, mode, action) {
		return this.debug('breakpoint', {
			id: id,
			mode: mode,
			action: action
		}).then(rootNode => this.debugBreakpointResponseParser(rootNode));
	}

	debugBreakpointList() {
		return this.debug('list').then(rootNode => this.debugBreakpointResponseParser(rootNode));
	}

	debugGraph(): Promise<Graph> {
		if (this._debugAllGraph) {
			return Promise.resolve(this._debugAllGraph);
		}
		return this.debug('graph', {name: 'all'}).then((response: any) => {
			this._debugAllGraph = createGraph(response.Query[0].Graph);
			return this._debugAllGraph;
		});
	}

	debugBreakpointValid(path) {
		return this.debugGraph().then((graph) => {
			return graph.breakpointLocations(path);
		});
	}

	monitor(callback) {
		return new ECLWorkunitMonitor(this, callback);
	}
}

export class ECLWorkunitMonitor {
	workunit: ECLWorkunit;
	callback;
	disposeFlag = false;
	timeoutDuration = 0;
	timeoutCount = 0;
	timeoutHandle: NodeJS.Timer = null;

	constructor(workunit: ECLWorkunit, callback) {
		this.workunit = workunit;
		this.callback = callback;
		this.doMonitor();
	}

	dispose() {
		this.disposeFlag = true;
	}

	reset() {
		this.disposeFlag = false;
		this.timeoutDuration = 0;
		this.timeoutCount = 0;
	}

	refresh(thenDispose?: boolean): Promise<void> {
		clearTimeout(this.timeoutHandle);
		return Promise.all([
			this.workunit.query(),
			this.workunit.debugStatus()
		]).then(([wuStatusResponse, wuDebugResponse]) => {
			this.disposeFlag = thenDispose;
			this.callback(this.workunit.stateObj(), this.workunit.debugStateObj());
			if (!thenDispose) {
				this.doMonitor();
			}
		});
	}

	private doMonitor() {
		this.timeoutHandle = setTimeout(() => {
			if (this.disposeFlag) {
				this.reset();
				return;
			}

			this.refresh().then((response) => {
				if (this.disposeFlag || this.workunit.isComplete()) {
					this.reset();
					return;
				}
				this.incrementTimoutCount();
			});
		}, this.timeoutDuration);
	}

	private incrementTimoutCount() {
		switch (this.timeoutCount++) {
			case 1:
				this.timeoutDuration = 500;
				break;
			case 3:
				this.timeoutDuration = 1000;
				break;
			case 10:
				this.timeoutDuration = 3000;
				break;
			case 25:
				this.timeoutDuration = 5000;
				break;
		}
	}
}

export function createECLWorkunit(protocol: string, hostname: string, port: number, queryText: string, action: WUAction = WUAction.Run, resultLimits: number = 100, debug: boolean = false) {
	let wsWorkunits = new WsWorkunitsConnection(protocol, hostname, port);
	return createECLWorkunit2(wsWorkunits, queryText, action, resultLimits, debug);
}

export function createECLWorkunit2(connection:  WsWorkunitsConnection, queryText: string, action: WUAction = WUAction.Run, resultLimits: number = 100, debug: boolean = false) {
	return connection.wuCreateAndUpdate(queryText, resultLimits, debug).then((workunit) => {
		return new ECLWorkunit(connection, workunit.Wuid, action, debug);
	});
}

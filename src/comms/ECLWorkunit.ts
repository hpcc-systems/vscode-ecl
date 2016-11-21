import { WsWorkunitsConnection, WUAction } from './WsWorkunits';
import { createGraph, Graph } from './Graph';

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
		state: 'unknown'
	};

	_debugAllGraph: any;

	constructor(connection: WsWorkunitsConnection, wuid: string, submitAction: WUAction = WUAction.Run) {
		this.connection = connection;
		this.wuid = wuid;
		this.submitAction = submitAction;
		this.debugMode = false;
		if (submitAction === WUAction.Debug) {
			this.submitAction = WUAction.Run;
			this.debugMode = true;
		}
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
		return this._debugState.state;
	}

	debug(command, opts?): Promise<any> {
		if (!this.isDebugging()) {
			return Promise.resolve({});
		}
		return this.connection.WUCDebug(this.wuid, command, opts).catch((e) => {
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
			this._debugState = {
				sequence: this._debugState.sequence,
				state: this._debugState.state
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

	debugStep(mode): Promise<void> {
		return this.debug('step', {
			mode: mode
		});
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
		if (this._debugState._prevGraphSequenceNum === this._debugState.graphSequenceNum) {
			return Promise.resolve(this._debugAllGraph);
		}
		return this.debug('graph', { name: 'all' }).then((response: any) => {
			this._debugState._prevGraphSequenceNum = this._debugState.graphSequenceNum;
			this._debugAllGraph = createGraph(this.wuid, response.Query[0].Graph);
			return this._debugAllGraph;
		});
	}

	debugBreakpointValid(path) {
		return this.debugGraph().then((graph) => {
			return graph.breakpointLocations(path);
		});
	}

	debugPrint(edgeID: string, startRow: number = 0, numRows: number = 10) {
		return this.debug('print', {
			edgeID: edgeID,
			startRow: startRow,
			numRows: numRows
		}).then((response: any) => {
			if (response && response.Row) {
				return response.Row;
			}
			return [];
		});
	}

	monitor(callback): IWorkunitMonitor {
		return new ECLWorkunitMonitor(this, callback);
	}
}

export interface IWorkunitMonitor {
	refresh(): Promise<void>;
	refresh2(): Promise<void>;
	dispose(): void;
}

class ECLWorkunitMonitor implements IWorkunitMonitor {
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

	refresh() {
		return Promise.all([
			this.workunit.query(),
			this.workunit.debugStatus()
		]).then(() => {
			this.callback(this.workunit.stateObj(), this.workunit.debugStateObj());
		});
	}

	refresh2() {
		return Promise.all([
			this.workunit.query(),
			this.workunit.debugStatus()
		]).then(() => {
			this.callback(this.workunit.stateObj(), this.workunit.debugStateObj());
		});
	}

	private doMonitor() {
		this.timeoutHandle = setTimeout(() => {
			if (this.disposeFlag) {
				this.reset();
				return;
			}

			this.refresh().then(() => {
				if (this.disposeFlag || this.workunit.isComplete()) {
					this.reset();
					return;
				}
				this.incrementTimoutCount();
				this.doMonitor();
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

export function createECLWorkunit(protocol: string, hostname: string, port: number, queryText: string, action: WUAction = WUAction.Run, resultLimits: number = 100, user: string, pw: string) {
	let wsWorkunits = new WsWorkunitsConnection(protocol, hostname, port, user, pw);
	return createECLWorkunit2(wsWorkunits, queryText, action, resultLimits);
}

export function createECLWorkunit2(connection: WsWorkunitsConnection, queryText: string, action: WUAction = WUAction.Run, resultLimits: number = 100) {
	return connection.wuCreateAndUpdate(action, queryText, resultLimits).then((workunit) => {
		return new ECLWorkunit(connection, workunit.Wuid, action);
	});
}

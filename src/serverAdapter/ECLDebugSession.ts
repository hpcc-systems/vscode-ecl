import { DebugProtocol } from 'vscode-debugprotocol';
import {
	DebugSession, Breakpoint, Thread, StackFrame, Scope, Handles, Source,
	InitializedEvent, TerminatedEvent, StoppedEvent, OutputEvent
} from 'vscode-debugadapter';
import { locateClientTools, locateAllClientTools } from './clientTools';
import { createECLWorkunit, ECLWorkunit, ECLWorkunitMonitor, WUAction } from './esp/ECLWorkunit';
import os = require('os');

require('console-stamp')(console);

// This interface should always match the schema found in `package.json`.
export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	mode?: string;
	workspace: string;
	file: string;
	serverAddress?: string;
	port?: number;
	targetCluster: string;
	buildFlags?: string[];
	includeFolders?: string[];
}

// Note: Only turn this on when debugging the serverAdapter.
// See https://github.com/Microsoft/vscode-go/issues/206#issuecomment-194571950
const DEBUG = true;
function log(msg?: any, ...args) {
	if (DEBUG) {
		console.warn(msg, ...args);
	}
}
function logError(msg?: any, ...args) {
	if (DEBUG) {
		console.error(msg, ...args);
	}
}

export class ECLDebugSession extends DebugSession {
	workunit: ECLWorkunit;
	wuMonitor: ECLWorkunitMonitor;
	launchRequestArgs: LaunchRequestArguments;

	private prevMonitorMessage: string;

	//  Breakpoints  ---
	private _breakpointId = 1000;
	private _breakPoints = new Map<string, DebugProtocol.Breakpoint[]>();
	private _variableHandles = new Handles<string>();

	private _prevDebugSequence: string;

	public constructor() {
		super();
		locateAllClientTools();
	}

	protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
		log('InitializeRequest');

		response.body.supportsConditionalBreakpoints = false;
		response.body.supportsHitConditionalBreakpoints = false;
		response.body.supportsFunctionBreakpoints = false;
		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsEvaluateForHovers = false;
		response.body.supportsStepBack = false;
		response.body.supportsSetVariable = false;
		response.body.supportsRestartFrame = false;
		response.body.supportsStepInTargetsRequest = false;
		response.body.supportsGotoTargetsRequest = false;
		response.body.supportsCompletionsRequest = false;

		this.sendResponse(response);
		log('InitializeResponse');
	}

	protected launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): void {
		log('launchRequest:  ' + JSON.stringify(args));
		this.launchRequestArgs = args;

		this.sendEvent(new OutputEvent('Locating Client Tools.' + os.EOL));
		locateClientTools('', this.launchRequestArgs.workspace, this.launchRequestArgs.includeFolders).then(clientTools => {
			this.sendEvent(new OutputEvent('Generating archive.' + os.EOL));
			return clientTools.createArchive(this.launchRequestArgs.file);
		}).then((archive) => {
			this.sendEvent(new OutputEvent('Creating workuinit.' + os.EOL));
			return createECLWorkunit('http:', this.launchRequestArgs.serverAddress, this.launchRequestArgs.port, archive, WUAction.Run, 100, !args.noDebug);
		}).then(workunit => {
			this.workunit = workunit;
			this.sendEvent(new OutputEvent('Submitting workuinit:  ' + workunit.wuid + os.EOL));
			return workunit.submit(this.launchRequestArgs.targetCluster);
		}).then(() => {
			this.sendEvent(new OutputEvent('Submitted:  http://' + this.launchRequestArgs.serverAddress + ':' + this.launchRequestArgs.port + '/?Widget=WUDetailsWidget&Wuid=' + this.workunit.wuid + os.EOL));
			console.log('Submitted:  [xxx](http://' + this.launchRequestArgs.serverAddress + ':' + this.launchRequestArgs.port + '/?Widget=WUDetailsWidget&Wuid=' + this.workunit.wuid + ')' + os.EOL);
		}).then(() => {
			this.sendEvent(new InitializedEvent());
			log('InitializeEvent');
		}).catch((e) => {
			this.sendEvent(new OutputEvent(`Launch failed - ${e}${os.EOL}`));
			this.sendEvent(new TerminatedEvent());
			log('InitializeEvent');
		});

		this.sendResponse(response);
		log('launchResponse');
	}

	protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments): void {
		log('DisconnectRequest');
		this.workunit.debugQuit().then(() => {
			return this.workunit.abort();
		}).then(() => {
			return this.wuMonitor.refresh(true);
		}).then(() => {
			throw ('done');
		}).catch((e) => {
			delete this.wuMonitor;
			this.sendEvent(new OutputEvent(`Monitoring end:  ${this.workunit.wuid}${os.EOL}`));
			delete this.workunit;
			log('DisconnectResponse');
			super.disconnectRequest(response, args);
		});
	}

	protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
		log('ConfigurationDoneRequest');
		this.sendEvent(new OutputEvent(`Monitoring:  ${this.workunit.wuid}.` + os.EOL));
		this.wuMonitor = this.workunit.monitor((state, debugState) => {
			let debugMsg = this.workunit.isDebugging() ? `(${debugState.sequence}) - ${debugState.state}` : '';
			let monitorMsg = `${this.workunit.wuid}:  ${this.workunit.state()}${debugMsg}${os.EOL}`;
			if (this.prevMonitorMessage !== monitorMsg) {
				this.prevMonitorMessage = monitorMsg;
				this.sendEvent(new OutputEvent(monitorMsg));
			}
			if (this.workunit.isComplete()) {
				this.sendEvent(new TerminatedEvent());
				log('TerminatedEvent');
			}
			if (this._prevDebugSequence !== debugState.sequence) {
				this._prevDebugSequence = debugState.sequence;
				switch (debugState.state) {
					case 'created':
					case 'finished':
					case 'graph start':
					case 'graph end':
					case 'edge':
						log('StoppedEvent');
						this.sendEvent(new StoppedEvent(debugState.state, 0));
						break;
					case 'debug_running':
						break;
					default:
				}
			}
			log(`Debugging: ${debugState.state}` + os.EOL + JSON.stringify(debugState) + os.EOL);
		});
		this.sendResponse(response);
		log('ConfigurationDoneResponse');
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
		log('SetBreakPointsRequest');
		if (this.workunit.debugMode) {
			const path = args.source.path;
			this.workunit.debugDeleteAllBreakpoints().then(() => {
				return this.workunit.debugBreakpointValid(path);
			}).then((validBPLocations: any) => {
				// verify breakpoint locations
				let clientLines = args.lines;
				let breakpoints = new Array<Breakpoint>();
				for (let i = 0; i < clientLines.length; ++i) {
					let clientLine = clientLines[i];
					for (let i = 0; i < validBPLocations.length; ++i) {
						let validBPLine = validBPLocations[i];
						if (validBPLine.line >= clientLine) {
							const bp = <DebugProtocol.Breakpoint>new Breakpoint(true, validBPLine.line);
							bp.id = this._breakpointId++;
							breakpoints.push(bp);
							this.workunit.debugBreakpointAdd(validBPLine.id + '_0', 'edge', 'break');
							break;
						}
					}
				}
				this._breakPoints.set(path, breakpoints);

				// send back the actual breakpoint positions
				response.body = {
					breakpoints: breakpoints
				};
				this.sendResponse(response);
				log('SetBreakPointsRequest');
			});
		} else {
			this.sendResponse(response);
			log('SetBreakPointsRequest');
		}

	}

	protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
		log('ThreadsRequest');
		let threads = [];
		threads.push(new Thread(0, 'main'));

		response.body = {
			threads: threads
		};
		this.sendResponse(response);
	}

	protected pushStackFrame(stackFrames: StackFrame[], id: string, def?: any): void {
		if (def) {
			stackFrames.push(new StackFrame(stackFrames.length, id, new Source('builder', def.file), def.line, def.col));
		} else {
			stackFrames.push(new StackFrame(stackFrames.length, id));
		}
	}

	protected createStackTrace(graph, type: string, id: string, debugState, stackFrames: StackFrame[]): void {
		switch (type) {
			case 'edge':
				let edge = graph.allEdges.get(id);
				this.pushStackFrame(stackFrames, id, edge.getNearestDefinition());
				this.createStackTrace(graph, 'vertex', edge.sourceID, debugState, stackFrames);
				break;
			case 'vertex':
				let vertex = graph.allVertices.get(id);
				this.pushStackFrame(stackFrames, id, vertex.getNearestDefinition());
				if (vertex.parent) {
					this.createStackTrace(graph, 'subgraph', vertex.parent.id, debugState, stackFrames);
				} else {
					this.createStackTrace(graph, 'workunit', this.workunit.wuid, debugState, stackFrames);
				}
				break;
			case 'subgraph':
				let subgraph = graph.allSubgraphs.get(id);
				if (subgraph) {
					this.pushStackFrame(stackFrames, id, subgraph.getNearestDefinition(debugState.state === 'graph end' || debugState.state === 'finished'));
					if (subgraph.parent) {
						this.createStackTrace(graph, 'subgraph', subgraph.parent.id, debugState, stackFrames);
					} else {
						this.createStackTrace(graph, 'workunit', this.workunit.wuid, debugState, stackFrames);
					}
				} else {
					this.createStackTrace(graph, 'workunit', this.workunit.wuid, debugState, stackFrames);
				}
				break;
			case 'workunit':
				stackFrames.push(new StackFrame(stackFrames.length, id, new Source('builder', this.launchRequestArgs.file), debugState.state === 'finished' ? Number.MAX_SAFE_INTEGER : 0));
				break;
		}
	}

	protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void {
		log('StackTraceRequest');
		let stackFrames: StackFrame[] = [];
		if (this.workunit.isDebugging()) {
			this.workunit.debugGraph().then((graph) => {
				const debugState = this.workunit.debugStateObj();
				if (debugState.edgeId) {
					this.createStackTrace(graph, 'edge', debugState.edgeId, debugState, stackFrames);
				} else if (debugState.nodeId) {
					this.createStackTrace(graph, 'vertex', debugState.nodeId, debugState, stackFrames);
				} else if (debugState.graphId) {
					this.createStackTrace(graph, 'subgraph', debugState.graphId, debugState, stackFrames);
				} else {
					this.createStackTrace(graph, 'workunit', this.workunit.wuid, debugState, stackFrames);
				}
				response.body = {
					stackFrames: stackFrames
				};
				this.sendResponse(response);
			});
		}
	}

	protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
		log('ScopesRequest');
		const frameReference = args.frameId;
		let scopes: Scope[] = [];
		switch (frameReference) {
			case 0:
				scopes.push(new Scope('Workunit', this._variableHandles.create('workunit_' + frameReference), false));
				scopes.push(new Scope('Server breakpoints', this._variableHandles.create('server_bp_' + frameReference), true));
				break;
		}
		response.body = {
			scopes: scopes
		};
		this.sendResponse(response);
		log('ScopesResponse');
	}

	protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
		log('VariablesRequest');
		let id = this._variableHandles.get(args.variablesReference);
		switch (id) {
			case 'workunit_0':
				let variables = [];
				let state = this.workunit.stateObj();
				for (let key in state) {
					variables.push({
						name: key,
						type: typeof state[key],
						value: '' + state[key],
						variablesReference: 0
					});
				}
				response.body = {
					variables: variables
				};
				this.sendResponse(response);
				log('VariablesResponse');
				return;
			case 'server_bp_0':
				this.workunit.debugBreakpointList().then((breakpoints) => {
					let variables = breakpoints.map((breakpoint) => {
						return {
							name: breakpoint.action + '_' + breakpoint.idx,
							type: breakpoint.mode,
							value: breakpoint.id,
							variablesReference: 0
						};
					});
					response.body = {
						variables: variables
					};
					this.sendResponse(response);
					log('VariablesResponse');
				});
				return;
			default:
				this.sendResponse(response);
				log('VariablesResponse');
		}
	}

	protected continueRequest(response: DebugProtocol.ContinueResponse): void {
		log('ContinueRequest');
		this.workunit.debugContinue().then(debugResponse => {
			this.wuMonitor.refresh();
		});
		this.sendResponse(response);
		log('ContinueResponse');
	}

	protected nextRequest(response: DebugProtocol.NextResponse): void {
		log('NextRequest');
		const debugState = this.workunit.debugStateObj();
		if (debugState.edgeId) {
			this.workunit.debugStep('edge').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else if (debugState.nodeId) {
			this.workunit.debugStep('node').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else if (debugState.graphId) {
			this.workunit.debugStep('graph').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else {
			this.workunit.debugContinue().then(debugResponse => {
				this.wuMonitor.refresh();
			});
		}
		this.sendResponse(response);
		log('NextResponse');
	}

	protected stepInRequest(response: DebugProtocol.StepInResponse): void {
		log('StepInRequest');
		const debugState = this.workunit.debugStateObj();
		if (debugState.edgeId) {
			this.workunit.debugStep('edge').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else if (debugState.nodeId) {
			this.workunit.debugStep('edge').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else if (debugState.graphId) {
			this.workunit.debugStep('edge').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else {
			this.workunit.debugStep('graph').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		}
		this.sendResponse(response);
		log('StepInResponse');
	}

	protected stepOutRequest(response: DebugProtocol.StepOutResponse): void {
		log('StepOutRequest');
		const debugState = this.workunit.debugStateObj();
		if (debugState.edgeId) {
			this.workunit.debugStep('graph').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else if (debugState.nodeId) {
			this.workunit.debugStep('graph').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else if (debugState.graphId) {
			this.workunit.debugStep('graph').then(debugResponse => {
				this.wuMonitor.refresh();
			});
		} else {
			this.workunit.debugContinue().then(debugResponse => {
				this.wuMonitor.refresh();
			});
		}
		this.sendResponse(response);
		log('StepOutResponse');
	}

	protected pauseRequest(response: DebugProtocol.PauseResponse): void {
		log('PauseRequest');
		this.workunit.debugPause().then(debugResponse => {
			this.wuMonitor.refresh();
		});
		this.sendEvent(new StoppedEvent('user paused', 0));
		this.sendResponse(response);
		log('PauseResponse');
	}

	protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
		log('EvaluateRequest');
		this.sendResponse(response);
	}
}

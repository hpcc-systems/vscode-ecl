import {
    Breakpoint, ContinuedEvent, DebugSession, Handles, InitializedEvent, OutputEvent, Scope, Source,
    StackFrame, StoppedEvent, TerminatedEvent, Thread, ThreadEvent, Variable
} from "vscode-debugadapter";
import { DebugProtocol } from "vscode-debugprotocol";
import { GraphItem, IEventListenerHandle, Workunit, WUAction, XGMMLGraph } from "../../hpcc-platform-comms/src/index";
import { locateAllClientTools, locateClientTools } from "../files/clientTools";
import os = require("os");

require('console-stamp')(console);


// This interface should always match the schema found in `package.json`.
export type LaunchMode = "submit" | "compile" | "debug";
export type LaunchProtocol = "http" | "https";
export type LaunchLegacyMode = "true" | "false";
export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    mode: LaunchMode;
    program: string;
    workspace: string;
    protocol: LaunchProtocol;
    serverAddress: string;
    port: number;
    rejectUnauthorized: boolean;
    targetCluster: string;
    eclccArgs: string[];
    includeFolders: string;
    legacyMode: LaunchLegacyMode;
    resultLimit: number;
    user: string;
    password: string;
}

export interface LaunchRequestArgumentsEx extends DebugProtocol.LaunchRequestArguments {
    mode: WUAction;
    program: string;
    workspace: string;
    protocol: LaunchProtocol;
    serverAddress: string;
    port: number;
    rejectUnauthorized: boolean;
    targetCluster: string;
    eclccArgs: string[];
    includeFolders: string[];
    legacyMode: boolean;
    resultLimit: number;
    user: string;
    password: string;
}

// Note: Only turn this on when debugging the serverAdapter.
// See https://github.com/Microsoft/vscode-go/issues/206#issuecomment-194571950
const DEBUG = true;
function log(msg?: any, ...args) {
    if (DEBUG) {
        console.warn(msg, ...args);
    }
}
/*
function logError(msg?: any, ...args) {
	if (DEBUG) {
		console.error(msg, ...args);
	}
}
*/

class WUStack {
    graphItem: GraphItem;

    constructor(graphItem: GraphItem) {
        this.graphItem = graphItem;
    }
}

class WUScope {
    stack: WUStack;
    type: string;

    constructor(stack: WUStack, type: string) {
        this.stack = stack;
        this.type = type;
    }
}

export class ECLDebugSession extends DebugSession {
    workunit: Workunit;
    watchHandle: IEventListenerHandle;
    launchRequestArgs: LaunchRequestArgumentsEx;

    private prevMonitorMessage: string;

    //  Breakpoints  ---
    private _breakpointId = 1000;
    private _breakPoints = new Map<string, DebugProtocol.Breakpoint[]>();
    private _stackFrameHandles = new Handles<WUStack>();
    private _variableHandles = new Handles<WUScope>();

    private _prevDebugSequence: string;

    public constructor() {
        super();
        locateAllClientTools();
    }

    protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
        log("InitializeRequest");
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
        response.body.supportsConfigurationDoneRequest = true;

        this.sendResponse(response);
        log("InitializeResponse");
    }

    protected launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): void {
        log("launchRequest:  " + JSON.stringify(args));
        let _action: WUAction;
        switch (args.mode) {
            case "compile":
                _action = WUAction.Compile;
                break;
            case "debug":
                _action = WUAction.Debug;
                break;
            case "submit":
            default:
                _action = WUAction.Run;
                break;
        }
        this.launchRequestArgs = {
            mode: _action,
            program: args.program,
            workspace: args.workspace,
            protocol: args.protocol || "http",
            serverAddress: args.serverAddress,
            port: args.port,
            rejectUnauthorized: args.rejectUnauthorized || false,
            targetCluster: args.targetCluster,
            eclccArgs: args.eclccArgs ? args.eclccArgs : [],
            includeFolders: args.includeFolders ? args.includeFolders.split(",") : [],
            legacyMode: args.legacyMode === "true" ? true : false,
            resultLimit: args.resultLimit || 100,
            user: args.user || "",
            password: args.password || ""
        };
        this.sendEvent(new OutputEvent("Locating Client Tools." + os.EOL));
        locateClientTools("", this.launchRequestArgs.workspace, this.launchRequestArgs.includeFolders, this.launchRequestArgs.legacyMode).then((clientTools) => {
            this.sendEvent(new OutputEvent("Generating archive." + os.EOL));
            return clientTools.createArchive(this.launchRequestArgs.program);
        }).then((archive) => {
            this.sendEvent(new OutputEvent("Creating workunit." + os.EOL));
            return Workunit.create(`${this.launchRequestArgs.protocol}://${this.launchRequestArgs.serverAddress}:${this.launchRequestArgs.port}`, {
                userID: this.launchRequestArgs.user,
                userPW: this.launchRequestArgs.password,
                rejectUnauthorized: this.launchRequestArgs.rejectUnauthorized
            }).then((wu) => {
                return wu.update({ QueryText: archive });
            });
        }).then((workunit) => {
            this.workunit = workunit;
            this.sendEvent(new OutputEvent("Submitting workunit:  " + workunit.Wuid + os.EOL));
            return workunit.submit(this.launchRequestArgs.targetCluster, this.launchRequestArgs.mode, this.launchRequestArgs.resultLimit);
        }).then(() => {
            this.sendEvent(new OutputEvent("Submitted:  " + this.launchRequestArgs.protocol + "://" + this.launchRequestArgs.serverAddress + ":" + this.launchRequestArgs.port + "/?Widget=WUDetailsWidget&Wuid=" + this.workunit.Wuid + os.EOL));
            console.log("Submitted:  [xxx](" + this.launchRequestArgs.protocol + "://" + this.launchRequestArgs.serverAddress + ":" + this.launchRequestArgs.port + "/?Widget=WUDetailsWidget&Wuid=" + this.workunit.Wuid + ")" + os.EOL);
        }).then(() => {
            this.workunit.watchUntilRunning().then(() => {
                this.sendEvent(new InitializedEvent());
                log("InitializeEvent");
                this.sendEvent(new ThreadEvent("main", 0));
                log("ThreadEvent");
            });
        }).catch((e) => {
            this.sendEvent(new OutputEvent(`Launch failed - ${e}${os.EOL}`));
            this.sendEvent(new TerminatedEvent());
            log("InitializeEvent");
        });

        this.sendResponse(response);
        log("launchResponse");
    }

    private disconnectWorkunit() {
        if (this.workunit.isComplete()) {
            return Promise.resolve();
        }
        return this.workunit.debugQuit().then(() => {
            return this.workunit.abort();
        }).then(() => {
            return this.workunit.refresh();
        }).catch((e) => {
            console.log(`Error disconnecting workunit`);
        });
    }

    protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments): void {
        log("DisconnectRequest");
        this.disconnectWorkunit().then(() => {
            if (this.watchHandle) {
                this.watchHandle.release();
                delete this.watchHandle;
            }
            this.sendEvent(new OutputEvent(`Monitoring end:  ${this.workunit.Wuid}${os.EOL}`));
            delete this.workunit;
            log("DisconnectResponse");
            super.disconnectRequest(response, args);
        });
    }

    protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
        log("ConfigurationDoneRequest");
        this.sendEvent(new OutputEvent(`Monitoring:  ${this.workunit.Wuid}.${os.EOL}`));
        this.watchHandle = this.workunit.watch((changes) => {
            const debugState: any = this.workunit.DebugState;
            let id = debugState.edgeId || debugState.nodeId || debugState.graphId;
            id = id ? `(${id})` : "";
            const debugMsg = this.workunit.isDebugging() ? `(${debugState.sequence}) - ${debugState.state}${id}` : "";
            const monitorMsg = `${this.workunit.Wuid}:  ${this.workunit.State}${debugMsg}${os.EOL}`;
            if (this.prevMonitorMessage !== monitorMsg) {
                this.prevMonitorMessage = monitorMsg;
                this.sendEvent(new OutputEvent(monitorMsg));
            }
            if (this.workunit.isComplete()) {
                this.sendEvent(new TerminatedEvent());
                log("TerminatedEvent");
            }
            if (this._prevDebugSequence !== debugState.sequence) {
                this._prevDebugSequence = debugState.sequence;
                switch (debugState.state) {
                    case "created":
                    case "finished":
                    case "graph start":
                    case "graph end":
                    case "edge":
                    case "node":
                    case "exception":
                        log("StoppedEvent");
                        this.sendEvent(new StoppedEvent(debugState.state, 0));
                        break;
                    case "debug_running":
                        break;
                    default:
                }
            }
            log(`Debugging: ${debugState.state} - ${JSON.stringify(debugState)}${os.EOL}`);
        }, true);
        this.sendResponse(response);
        log("ConfigurationDoneResponse");
    }

    protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
        log("SetBreakPointsRequest");
        if (this.workunit.isDebugging()) {
            const path = args.source.path;
            this.workunit.debugDeleteAllBreakpoints().then(() => {
                return this.workunit.debugBreakpointValid(path);
            }).then((validBPLocations: any) => {
                // verify breakpoint locations
                const clientLines = args.lines;
                const breakpoints = new Array<Breakpoint>();
                for (const clientLine of clientLines) {
                    for (const validBPLine of validBPLocations) {
                        if (validBPLine.line >= clientLine) {
                            const bp = <DebugProtocol.Breakpoint>new Breakpoint(true, validBPLine.line);
                            bp.id = this._breakpointId++;
                            breakpoints.push(bp);
                            this.workunit.debugBreakpointAdd(validBPLine.id + "_0", "edge", "break");
                            break;
                        }
                    }
                }
                this._breakPoints.set(path, breakpoints);

                // send back the actual breakpoint positions
                response.body = {
                    breakpoints
                };
                this.sendResponse(response);
                log("SetBreakPointsRequest");
            });
        } else {
            this.sendResponse(response);
            log("SetBreakPointsRequest");
        }

    }

    protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
        log("ThreadsRequest");
        const threads = [];
        threads.push(new Thread(0, "main"));
        response.body = {
            threads
        };
        this.sendResponse(response);
    }

    protected pushStackFrame(stackFrames: StackFrame[], graphItem: GraphItem, def?: any): void {
        const id: number = this._stackFrameHandles.create(new WUStack(graphItem));
        if (def) {
            stackFrames.push(new StackFrame(id, graphItem.id, new Source("builder", def.file), def.line, def.col));
        } else {
            stackFrames.push(new StackFrame(id, graphItem.id));
        }
    }

    protected createStackTrace(graph: XGMMLGraph, type: string, id: string, debugState, stackFrames: StackFrame[]): void {
        switch (type) {
            case "edge":
                const edge = graph.allEdges[id];
                this.pushStackFrame(stackFrames, edge, edge.getNearestDefinition());
                this.createStackTrace(graph, "vertex", edge.sourceID, debugState, stackFrames);
                break;
            case "vertex":
                const vertex = graph.allVertices[id];
                this.pushStackFrame(stackFrames, vertex, vertex.getNearestDefinition());
                if (vertex.parent) {
                    this.createStackTrace(graph, "subgraph", vertex.parent.id, debugState, stackFrames);
                } else {
                    this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                }
                break;
            case "subgraph":
                const subgraph = graph.allSubgraphs[id];
                if (subgraph) {
                    this.pushStackFrame(stackFrames, subgraph, subgraph.getNearestDefinition(debugState.state === "graph end" || debugState.state === "finished"));
                    if (subgraph.parent) {
                        this.createStackTrace(graph, "subgraph", subgraph.parent.id, debugState, stackFrames);
                    } else {
                        this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                    }
                } else {
                    this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                }
                break;
            case "workunit":
                this.pushStackFrame(stackFrames, graph, { file: this.launchRequestArgs.program, col: debugState.state === "finished" ? Number.MAX_SAFE_INTEGER : 0 });
                break;
            default:
        }
    }

    protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void {
        log("StackTraceRequest");
        const stackFrames: StackFrame[] = [];
        if (this.workunit.isDebugging()) {
            this.workunit.debugGraph().then((graph) => {
                const debugState: any = this.workunit.DebugState;
                if (debugState.edgeId) {
                    this.createStackTrace(graph, "edge", debugState.edgeId, debugState, stackFrames);
                } else if (debugState.nodeId) {
                    this.createStackTrace(graph, "vertex", debugState.nodeId, debugState, stackFrames);
                } else if (debugState.graphId) {
                    this.createStackTrace(graph, "subgraph", debugState.graphId, debugState, stackFrames);
                } else {
                    this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                }
                log("StackTraceResponse");
                response.body = {
                    stackFrames
                };
                this.sendResponse(response);
            }).catch((e) => {
                log("StackTraceResponse");
                response.body = {
                    stackFrames
                };
                this.sendResponse(response);
            });
        } else {
            log("StackTraceResponse");
            response.body = {
                stackFrames
            };
            this.sendResponse(response);
        }
    }

    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
        log("ScopesRequest");
        const stackFrameScope: WUStack = this._stackFrameHandles.get(args.frameId);

        const scopes: Scope[] = [];
        switch (stackFrameScope.graphItem.className()) {
            case "Edge":
                scopes.push(new Scope("Results", this._variableHandles.create(new WUScope(stackFrameScope, "results")), false));
                scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "local")), false));
                break;
            case "Vertex":
                scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "local")), false));
                scopes.push(new Scope("Out Edges", this._variableHandles.create(new WUScope(stackFrameScope, "outedges")), false));
                break;
            case "Subgraph":
                scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "local")), false));
                scopes.push(new Scope("Subgraphs", this._variableHandles.create(new WUScope(stackFrameScope, "subgraphs")), false));
                scopes.push(new Scope("Vertices", this._variableHandles.create(new WUScope(stackFrameScope, "vertices")), false));
                break;
            case "XGMMLGraph":
                scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "workunit")), false));
                scopes.push(new Scope("Graphs", this._variableHandles.create(new WUScope(stackFrameScope, "subgraphs")), false));
                scopes.push(new Scope("Debug", this._variableHandles.create(new WUScope(stackFrameScope, "breakpoints")), true));
                break;
            default:
        }
        response.body = {
            scopes
        };
        this.sendResponse(response);
        log("ScopesResponse");
    }

    protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
        log("VariablesRequest");
        const wuScope = this._variableHandles.get(args.variablesReference);
        let variables = [];
        switch (wuScope.type) {
            case "local":
                for (const key in wuScope.stack.graphItem.attrs) {
                    if (wuScope.stack.graphItem.attrs.hasOwnProperty(key)) {
                        variables.push(new Variable(key, "" + wuScope.stack.graphItem.attrs[key]));
                    }
                }
                break;
            case "workunit":
                const state = this.workunit.properties;
                for (const key in state) {
                    if (state.hasOwnProperty(key)) {
                        variables.push(new Variable(key, "" + state[key]));
                    }
                }
                break;
            case "breakpoints":
                this.workunit.debugBreakpointList().then((breakpoints) => {
                    variables = breakpoints.map((breakpoint) => {
                        return new Variable(breakpoint.action + "_" + breakpoint.idx, "" + breakpoint.id);
                    });
                    response.body = {
                        variables
                    };
                    this.sendResponse(response);
                });
                return;
            case "results":
                this.workunit.debugPrint(wuScope.stack.graphItem.id, 0, 10).then((results) => {
                    variables = results.map((result, idx) => {
                        const summary = [];
                        const values: any = {};
                        for (const key in result) {
                            if (result.hasOwnProperty(key)) {
                                values[key] = result[key];
                                summary.push(result[key]);
                            }
                        }
                        return new Variable("Row_" + idx, JSON.stringify(summary), this._variableHandles.create(new WUScope(new WUStack(values), "rows")));
                    });
                    response.body = {
                        variables
                    };
                    this.sendResponse(response);
                });
                return;
            case "rows":
                for (const key in wuScope.stack.graphItem) {
                    if (wuScope.stack.graphItem.hasOwnProperty(key)) {
                        variables.push(new Variable(key, "" + wuScope.stack.graphItem[key]));
                    }
                }
                break;
            default:
        }
        response.body = {
            variables
        };
        this.sendResponse(response);
        log("VariablesResponse");
    }

    protected continueRequest(response: DebugProtocol.ContinueResponse): void {
        log("ContinueRequest");
        this.workunit.debugContinue().then((debugResponse) => {
            log("debugContinue.then");
            this.workunit.refresh();
        });
        this.sendEvent(new ContinuedEvent(0));
        this.sendResponse(response);
        log("ContinueResponse");
    }

    protected nextRequest(response: DebugProtocol.NextResponse): void {
        log("NextRequest");
        const debugState: any = this.workunit.DebugState;
        if (debugState.edgeId) {
            this.workunit.debugStep("edge").then(() => {
                this.workunit.refresh();
            });
        } else if (debugState.nodeId) {
            this.workunit.debugStep("edge").then(() => {
                this.workunit.refresh();
            });
        } else if (debugState.graphId) {
            this.workunit.debugStep("graph").then(() => {
                this.workunit.refresh();
            });
        } else {
            this.workunit.debugContinue().then(() => {
                this.workunit.refresh();
            });
        }
        this.sendResponse(response);
        log("NextResponse");
    }

    protected stepInRequest(response: DebugProtocol.StepInResponse): void {
        log("StepInRequest");
        const debugState: any = this.workunit.DebugState;
        if (debugState.edgeId) {
            this.workunit.debugStep("edge").then(() => {
                this.workunit.refresh();
            });
        } else if (debugState.nodeId) {
            this.workunit.debugStep("edge").then(() => {
                this.workunit.refresh();
            });
        } else if (debugState.graphId) {
            this.workunit.debugStep("edge").then(() => {
                this.workunit.refresh();
            });
        } else {
            this.workunit.debugStep("graph").then(() => {
                this.workunit.refresh();
            });
        }
        this.sendResponse(response);
        log("StepInResponse");
    }

    protected stepOutRequest(response: DebugProtocol.StepOutResponse): void {
        log("StepOutRequest");
        const debugState: any = this.workunit.DebugState;
        if (debugState.edgeId) {
            this.workunit.debugStep("graph").then(() => {
                this.workunit.refresh();
            });
        } else if (debugState.nodeId) {
            this.workunit.debugStep("graph").then(() => {
                this.workunit.refresh();
            });
        } else if (debugState.graphId) {
            this.workunit.debugStep("graph").then(() => {
                this.workunit.refresh();
            });
        } else {
            this.workunit.debugContinue().then(() => {
                this.workunit.refresh();
            });
        }
        this.sendResponse(response);
        log("StepOutResponse");
    }

    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): void {
        log("PauseRequest");
        this._prevDebugSequence = "pauseRequest";
        this.workunit.debugPause().then((debugResponse) => {
            this.workunit.refresh();
        });
        this.sendResponse(response);
        log("PauseResponse");
    }

    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        log("EvaluateRequest");
        this.sendResponse(response);
    }
}

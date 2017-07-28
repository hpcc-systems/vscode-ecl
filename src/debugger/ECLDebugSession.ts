import { locateAllClientTools, locateClientTools, Workunit, WUUpdate } from "@hpcc-js/comms";
import { Graph, IGraphItem, IObserverHandle, Level, scopedLogger } from "@hpcc-js/util";
import {
    Breakpoint, ContinuedEvent, DebugSession, Handles, InitializedEvent, OutputEvent, Scope, Source,
    StackFrame, StoppedEvent, TerminatedEvent, Thread, ThreadEvent, Variable
} from "vscode-debugadapter";
import { DebugProtocol } from "vscode-debugprotocol";
import os = require("os");
import path = require("path");

const logger = scopedLogger("debugger/ECLDEbugSession.ts");
logger.pushLevel(Level.debug);

// tslint:disable-next-line:no-var-requires
require("console-stamp")(console);

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
    eclccPath: string;
    eclccArgs: string[];
    includeFolders: string;
    legacyMode: LaunchLegacyMode;
    resultLimit: number;
    user: string;
    password: string;
}

export interface LaunchRequestArgumentsEx extends DebugProtocol.LaunchRequestArguments {
    mode: WUUpdate.Action;
    program: string;
    workspace: string;
    protocol: LaunchProtocol;
    serverAddress: string;
    port: number;
    rejectUnauthorized: boolean;
    targetCluster: string;
    eclccPath: string;
    eclccArgs: string[];
    includeFolders: string[];
    legacyMode: boolean;
    resultLimit: number;
    user: string;
    password: string;
}

class WUStack {
    graphItem: IGraphItem;

    constructor(graphItem: IGraphItem) {
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
    watchHandle: IObserverHandle;
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
        logger.debug("InitializeRequest");
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
        logger.debug("InitializeResponse");
    }

    protected launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): void {
        logger.debug("launchRequest:  " + JSON.stringify(args));
        let _action: WUUpdate.Action;
        switch (args.mode) {
            case "compile":
                _action = WUUpdate.Action.Compile;
                break;
            case "debug":
                _action = WUUpdate.Action.Debug;
                break;
            case "submit":
            default:
                _action = WUUpdate.Action.Run;
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
            eclccPath: args.eclccPath ? args.eclccPath : "",
            eclccArgs: args.eclccArgs ? args.eclccArgs : [],
            includeFolders: args.includeFolders ? args.includeFolders.split(",") : [],
            legacyMode: args.legacyMode === "true" ? true : false,
            resultLimit: args.resultLimit || 100,
            user: args.user || "",
            password: args.password || ""
        };
        this.sendEvent(new OutputEvent("Locating Client Tools." + os.EOL));
        locateClientTools(this.launchRequestArgs.eclccPath, this.launchRequestArgs.workspace, this.launchRequestArgs.includeFolders, this.launchRequestArgs.legacyMode).then((clientTools) => {
            this.sendEvent(new OutputEvent("Client Tools:  " + clientTools.eclccPath + os.EOL));
            this.sendEvent(new OutputEvent("Generating archive." + os.EOL));
            return clientTools.createArchive(this.launchRequestArgs.program);
        }).then((archive) => {
            this.sendEvent(new OutputEvent("Creating workunit." + os.EOL));
            return Workunit.create({
                baseUrl: `${this.launchRequestArgs.protocol}://${this.launchRequestArgs.serverAddress}:${this.launchRequestArgs.port}`,
                userID: this.launchRequestArgs.user,
                password: this.launchRequestArgs.password,
                rejectUnauthorized: this.launchRequestArgs.rejectUnauthorized
            }).then((wu) => {
                const pathParts = path.parse(this.launchRequestArgs.program);
                return wu.update({
                    Jobname: pathParts.name,
                    QueryText: archive.content
                });
            });
        }).then((workunit) => {
            this.workunit = workunit;
            this.sendEvent(new OutputEvent("Submitting workunit:  " + workunit.Wuid + os.EOL));
            return workunit.submit(this.launchRequestArgs.targetCluster, this.launchRequestArgs.mode, this.launchRequestArgs.resultLimit);
        }).then(() => {
            this.sendEvent(new OutputEvent("Submitted:  " + this.launchRequestArgs.protocol + "://" + this.launchRequestArgs.serverAddress + ":" + this.launchRequestArgs.port + "/?Widget=WUDetailsWidget&Wuid=" + this.workunit.Wuid + os.EOL));
        }).then(() => {
            this.workunit.watchUntilRunning().then(() => {
                this.sendEvent(new InitializedEvent());
                logger.debug("InitializeEvent");
                this.sendEvent(new ThreadEvent("main", 0));
                logger.debug("ThreadEvent");
            });
        }).catch((e) => {
            this.sendEvent(new OutputEvent(`Launch failed - ${e}${os.EOL}`));
            this.sendEvent(new TerminatedEvent());
            logger.debug("InitializeEvent");
        });

        this.sendResponse(response);
        logger.debug("launchResponse");
    }

    private disconnectWorkunit() {
        if (this.workunit.isComplete() || !this.workunit.isDebugging()) {
            return Promise.resolve();
        }
        this.sendEvent(new OutputEvent(`Aborting debug session:  ${this.workunit.Wuid}${os.EOL}`));
        return this.workunit.debugQuit().then(() => {
            return this.workunit.abort();
        }).then(() => {
            return this.workunit.refresh();
        }).catch((e) => {
            logger.error("Error disconnecting workunit");
        });
    }

    protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments): void {
        logger.debug("DisconnectRequest");
        this.disconnectWorkunit().then(() => {
            if (this.watchHandle) {
                this.watchHandle.release();
                delete this.watchHandle;
            }
            this.sendEvent(new OutputEvent(`Monitoring end:  ${this.workunit.Wuid}${os.EOL}`));
            delete this.workunit;
            logger.debug("DisconnectResponse");
            super.disconnectRequest(response, args);
        });
    }

    protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
        logger.debug("ConfigurationDoneRequest");
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
                logger.debug("TerminatedEvent");
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
                        logger.debug("StoppedEvent");
                        this.sendEvent(new StoppedEvent(debugState.state, 0));
                        break;
                    case "debug_running":
                        break;
                    default:
                }
            }
            logger.debug(`Debugging: ${debugState.state} - ${JSON.stringify(debugState)}${os.EOL}`);
        }, true);
        this.sendResponse(response);
        logger.debug("ConfigurationDoneResponse");
    }

    protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
        logger.debug("SetBreakPointsRequest");
        if (this.workunit.isDebugging()) {
            const sourcePath = args.source.path;
            this.workunit.debugDeleteAllBreakpoints().then(() => {
                return this.workunit.debugBreakpointValid(sourcePath);
            }).then((validBPLocations: any) => {
                // verify breakpoint locations
                const clientLines = args.lines;
                const breakpoints: Breakpoint[] = [];
                for (const clientLine of clientLines) {
                    for (const validBPLine of validBPLocations) {
                        if (validBPLine.line >= clientLine) {
                            const bp: DebugProtocol.Breakpoint = new Breakpoint(true, validBPLine.line);
                            bp.id = this._breakpointId++;
                            breakpoints.push(bp);
                            this.workunit.debugBreakpointAdd(validBPLine.id + "_0", "edge", "break");
                            break;
                        }
                    }
                }
                logger.debug(this._breakPoints);
                this._breakPoints.set(sourcePath, breakpoints);

                // send back the actual breakpoint positions
                response.body = {
                    breakpoints
                };
                this.sendResponse(response);
                logger.debug("SetBreakPointsRequest");
            });
        } else {
            this.sendResponse(response);
            logger.debug("SetBreakPointsRequest");
        }

    }

    protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
        logger.debug("ThreadsRequest");
        const threads = [];
        threads.push(new Thread(0, "main"));
        response.body = {
            threads
        };
        this.sendResponse(response);
    }

    protected pushStackFrame(stackFrames: StackFrame[], graphItem: IGraphItem, def?: any): void {
        const id: number = this._stackFrameHandles.create(new WUStack(graphItem));
        if (def) {
            stackFrames.push(new StackFrame(id, graphItem.id(), new Source("builder", def.file), def.line, def.col));
        } else {
            stackFrames.push(new StackFrame(id, graphItem.id()));
        }
    }

    protected createStackTrace(graph: Graph, type: string, id: string, debugState, stackFrames: StackFrame[]): void {
        switch (type) {
            case "edge":
                const edge = graph.allEdge(id);
                this.pushStackFrame(stackFrames, edge, edge.getNearestDefinition());
                this.createStackTrace(graph, "vertex", edge.sourceID(), debugState, stackFrames);
                break;
            case "vertex":
                const vertex = graph.allVertex(id);
                this.pushStackFrame(stackFrames, vertex, vertex.getNearestDefinition());
                if (vertex.parent) {
                    this.createStackTrace(graph, "subgraph", vertex.parent().id(), debugState, stackFrames);
                } else {
                    this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                }
                break;
            case "subgraph":
                const subgraph = graph.allSubgraph(id);
                if (subgraph) {
                    this.pushStackFrame(stackFrames, subgraph, subgraph.getNearestDefinition(debugState.state === "graph end" || debugState.state === "finished"));
                    if (subgraph.parent()) {
                        this.createStackTrace(graph, "subgraph", subgraph.parent().id(), debugState, stackFrames);
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
        logger.debug("StackTraceRequest");
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
                logger.debug("StackTraceResponse");
                response.body = {
                    stackFrames
                };
                this.sendResponse(response);
            }).catch((e) => {
                logger.debug("StackTraceResponse");
                response.body = {
                    stackFrames
                };
                this.sendResponse(response);
            });
        } else {
            logger.debug("StackTraceResponse");
            response.body = {
                stackFrames
            };
            this.sendResponse(response);
        }
    }

    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
        logger.debug("ScopesRequest");
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
        logger.debug("ScopesResponse");
    }

    protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
        logger.debug("VariablesRequest");
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
                this.workunit.debugPrint(wuScope.stack.graphItem.id(), 0, 10).then((results) => {
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
        logger.debug("VariablesResponse");
    }

    protected continueRequest(response: DebugProtocol.ContinueResponse): void {
        logger.debug("ContinueRequest");
        this.workunit.debugContinue().then((debugResponse) => {
            logger.debug("debugContinue.then");
            this.workunit.refresh();
        });
        this.sendEvent(new ContinuedEvent(0));
        this.sendResponse(response);
        logger.debug("ContinueResponse");
    }

    protected nextRequest(response: DebugProtocol.NextResponse): void {
        logger.debug("NextRequest");
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
        logger.debug("NextResponse");
    }

    protected stepInRequest(response: DebugProtocol.StepInResponse): void {
        logger.debug("StepInRequest");
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
        logger.debug("StepInResponse");
    }

    protected stepOutRequest(response: DebugProtocol.StepOutResponse): void {
        logger.debug("StepOutRequest");
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
        logger.debug("StepOutResponse");
    }

    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): void {
        logger.debug("PauseRequest");
        this._prevDebugSequence = "pauseRequest";
        this.workunit.debugPause().then((debugResponse) => {
            this.workunit.refresh();
        });
        this.sendResponse(response);
        logger.debug("PauseResponse");
    }

    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        logger.debug("EvaluateRequest");
        this.sendResponse(response);
    }
}

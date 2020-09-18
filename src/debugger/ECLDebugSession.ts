import { EclccErrors, locateAllClientTools, Workunit, XGMMLEdge, XGMMLGraph, XGMMLSubgraph, XGMMLVertex } from "@hpcc-js/comms";
import { IObserverHandle, Level, logger, scopedLogger, ScopedLogging, Writer } from "@hpcc-js/util";

import { Breakpoint, ContinuedEvent, DebugSession, Event, Handles, OutputEvent, Scope, Source, StackFrame, StoppedEvent, TerminatedEvent, Thread, Variable } from "vscode-debugadapter";
import { DebugProtocol } from "vscode-debugprotocol";
import { LaunchRequestArguments } from "./launchRequestArguments";

import * as fs from "fs";
import * as os from "os";

export type XGMMLGraphItem = XGMMLGraph | XGMMLSubgraph | XGMMLVertex | XGMMLEdge;

function now() {
    return new Date(Date.now()).toISOString();
}

class VSCodeServerWriter implements Writer {
    private _owner: DebugSession;

    constructor(owner: DebugSession) {
        this._owner = owner;
    }
    write(dateTime: string, level: Level, id: string, msg: string) {
        this._owner.sendEvent(new OutputEvent(`${dateTime} ${Level[level].toUpperCase()} ${id}:  ${msg}.${os.EOL}`));
    }
}

const ATTR_DEFINITION = "definition";

export interface IECLDefintion {
    id: string;
    file: string;
    line: number;
    column: number;
}

function getECLDefinition(vertex: XGMMLVertex): IECLDefintion {
    const match = /([a-z]:\\(?:[-\w\.\d]+\\)*(?:[-\w\.\d]+)?|(?:\/[\w\.\-]+)+)\((\d*),(\d*)\)/.exec(vertex._![ATTR_DEFINITION]);
    if (match) {
        const [, _file, _row, _col] = match;
        _file.replace("/./", "/");
        return {
            id: vertex._!.id,
            file: _file,
            line: +_row,
            column: +_col
        };
    }
    throw new Error(`Bad definition:  ${vertex._![ATTR_DEFINITION]}`);
}

function hasECLDefinition(vertex: XGMMLVertex): boolean {
    return vertex._![ATTR_DEFINITION] !== undefined;
}

function getNearestDefinition(item: XGMMLGraphItem, backwards: boolean = false): IECLDefintion | null {
    //  Todo - order is incorrect...
    if (item instanceof XGMMLVertex) {
        if (hasECLDefinition(item)) {
            return getECLDefinition(item);
        }
        let retVal: IECLDefintion | null = null;
        item.inEdges.some((edge) => {
            retVal = getNearestDefinition(edge, backwards);
            if (retVal) {
                return true;
            }
            return false;
        });
        return retVal;
    } else if (item instanceof XGMMLSubgraph) {
        let vertices = item.vertices;
        if (backwards) {
            vertices = vertices.reverse();
        }
        let retVal: IECLDefintion | null = null;
        vertices.some((vertex) => {
            retVal = getNearestDefinition(vertex, backwards);
            if (retVal) {
                return true;
            }
            return false;
        });
        return retVal;
    } else if (item instanceof XGMMLEdge) {
        return getNearestDefinition(item.source, backwards);
    }
    return null;
}

class WUStack {
    graphItem: XGMMLGraphItem;

    constructor(graphItem: XGMMLGraphItem) {
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

function xmlFile(programPath: string): Promise<{ err: EclccErrors, content: string }> {
    return new Promise((resolve, reject) => {
        fs.readFile(programPath, "utf8", function (err, content) {
            resolve({ err: new EclccErrors("", []), content });
        });
    });
}

export class ECLDebugSession extends DebugSession {
    private workunit!: Workunit;
    private watchHandle!: IObserverHandle;
    private launchConfig!: LaunchRequestArguments;

    private prevMonitorMessage?: string;

    //  Breakpoints  ---
    private _breakpointId = 1000;
    private _breakPoints = new Map<string, DebugProtocol.Breakpoint[]>();
    private _stackFrameHandles = new Handles<WUStack>();
    private _variableHandles = new Handles<WUScope>();

    private _prevDebugSequence?: string;

    private logger: ScopedLogging;

    public constructor() {
        super();
        logger.writer(new VSCodeServerWriter(this));
        logger.level(Level.info);
        this.logger = scopedLogger("ECLDebugSession");

        locateAllClientTools();
    }

    protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
        this.logger.debug("InitializeRequest");
        if (response.body) {
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
        }
        this.sendResponse(response);
        this.logger.debug("InitializeResponse");
    }

    protected launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): void {
        this.sendEvent(new Event("LaunchRequest", { ...args }));
        this.sendEvent(new TerminatedEvent());
    }

    private disconnectWorkunit() {
        if (this.workunit.isComplete() || !this.workunit.isDebugging()) {
            return Promise.resolve();
        }
        this.sendEvent(new OutputEvent(`${now()} Aborting debug session:  ${this.workunit.Wuid}.${os.EOL}`));
        return this.workunit.debugQuit().then(() => {
            return this.workunit.abort();
        }).then(() => {
            return this.workunit.refresh();
        }).catch((e) => {
            this.logger.error("Error disconnecting workunit");
        });
    }

    protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments): void {
        this.logger.debug("DisconnectRequest");
        this.disconnectWorkunit().then(() => {
            if (this.watchHandle) {
                this.watchHandle.release();
                delete this.watchHandle;
            }
            this.sendEvent(new OutputEvent(`${now()} Finished:  ${this.workunit.Wuid}.${os.EOL}`));
            delete this.workunit;
            this.logger.debug("DisconnectResponse");
            super.disconnectRequest(response, args);
        });
    }

    protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
        this.logger.debug("ConfigurationDoneRequest");
        this.sendEvent(new OutputEvent(`${now()} Monitoring:  ${this.workunit.Wuid} - attach.${os.EOL}`));
        this.watchHandle = this.workunit.watch((changes) => {
            const debugState: any = this.workunit.DebugState;
            let id = debugState.edgeId || debugState.nodeId || debugState.graphId;
            id = id ? `(${id})` : "";
            const debugMsg = this.workunit.isDebugging() ? `(${debugState.sequence}) - ${debugState.state}${id}` : "";
            const monitorMsg = `${now()} Monitoring:  ${this.workunit.Wuid} - ${this.workunit.State}${debugMsg}.${os.EOL}`;
            if (this.prevMonitorMessage !== monitorMsg) {
                this.prevMonitorMessage = monitorMsg;
                this.sendEvent(new OutputEvent(monitorMsg));
            }
            if (this.workunit.isComplete()) {
                this.sendEvent(new TerminatedEvent());
                this.logger.debug("TerminatedEvent");
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
                        this.logger.debug("StoppedEvent");
                        this.sendEvent(new StoppedEvent(debugState.state, 0));
                        break;
                    case "debug_running":
                        break;
                    default:
                }
            }
            this.logger.debug(`Debugging: ${debugState.state} - ${JSON.stringify(debugState)}${os.EOL}`);
        }, true);
        this.sendResponse(response);
        this.logger.debug("ConfigurationDoneResponse");
    }

    protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
        this.logger.debug("SetBreakPointsRequest");
        if (this.workunit.isDebugging() && args.source.path) {
            const sourcePath = args.source.path;
            this.workunit.debugDeleteAllBreakpoints().then(() => {
                return this.workunit.debugBreakpointValid(sourcePath);
            }).then((validBPLocations: any) => {
                // verify breakpoint locations
                const breakpoints: Breakpoint[] = [];
                const clientLines = args.lines;
                if (clientLines) {
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
                }
                this.logger.debug(this._breakPoints);
                this._breakPoints.set(sourcePath, breakpoints);

                // send back the actual breakpoint positions
                response.body = {
                    breakpoints
                };
                this.logger.debug("SetBreakPointsRequest");
                this.sendResponse(response);
            });
        } else {
            response.body = {
                breakpoints: []
            };
            this.logger.debug("SetBreakPointsRequest");
            this.sendResponse(response);
        }
    }

    protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
        this.logger.debug("ThreadsRequest");
        const threads: Thread[] = [];
        threads.push(new Thread(0, "main"));
        response.body = {
            threads
        };
        this.sendResponse(response);
    }

    protected pushStackFrame(stackFrames: StackFrame[], graphItem: XGMMLGraphItem, def?: any): void {
        const id: number = this._stackFrameHandles.create(new WUStack(graphItem));
        const graphItemID = graphItem instanceof XGMMLGraph ? graphItem.root._!.id : graphItem._!.id;
        if (def) {
            stackFrames.push(new StackFrame(id, graphItemID, new Source("builder", def.file), def.line, def.col));
        } else {
            stackFrames.push(new StackFrame(id, graphItemID));
        }
    }

    protected createStackTrace(graph: XGMMLGraph, type: string, id: string, debugState, stackFrames: StackFrame[]): void {
        switch (type) {
            case "edge":
                const edge = graph.edge(id);
                this.pushStackFrame(stackFrames, edge, getNearestDefinition(edge));
                this.createStackTrace(graph, "vertex", edge.source._!.id, debugState, stackFrames);
                break;
            case "vertex":
                const vertex = graph.vertex(id);
                this.pushStackFrame(stackFrames, vertex, getNearestDefinition(vertex));
                if (vertex.parent) {
                    this.createStackTrace(graph, "subgraph", vertex.parent!._!.id, debugState, stackFrames);
                } else {
                    this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                }
                break;
            case "subgraph":
                const subgraph = graph.subgraph(id);
                if (subgraph) {
                    this.pushStackFrame(stackFrames, subgraph, getNearestDefinition(subgraph, debugState.state === "graph end" || debugState.state === "finished"));
                    if (subgraph.parent) {
                        this.createStackTrace(graph, "subgraph", subgraph.parent._!.id, debugState, stackFrames);
                    } else {
                        this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                    }
                } else {
                    this.createStackTrace(graph, "workunit", this.workunit.Wuid, debugState, stackFrames);
                }
                break;
            case "workunit":
                this.pushStackFrame(stackFrames, graph, { file: this.launchConfig.program, col: debugState.state === "finished" ? Number.MAX_SAFE_INTEGER : 0 });
                break;
            default:
        }
    }

    protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void {
        this.logger.debug("StackTraceRequest");
        const stackFrames: StackFrame[] = [];
        if (this.workunit.isDebugging()) {
            this.workunit.debugGraph().then((graph: XGMMLGraph) => {
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
                this.logger.debug("StackTraceResponse");
                response.body = {
                    stackFrames
                };
                this.sendResponse(response);
            }).catch((e) => {
                this.logger.debug("StackTraceResponse");
                response.body = {
                    stackFrames
                };
                this.sendResponse(response);
            });
        } else {
            this.logger.debug("StackTraceResponse");
            response.body = {
                stackFrames
            };
            this.sendResponse(response);
        }
    }

    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
        this.logger.debug("ScopesRequest");
        const stackFrameScope: WUStack = this._stackFrameHandles.get(args.frameId);

        const scopes: Scope[] = [];
        if (stackFrameScope.graphItem instanceof XGMMLEdge) {
            scopes.push(new Scope("Results", this._variableHandles.create(new WUScope(stackFrameScope, "results")), false));
            scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "local")), false));
        } else if (stackFrameScope.graphItem instanceof XGMMLVertex) {
            scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "local")), false));
            scopes.push(new Scope("Out Edges", this._variableHandles.create(new WUScope(stackFrameScope, "outedges")), false));
        } else if (stackFrameScope.graphItem instanceof XGMMLSubgraph) {
            scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "local")), false));
            scopes.push(new Scope("Subgraphs", this._variableHandles.create(new WUScope(stackFrameScope, "subgraphs")), false));
            scopes.push(new Scope("Vertices", this._variableHandles.create(new WUScope(stackFrameScope, "vertices")), false));
        } else if (stackFrameScope.graphItem instanceof XGMMLGraph) {
            scopes.push(new Scope("Local", this._variableHandles.create(new WUScope(stackFrameScope, "workunit")), false));
            scopes.push(new Scope("Graphs", this._variableHandles.create(new WUScope(stackFrameScope, "subgraphs")), false));
            scopes.push(new Scope("Debug", this._variableHandles.create(new WUScope(stackFrameScope, "breakpoints")), true));
        }
        response.body = {
            scopes
        };
        this.sendResponse(response);
        this.logger.debug("ScopesResponse");
    }

    protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void {
        this.logger.debug("VariablesRequest");
        const wuScope = this._variableHandles.get(args.variablesReference);
        let variables: Variable[] = [];
        if (!(wuScope.stack.graphItem instanceof XGMMLGraph)) {
            switch (wuScope.type) {
                case "local":
                    for (const key in wuScope.stack.graphItem._!) {
                        if (wuScope.stack.graphItem._!.hasOwnProperty(key)) {
                            variables.push(new Variable(key, "" + wuScope.stack.graphItem._![key]));
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
                    this.workunit.debugPrint(wuScope.stack.graphItem._!.id, 0, 10).then((results) => {
                        variables = results.map((result, idx) => {
                            const summary: any[] = [];
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
        }
        response.body = {
            variables
        };
        this.sendResponse(response);
        this.logger.debug("VariablesResponse");
    }

    protected continueRequest(response: DebugProtocol.ContinueResponse): void {
        this.logger.debug("ContinueRequest");
        this.workunit.debugContinue().then((debugResponse) => {
            this.logger.debug("debugContinue.then");
            this.workunit.refresh();
        });
        this.sendEvent(new ContinuedEvent(0));
        this.sendResponse(response);
        this.logger.debug("ContinueResponse");
    }

    protected nextRequest(response: DebugProtocol.NextResponse): void {
        this.logger.debug("NextRequest");
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
        this.logger.debug("NextResponse");
    }

    protected stepInRequest(response: DebugProtocol.StepInResponse): void {
        this.logger.debug("StepInRequest");
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
        this.logger.debug("StepInResponse");
    }

    protected stepOutRequest(response: DebugProtocol.StepOutResponse): void {
        this.logger.debug("StepOutRequest");
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
        this.logger.debug("StepOutResponse");
    }

    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): void {
        this.logger.debug("PauseRequest");
        this._prevDebugSequence = "pauseRequest";
        this.workunit.debugPause().then((debugResponse) => {
            this.workunit.refresh();
        });
        this.sendResponse(response);
        this.logger.debug("PauseResponse");
    }

    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void {
        this.logger.debug("EvaluateRequest");
        this.sendResponse(response);
    }
}

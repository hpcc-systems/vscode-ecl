import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { AccountService, Activity, Workunit, WUQuery, WUUpdate, Topology, EclccErrors, IOptions, LogicalFile, TpLogicalClusterQuery, attachWorkspace, IECLErrorWarning, locateClientTools, ClientTools } from "@hpcc-js/comms";
import { scopedLogger } from "@hpcc-js/util";
import { LaunchConfigState, LaunchMode, LaunchRequestArguments } from "../debugger/launchRequestArguments";
import { showEclStatus } from "../ecl/clientTools";

const logger = scopedLogger("launchConfig.ts");

function xmlFile(programPath: string): Promise<{ err: EclccErrors, content: string }> {
    return new Promise((resolve, reject) => {
        fs.readFile(programPath, "utf8", function (err, content) {
            resolve({ err: new EclccErrors("", []), content });
        });
    });
}

export {
    LaunchRequestArguments
};

let g_launchConfigurations: { [name: string]: LaunchRequestArguments };
function gatherServers(wuf?: vscode.WorkspaceFolder) {
    const eclLaunch = vscode.workspace.getConfiguration("launch", wuf.uri);
    if (eclLaunch.has("configurations")) {
        for (const launchConfig of eclLaunch.get<any[]>("configurations")!) {
            if (launchConfig.type === "ecl" && launchConfig.name) {
                g_launchConfigurations[`${launchConfig.name}${wuf ? ` (${wuf.name})` : ""}`] = launchConfig;
            }
        }
    }
}

export function launchConfigurations(refresh = false): string[] {
    if (!g_launchConfigurations || refresh === true) {
        g_launchConfigurations = {};

        if (vscode.workspace.workspaceFolders) {
            for (const wuf of vscode.workspace.workspaceFolders) {
                gatherServers(wuf);
            }
        } else {
            gatherServers();
        }
    }
    const retVal = Object.keys(g_launchConfigurations);
    if (retVal.length === 0) {
        vscode.window.showErrorMessage("No ECL Launch configurations.", "Create ECL Launch").then(response => {
            vscode.commands.executeCommand("workbench.action.debug.configure");
        });

        g_launchConfigurations["not found"] = {
            name: "not found",
            type: "ecl",

            //  Required
            protocol: "http",
            serverAddress: "localhost",
            port: 8010,
            targetCluster: "unknown"
        };
        retVal.push("not found");
    }
    return retVal;
}

export function launchConfiguration(name: string): LaunchRequestArguments | undefined {
    if (!g_launchConfigurations) {
        launchConfigurations(true);
    }
    return g_launchConfigurations[name];
}

function config<T extends keyof LaunchRequestArguments>(id: string, key: T, defaultValue?: LaunchRequestArguments[T]) {
    const config = launchConfiguration(id);
    let retVal = config[key];
    if (retVal === undefined) {
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        retVal = eclConfig.get(key);
    } else if (typeof retVal === "string" && retVal.indexOf(configPrefix) === 0) {
        const configKey = retVal.substring(configPrefix.length, retVal.length - 1);
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        retVal = eclConfig.get(configKey);
    }
    if (retVal === undefined) {
        retVal = defaultValue;
    }
    return retVal;
}

export function espUrl(launchRequestArgs: LaunchRequestArguments) {
    return `${launchRequestArgs.protocol}://${launchRequestArgs.serverAddress}:${launchRequestArgs.port}`;
}

export function wuDetailsUrl(launchRequestArgs: LaunchRequestArguments, wuid: string) {
    return `${espUrl(launchRequestArgs)}/?Widget=WUDetailsWidget&Wuid=${wuid}`;
}

export function wuResultUrl(launchRequestArgs: LaunchRequestArguments, wuid: string, sequence: number) {
    return `${espUrl(launchRequestArgs)}/?Widget=ResultWidget&Wuid=${wuid}&Sequence=${sequence}`;
}

function action(mode: LaunchMode) {
    switch (mode) {
        case "compile":
        case "publish":
            return WUUpdate.Action.Compile;
        case "debug":
            return WUUpdate.Action.Debug;
        case "submit":
        default:
            return WUUpdate.Action.Run;
    }
}

export interface Credentials {
    user: string;
    password: string;
    verified: boolean;
}

const credentials: { [serverAddress: string]: Credentials } = {};

const configPrefix = "${config:ecl.";

type ValueOf<T> = T[keyof T];

export interface CheckResponse {
    errors: IECLErrorWarning[];
    checked: string[];
}

export class LaunchConfig implements LaunchRequestArguments {

    private readonly _lcID: string;

    get id(): string {
        return this._lcID;
    }

    get name(): string {
        return config(this._lcID, "name");
    }

    get type(): "ecl" {
        return "ecl";
    }

    //  Required
    get protocol() {
        return config(this._lcID, "protocol");
    }

    get serverAddress() {
        return config(this._lcID, "serverAddress");
    }

    get port() {
        return config(this._lcID, "port");
    }

    get targetCluster() {
        return config(this._lcID, "targetCluster");
    }

    //  Optional
    get abortSubmitOnError(): boolean {
        return config(this._lcID, "abortSubmitOnError", true);
    }

    get rejectUnauthorized(): boolean {
        return config(this._lcID, "rejectUnauthorized", false);
    }

    get eclccPath(): string {
        return config(this._lcID, "eclccPath", "");
    }

    get eclccArgs(): string[] {
        return config(this._lcID, "eclccArgs", []);
    }

    get eclccSyntaxArgs(): string[] {
        return config(this._lcID, "eclccSyntaxArgs", []);
    }

    get eclccLogFile() {
        return config(this._lcID, "eclccLogFile", "");
    }

    get resultLimit() {
        return config(this._lcID, "resultLimit", 100);
    }

    get timeoutSecs() {
        return config(this._lcID, "timeoutSecs", 60);
    }

    get user() {
        return config(this._lcID, "user", "vscode_user");
    }

    get password() {
        return config(this._lcID, "password", "");
    }

    get espUrl() {
        return `${this.protocol}://${this.serverAddress}:${this.port}`;
    }

    constructor(lcID: string) {
        this._lcID = lcID;
    }

    //  Credentials  ---
    private credentials(): Credentials {
        let retVal = credentials[this.serverAddress];
        if (!retVal) {
            retVal = credentials[this.serverAddress] = {
                user: this.user,
                password: this.password,
                verified: false
            };
        }
        return retVal;
    }

    private verifyUser(): Promise<boolean> {
        const credentials = this.credentials();
        if (credentials.verified) {
            return Promise.resolve(true);
        }
        const acService = new AccountService(this.opts(credentials));
        return acService.VerifyUser({
            application: "vscode-ecl",
            version: ""
        }).then(response => {
            credentials.verified = true;
            return true;
        }).catch(e => {
            return false;
        });
    }

    private ping(timeout: number = 5000): Promise<LaunchConfigState> {
        const timeoutPrommise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("timeout");
            }, timeout);
        });
        const queryPromise = this.verifyUser();
        return Promise.race([timeoutPrommise, queryPromise])
            .then(verified => {
                return verified ? LaunchConfigState.Ok : LaunchConfigState.Credentials;
            }).catch(e => {
                return e === "timeout" ? LaunchConfigState.Unreachable : LaunchConfigState.Credentials;
            });
    }

    private async promptUserID() {
        const credentials = this.credentials();
        credentials.user = await vscode.window.showInputBox({
            prompt: `User ID (${this.id})`,
            password: false,
            value: credentials.user
        }) || "";
    }

    private async promptPassword(): Promise<boolean> {
        const credentials = this.credentials();
        credentials.password = await vscode.window.showInputBox({
            prompt: `Password (${this.id})`,
            password: true,
            value: credentials.password
        }) || "";
        return false;
    }

    async checkCredentials(): Promise<Credentials> {
        if (this.name === "not found") {
            throw new Error("No ECL Launch configurations.");
        }
        const pingResult = await this.ping();
        switch (pingResult) {
            case LaunchConfigState.Ok:
                return this.credentials();
            case LaunchConfigState.Credentials:
                for (let i = 0; i < 3; ++i) {
                    await this.promptUserID();
                    await this.promptPassword();
                    const credentials = this.credentials();
                    if (!credentials.user && !credentials.password) {
                        break;
                    }
                    if (await this.verifyUser()) {
                        return this.credentials();
                    }
                }
                throw new Error("Invalid Credentials.");
            case LaunchConfigState.Unknown:
            case LaunchConfigState.Unreachable:
            default:
                throw new Error("Connection failed.");
        }
    }

    //  Check Syntax  ---
    calcIncludeFolders(wsPath: string): string[] {
        const retVal: string[] = [];
        const dedup: { [key: string]: boolean } = {};

        function safeAppend(fsPath: string) {
            attachWorkspace(fsPath);    //  Just to prime autocompletion  ---
            if (wsPath !== fsPath && !dedup[fsPath]) {
                dedup[fsPath] = true;
                retVal.push(fsPath);
            }
        }

        if (vscode.workspace.workspaceFolders) {
            for (const wuf of vscode.workspace.workspaceFolders) {
                safeAppend(wuf.uri.fsPath);
                const eclConfig = vscode.workspace.getConfiguration("ecl", wuf.uri);
                for (const fsPath of eclConfig["includeFolders"]) {
                    safeAppend(path.isAbsolute(fsPath) ? fsPath : path.resolve(wsPath, fsPath));
                }
            }
        }
        return retVal;
    }

    locateClientTools(fileUri?: vscode.Uri, build = ""): Promise<ClientTools> {
        const eclConfig = vscode.workspace.getConfiguration("ecl", fileUri);
        const currentWorkspace = fileUri ? vscode.workspace.getWorkspaceFolder(fileUri) : undefined;
        const currentWorkspacePath = currentWorkspace ? currentWorkspace.uri.fsPath : "";
        const includeFolders = this.calcIncludeFolders(currentWorkspacePath);
        const args = this.eclccArgs;
        if (this.eclccLogFile) {
            args.push(`--logfile=${path.normalize(this.eclccLogFile)}`);
        }
        return locateClientTools(
            this.eclccPath,
            build,
            currentWorkspacePath,
            includeFolders,
            eclConfig.get("legacyMode"),
            args
        ).then(clientTools => {
            let eclccPathOverriden = false;
            if (clientTools) {
                if (clientTools.eclccPath === this.eclccPath) {
                    eclccPathOverriden = true;
                }
                clientTools.version().then(version => {
                    showEclStatus(version.toString(), eclccPathOverriden, clientTools.eclccPath);
                });
            } else {
                showEclStatus("Unknown", false, "Unable to locate eclcc");
            }
            return clientTools;
        });
    }

    checkSyntax(fileUri: vscode.Uri): Promise<CheckResponse> {
        return this.locateClientTools(fileUri).then(clientTools => {
            if (!clientTools) {
                throw new Error();
            } else {
                logger.debug(`syntaxCheck-promise:  ${fileUri.fsPath}`);
                return clientTools.syntaxCheck(fileUri.fsPath, ["-syntax", ...this.eclccSyntaxArgs]).then((errors) => {
                    if (errors.hasUnknown()) {
                        logger.warning(`syntaxCheck-warning:  ${fileUri.fsPath} ${errors.unknown().toString()}`);
                    }
                    logger.debug(`syntaxCheck-resolve:  ${fileUri.fsPath} ${errors.errors().length} total.`);
                    return { errors: errors.all(), checked: errors.checked() };
                }).catch(e => {
                    logger.debug(`syntaxCheck-reject:  ${fileUri.fsPath} ${e.msg}`);
                    vscode.window.showInformationMessage(`Syntax check exception:  ${fileUri.fsPath} ${e.msg}`);
                    return Promise.resolve({ errors: [], checked: [] });
                });
            }
        }).catch(e => {
            vscode.window.showInformationMessage('Unable to locate "eclcc" binary.  Ensure ECL ClientTools is installed.');
            return Promise.resolve({ errors: [], checked: [] });
        });
    }

    //  Misc  ---
    opts(credentials: Credentials): IOptions {
        return {
            baseUrl: this.espUrl,
            userID: credentials.user,
            password: credentials.password,
            rejectUnauthorized: this.rejectUnauthorized,
            timeoutSecs: this.timeoutSecs
        };
    }

    wuDetailsUrl(wuid: string) {
        return `${this.espUrl}/?Widget=WUDetailsWidget&Wuid=${wuid}`;
    }

    wuResultsUrl(wuid: string, sequence: number) {
        return `${this.espUrl}/?Widget=ResultWidget&Wuid=${wuid}&Sequence=${sequence}`;
    }

    private _buildPromise;
    fetchBuild(): Promise<string> {
        if (!this._buildPromise) {
            this._buildPromise = this.checkCredentials().then(credentials => {
                const activity = Activity.attach(this.opts(credentials));
                return activity.refresh().then(activity => {
                    return activity.Build;
                });
            });
        }
        return this._buildPromise;
    }

    targetClusters(): Promise<TpLogicalClusterQuery.TpLogicalCluster[]> {
        return this.checkCredentials().then(credentials => {
            const topology = new Topology(this.opts(credentials));
            return topology.fetchLogicalClusters();
        });
    }

    wuQuery(request: WUQuery.Request): Promise<Workunit[]> {
        return this.checkCredentials().then(credentials => {
            return Workunit.query(this.opts(credentials), request);
        });
    }

    //  Workunit  ---
    // async localResolveDebugConfiguration(filePath: string): Promise<LaunchRequestArguments> {
    //     const uri = vscode.Uri.file(filePath);
    //     const folder = vscode.workspace.getWorkspaceFolder(uri);
    //     const configPrefix = "${config:ecl.";
    //     return eclConfigurationProvider.resolveDebugConfiguration(folder, this._config as unknown as vscode.DebugConfiguration).then(debugConfiguration => {
    //         for (const key in debugConfiguration) {
    //             let value: any = debugConfiguration[key];
    //             switch (value) {
    //                 case "${workspaceRoot}":
    //                     debugConfiguration[key] = folder.uri.fsPath;
    //                     break;
    //                 case "${file}":
    //                     debugConfiguration[key] = filePath;
    //                     break;
    //                 default:
    //                     if (typeof value === "string" && value.indexOf(configPrefix) === 0) {
    //                         const configKey = value.substring(configPrefix.length, value.length - 1);
    //                         const eclConfig = vscode.workspace.getConfiguration("ecl");
    //                         debugConfiguration[key] = eclConfig.get(configKey);
    //                     }
    //             }
    //             value = debugConfiguration[key];
    //             if (Array.isArray(value)) {
    //                 debugConfiguration[key] = value.join(",");
    //             }
    //         }
    //         return debugConfiguration as unknown as LaunchRequestArguments;
    //     });
    // }

    private createWorkunit() {
        return this.checkCredentials().then(credentials => {
            return Workunit.create(this.opts(credentials));
        });
    }

    fetchRecordDef(lf: string) {
        return this.checkCredentials().then(credentials => {
            const file = LogicalFile.attach(this.opts(credentials), "", lf);
            return file.fetchInfo().then(info => info.Ecl);
        });
    }

    async submit(fileUri: vscode.Uri, targetCluster: string, mode: LaunchMode) {
        // const args = await this.localResolveDebugConfiguration(filePath);
        // logger.debug("launchRequest:  " + JSON.stringify(args));
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Submit ECL",
            cancellable: false
        }, (progress, token) => {
            const filePath = fileUri.fsPath;
            logger.info(`Fetch build version.${os.EOL}`);
            const pathParts = path.parse(filePath);
            let failedWU: Workunit;
            return this.fetchBuild().then(build => {
                progress.report({ increment: 10, message: "Locating Client Tools" });
                logger.info(`Locating Client Tools.${os.EOL}`);
                return this.locateClientTools(fileUri, build);
            }).then((clientTools) => {
                progress.report({ increment: 10, message: "Creating Archive" });
                logger.info(`Client Tools:  ${clientTools.eclccPath}.${os.EOL}`);
                logger.info(`Generating archive.${os.EOL}`);
                if (pathParts.ext.toLowerCase() === ".xml") {
                    return xmlFile(filePath);
                } else {
                    return clientTools.createArchive(filePath);
                }
            }).then(archive => {
                progress.report({ increment: 10, message: "Verifying Archive" });
                if (this.abortSubmitOnError && archive.err.hasError()) {
                    throw new Error(`ECL Syntax Error(s):\n  ${archive.err.errors().map(e => e.msg).join("\n  ")}`);
                }
                logger.info(`Archive Size: ${archive.content.length}.${os.EOL}`);
                return archive;
            }).then(archive => {
                progress.report({ increment: 10, message: "Creating Workunit" });
                logger.info(`Creating workunit.${os.EOL}`);
                return this.createWorkunit().then(wu => {
                    failedWU = wu;
                    return [wu, archive] as [Workunit, any];
                });
            }).then(([wu, archive]) => {
                // eslint-disable-next-line no-async-promise-executor
                progress.report({ increment: 10, message: `Updating Workunit ${wu.Wuid}` });
                // eslint-disable-next-line no-async-promise-executor
                return new Promise<Workunit>(async (resolve, reject) => {
                    const attempts = 3;
                    let lastError;
                    for (let retry = 1; retry <= attempts; ++retry) {
                        progress.report({ increment: 3, message: `Updating workunit ${wu.Wuid} (${retry} of ${attempts})` });
                        logger.info(`Updating workunit (${retry} of ${attempts}).${os.EOL}`);
                        await wu.update({
                            Jobname: pathParts.name,
                            QueryText: archive.content,
                            ApplicationValues: {
                                ApplicationValue: [{
                                    Application: "vscode-ecl",
                                    Name: "filePath",
                                    Value: filePath
                                }]
                            }
                        }).then(wu => {
                            retry = attempts + 1;
                            resolve(wu);
                        }).catch(e => {
                            lastError = e || lastError;
                        });
                    }
                    reject(lastError);
                });
            }).then((wu) => {
                progress.report({ increment: 10, message: `Submitting workunit ${wu.Wuid}` });
                logger.info(`Submitting workunit:  ${wu.Wuid}.${os.EOL}`);
                return wu.submit(targetCluster, action(mode), this.resultLimit);
            }).then((wu) => {
                progress.report({ increment: 10, message: `Submitted workunit ${wu.Wuid}` });
                logger.info(`Submitted:  ${this.wuDetailsUrl(wu.Wuid)}.${os.EOL}`);
                failedWU = undefined;
                return wu;
            }).catch((e) => {
                logger.info(`Launch failed - ${e}.${os.EOL}`);
                logger.debug("InitializeEvent");
                if (failedWU) {
                    failedWU.setToFailed();
                    return failedWU;
                }
                throw e;
            });
        });
    }
}

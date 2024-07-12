import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import { AccountService, Activity, CodesignService, Workunit, WsWorkunits, WUUpdate, WsTopology, Topology, EclccErrors, IOptions, LogicalFile, attachWorkspace, IECLErrorWarning, locateClientTools, ClientTools, WorkunitsService } from "@hpcc-js/comms";
import { join, scopedLogger } from "@hpcc-js/util";
import { LaunchConfigState, LaunchMode, LaunchProtocol, LaunchRequestArguments } from "../debugger/launchRequestArguments";
import { showEclStatus } from "../ecl/clientTools";
import localize from "../util/localize";
import { readFile } from "../util/fs";
import { reporter } from "../telemetry";

const fs = vscode.workspace.fs;

export interface IExecFile {
    code: number;
    stderr: string;
    stdout: string;
}

const logger = scopedLogger("launchConfig.ts");

const PROXY_WARNING = localize("User setting 'http.proxySupport' is set to 'override'.\nThis will prevent ECL from targetting 'Trustwave' signed sites and will also prevent 'rejectUnauthorized: false' from working.\nSetting this to 'fallback' will resolve these issues.");
const SET_FALLBACK = localize("Set to 'fallback'");

function rawFile(programPath: string): Thenable<{ err: EclccErrors, content: string }> {
    return readFile(programPath).then(content => {
        return { err: new EclccErrors("", []), content };
    });
}

export {
    LaunchRequestArguments
};

let g_launchConfigurations: { [name: string]: LaunchRequestArguments };
function addLaunchConfiguration(configurations, source?: string) {
    for (const launchConfig of configurations ?? []) {
        if (launchConfig.type === "ecl" && launchConfig.name) {
            const name = launchConfig.name + (source ? ` (${source})` : "");
            g_launchConfigurations[name] = { ...launchConfig };
            g_launchConfigurations[name].name = name;
        }
    }
}

function gatherServers(wuf?: vscode.WorkspaceFolder, wufCount: number = 0) {
    const eclLaunch = vscode.workspace.getConfiguration("launch", wuf?.uri);
    const configs = eclLaunch.inspect("configurations");
    addLaunchConfiguration(configs.globalValue, localize("user settings"));
    addLaunchConfiguration(configs.workspaceFolderValue, wufCount > 1 ? wuf?.name : undefined);
    addLaunchConfiguration(configs.workspaceValue, wufCount > 1 ? wuf?.name : undefined);
}

export function launchConfigurations(refresh = false): LaunchRequestArguments[] {
    if (!g_launchConfigurations || refresh === true) {
        g_launchConfigurations = {};

        if (vscode.workspace.workspaceFolders) {
            for (const wuf of vscode.workspace.workspaceFolders) {
                gatherServers(wuf, vscode.workspace.workspaceFolders.length);
            }
        } else {
            gatherServers();
        }
    }
    const retVal = Object.values(g_launchConfigurations);
    if (retVal.length === 0) {
        vscode.window.showErrorMessage(localize("No ECL Launch configurations."), localize("Create ECL Launch")).then(response => {
            vscode.commands.executeCommand("workbench.action.debug.configure");
        });
        const notFound: LaunchRequestArguments = {
            name: "not found",
            type: "ecl",

            //  Required
            protocol: "http",
            serverAddress: "localhost",
            port: 8010,
            path: "",
            targetCluster: "unknown"
        };
        g_launchConfigurations["not found"] = notFound;
        retVal.push(notFound);
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

export function espUrl(launchRequestArgs: { protocol: LaunchProtocol, serverAddress: string, port: number, path: string }) {
    return join(`${launchRequestArgs.protocol}://${launchRequestArgs.serverAddress}:${launchRequestArgs.port}`, launchRequestArgs.path);
}

export function wuDetailsUrl(launchRequestArgs: { protocol: LaunchProtocol, serverAddress: string, port: number, path: string }, wuid: string) {
    return `${espUrl(launchRequestArgs)}/?Widget=WUDetailsWidget&Wuid=${wuid}`;
}

export function wuResultUrl(launchRequestArgs: { protocol: LaunchProtocol, serverAddress: string, port: number, path: string }, wuid: string, sequence: number) {
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
        case "submitNoArchive":
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
    get path() {
        return config(this._lcID, "path", "");
    }

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
        const creds = credentials[this.serverAddress];
        if (creds?.verified) {
            return creds.user;
        }
        return config(this._lcID, "user", "vscode_user");
    }

    get password() {
        const creds = credentials[this.serverAddress];
        if (creds?.verified) {
            return creds.password;
        }
        return config(this._lcID, "password", "");
    }

    get espUrl() {
        return join(`${this.protocol}://${this.serverAddress}:${this.port}`, this.path);
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

    private async checkProxy(opts: IOptions) {
        if (opts.baseUrl.indexOf("https:") === 0) {
            const config = vscode.workspace.getConfiguration();
            if (config.get("http.proxySupport") === "override") {
                const eclConfig = vscode.workspace.getConfiguration("ecl");
                const response = eclConfig.get("forceProxySupport") ? SET_FALLBACK : await vscode.window.showWarningMessage(PROXY_WARNING, { modal: true }, SET_FALLBACK);
                switch (response) {
                    case SET_FALLBACK:
                        await config.update("http.proxySupport", "fallback", true);
                        break;
                }
            }
        }
    }

    private async verifyUser(): Promise<LaunchConfigState> {
        const credentials = this.credentials();
        if (credentials.verified) {
            return Promise.resolve(LaunchConfigState.Ok);
        }
        const opts = this.opts(credentials);
        await this.checkProxy(opts);
        const acService = new AccountService(opts);
        return acService.VerifyUser({
            application: "vscode-ecl",
            version: "2"
        }).then(response => {
            credentials.verified = true;
            return LaunchConfigState.Ok;
        }).catch(e => {
            logger.debug("verifyUser catch:  -->" + e?.message + "<--");
            //  old client version warning  ---
            if (e.isESPExceptions && e.Exception.some((exception) => exception.Code === 20043)) {
                credentials.verified = true;
                return LaunchConfigState.Ok;
            }
            return e?.message.indexOf("ECONNREFUSED") >= 0 ? LaunchConfigState.Unreachable : LaunchConfigState.Credentials;
        });
    }

    async pingServer(timeout: number = 5000): Promise<LaunchConfigState> {
        const credentials = this.credentials();
        const timeoutPrommise = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve("timeout");
            }, timeout);
        });
        const opts = this.opts(credentials);
        await this.checkProxy(opts);
        const service = new WorkunitsService(this.opts(credentials));
        const queryPromise = service.Ping();
        return Promise.race([timeoutPrommise, queryPromise])
            .then((response: string | WsWorkunits.WsWorkunitsPingResponse) => {
                if (typeof response === "string") {
                    logger.debug("ping response:  " + response);
                    return LaunchConfigState.Unreachable;
                } else {
                    logger.debug("ping response:  " + response);
                    return response ? LaunchConfigState.Ok : LaunchConfigState.Unreachable;
                }
            }).catch(e => {
                logger.debug("ping exception:  " + e?.message || e);
                return e === "timeout" ? LaunchConfigState.Unreachable : LaunchConfigState.Credentials;
            });
    }

    private ping(timeout: number = 5000): Promise<LaunchConfigState> {
        const timeoutPrommise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("timeout");
            }, timeout);
        });
        const queryPromise = this.verifyUser();
        return Promise.race([timeoutPrommise, queryPromise])
            .then((verified: string | LaunchConfigState) => {
                if (typeof verified === "string") {
                    logger.debug("ping verified:  " + verified);
                    return LaunchConfigState.Unreachable;
                } else {
                    logger.debug("ping verified:  " + verified);
                    return verified;
                }
            }).catch(e => {
                logger.debug("ping exception:  " + e?.message || e);
                return e === "timeout" ? LaunchConfigState.Unreachable : LaunchConfigState.Credentials;
            });
    }

    private async promptUserID() {
        const credentials = this.credentials();
        const user = await vscode.window.showInputBox({
            prompt: `${localize("User ID")} (${this.id})`,
            password: false,
            value: credentials.user
        }) || "";
        if (user) {
            credentials.user = user;
        }
        return user;
    }

    private async promptPassword(): Promise<boolean> {
        const credentials = this.credentials();
        credentials.password = await vscode.window.showInputBox({
            prompt: `${localize("Password")} (${this.id})`,
            password: true,
            value: credentials.password
        }) || "";
        return false;
    }

    async _checkCredentials(): Promise<Credentials> {
        if (this.name === "not found") {
            throw new Error(localize("No ECL Launch configurations."));
        }
        const pingResult = await this.ping();
        switch (pingResult) {
            case LaunchConfigState.Ok:
                return this.credentials();
            case LaunchConfigState.Credentials:
                for (let i = 0; i < 3; ++i) {
                    if (await this.promptUserID()) {
                        await this.promptPassword();
                    }
                    const credentials = this.credentials();
                    if (!credentials.user && !credentials.password) {
                        break;
                    }
                    if (await this.verifyUser()) {
                        return this.credentials();
                    }
                }
                throw new Error(localize("Invalid Credentials."));
            case LaunchConfigState.Unknown:
            case LaunchConfigState.Unreachable:
            default:
                throw new Error(`${localize("Connection failed")}.`);
        }
    }

    _checkingCredentials: Promise<Credentials>;
    async checkCredentials(): Promise<Credentials> {
        if (this._checkingCredentials) return this._checkingCredentials;
        this._checkingCredentials = this._checkCredentials()
            .then(response => {
                delete this._checkingCredentials;
                return response;
            }).catch(e => {
                delete this._checkingCredentials;
                throw e;
            });
        return this._checkingCredentials;
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

    bestClientTools(): Promise<ClientTools> {
        return this.fetchBuild().then(build => {
            logger.info(`Locating Client Tools.${os.EOL}`);
            return this.locateClientTools(undefined, build);
        }).catch(e => {
            return undefined;
        });
    }

    locateClientTools(fileUri?: vscode.Uri, build = ""): Promise<ClientTools> {
        const eclConfig = vscode.workspace.getConfiguration("ecl", fileUri);
        const currentWorkspace = fileUri ? vscode.workspace.getWorkspaceFolder(fileUri) : undefined;
        const currentWorkspacePath = currentWorkspace ? currentWorkspace.uri.fsPath : "";
        const includeFolders = this.calcIncludeFolders(currentWorkspacePath);
        const args = [...this.eclccArgs];
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
                showEclStatus(localize("Unknown"), false, localize("Unable to locate eclcc"));
            }
            return clientTools;
        });
    }

    checkSyntax(fileUri: vscode.Uri): Promise<CheckResponse> {
        reporter.sendTelemetryEvent("launchConfig.checkSyntax.start");
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
                    reporter.sendTelemetryEvent("launchConfig.checkSyntax.success", {}, { "errorCount": errors.all().length });
                    return { errors: errors.all(), checked: errors.checked() };
                }).catch(e => {
                    logger.debug(`syntaxCheck-reject:  ${fileUri.fsPath} ${e.msg}`);
                    reporter.sendTelemetryErrorEvent("launchConfig.checkSyntax.fail", { "message": e?.msg });
                    vscode.window.showInformationMessage(`${localize("Syntax check exception")}:  ${fileUri.fsPath} ${e.msg}`);
                    return Promise.resolve({ errors: [], checked: [] });
                });
            }
        }).catch(e => {
            vscode.window.showInformationMessage(localize('Unable to locate "eclcc" binary.  Ensure ECL ClientTools is installed.'));
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

    targetClusters(): Promise<WsTopology.TpLogicalCluster[]> {
        return this.checkCredentials().then(credentials => {
            const topology = Topology.attach(this.opts(credentials));
            return topology.fetchLogicalClusters();
        });
    }

    wuQuery(request: Partial<WsWorkunits.WUQuery>): Promise<Workunit[]> {
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

    digitalKeys() {
        return this.checkCredentials().then(credentials => {
            const csService = new CodesignService(this.opts(credentials));
            return csService.ListUserIDs({});
        });
    }

    sign(key: string, passphrase: string, ecl: string) {
        return this.checkCredentials().then(credentials => {
            const csService = new CodesignService(this.opts(credentials));
            return csService.Sign({
                SigningMethod: "gpg",
                UserID: key,
                KeyPass: passphrase,
                Text: ecl
            });
        });
    }

    verify(ecl: string) {
        return this.checkCredentials().then(credentials => {
            const csService = new CodesignService(this.opts(credentials));
            return csService.Verify({
                Text: ecl
            });
        });
    }

    bundleList() {
        return this.locateClientTools().then((clientTools) => {
            return clientTools.bundleList();
        });
    }

    bundleInstall(bundleUrl: string): Promise<IExecFile> {
        return this.locateClientTools().then((clientTools) => {
            return clientTools.bundleInstall(bundleUrl);
        });
    }

    bundleUninstall(name: string): Promise<IExecFile> {
        return this.locateClientTools().then((clientTools) => {
            return clientTools.bundleUninstall(name);
        });
    }

    async submit(fileUri: vscode.Uri, targetCluster: string, mode: LaunchMode) {
        // const args = await this.localResolveDebugConfiguration(filePath);
        // logger.debug("launchRequest:  " + JSON.stringify(args));
        reporter.sendTelemetryEvent("launchConfig.submit.start");
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: localize("Submit ECL"),
            cancellable: false
        }, (progress, token) => {
            const filePath = fileUri.fsPath;
            logger.info(`Fetch build version.${os.EOL}`);
            const pathParts = path.parse(filePath);
            let failedWU: Workunit;
            reporter.sendTelemetryEvent("launchConfig.submit.fetchBuild");
            return this.fetchBuild().then(build => {
                progress.report({ increment: 10, message: localize("Locating Client Tools") });
                logger.info(`Locating Client Tools.${os.EOL}`);
                reporter.sendTelemetryEvent("launchConfig.submit.locateClientTools");
                return this.locateClientTools(fileUri, build);
            }).then((clientTools) => {
                progress.report({ increment: 10, message: localize("Creating Archive") });
                logger.info(`Client Tools:  ${clientTools.eclccPath}.${os.EOL}`);
                logger.info(`Generating archive.${os.EOL}`);
                if (mode === "submitNoArchive" || pathParts.ext.toLowerCase() === ".xml") {
                    reporter.sendTelemetryEvent("launchConfig.submit.rawFile");
                    return rawFile(filePath);
                } else {
                    reporter.sendTelemetryEvent("launchConfig.submit.createArchive");
                    return clientTools.createArchive(filePath);
                }
            }).then(archive => {
                progress.report({ increment: 10, message: localize("Verifying Archive") });
                if (this.abortSubmitOnError && archive.err.hasError()) {
                    reporter.sendTelemetryEvent("launchConfig.submit.abortSubmitOnError");
                    throw new Error(`${localize("ECL Syntax Error(s)")}:\n  ${archive.err.errors().map(e => e.msg).join("\n  ")}`);
                } else if (archive.content.length === 0) {
                    reporter.sendTelemetryErrorEvent("launchConfig.submit.EmptyArchive");
                    throw new Error(`${localize("Empty Archive")}:\n  ${archive.err.all().map(e => e.msg).join("\n  ")}`);
                }
                logger.info(`Archive Size: ${archive.content.length}.${os.EOL}`);
                return archive;
            }).then(archive => {
                progress.report({ increment: 10, message: localize("Creating Workunit") });
                logger.info(`Creating workunit.${os.EOL}`);
                reporter.sendTelemetryEvent("launchConfig.submit.createWorkunit");
                return this.createWorkunit().then(wu => {
                    failedWU = wu;
                    return [wu, archive] as [Workunit, any];
                });
            }).then(([wu, archive]) => {
                // eslint-disable-next-line no-async-promise-executor
                progress.report({ increment: 10, message: `${localize("Updating Workunit")} ${wu.Wuid}` });
                // eslint-disable-next-line no-async-promise-executor
                return new Promise<Workunit>(async (resolve, reject) => {
                    const attempts = 3;
                    let lastError;
                    for (let retry = 1; retry <= attempts; ++retry) {
                        progress.report({ increment: 3, message: `${localize("Updating Workunit")} ${wu.Wuid} (${retry} of ${attempts})` });
                        logger.info(`Updating workunit (${retry} of ${attempts}).${os.EOL}`);
                        reporter.sendTelemetryEvent("launchConfig.submit.update", {}, { "attempt": retry });
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
                    reporter.sendTelemetryErrorEvent("launchConfig.submit.update", { "message": lastError?.message });
                    reject(lastError);
                });
            }).then((wu) => {
                progress.report({ increment: 10, message: `${localize("Submitting workunit")} ${wu.Wuid}` });
                logger.info(`Submitting workunit:  ${wu.Wuid}.${os.EOL}`);
                reporter.sendTelemetryEvent("launchConfig.submit.submit");
                return wu.submit(targetCluster, action(mode), this.resultLimit);
            }).then((wu) => {
                progress.report({ increment: 10, message: `${localize("Submitted workunit")} ${wu.Wuid}` });
                logger.info(`Submitted:  ${this.wuDetailsUrl(wu.Wuid)}.${os.EOL}`);
                failedWU = undefined;
                reporter.sendTelemetryEvent("launchConfig.submit.success");
                return wu;
            }).catch(e => {
                reporter.sendTelemetryErrorEvent("launchConfig.submit.catch", { "message": e?.message });
                logger.info(`Launch failed - ${e.message}.${os.EOL}`);
                logger.debug("launchConfig.submit");
                if (failedWU) {
                    failedWU.setToFailed();
                    return failedWU;
                }
                throw e;
            });
        });
    }
}

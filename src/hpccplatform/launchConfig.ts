import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import { AccountService, Activity, CodesignService, Workunit, WsWorkunits, WUUpdate, WsTopology, Topology, EclccErrors, IOptions, LogicalFile, attachWorkspace, IECLErrorWarning, locateClientTools, ClientTools, WorkunitsService, DFUService, WsDfu, WsCodesign } from "@hpcc-js/comms";
import { join, scopedLogger } from "@hpcc-js/util";
import { LaunchMode, LaunchProtocol, LaunchRequestArguments } from "../debugger/launchRequestArguments";
import { showEclStatus } from "../ecl/clientTools";
import localize from "../util/localize";
import { readFile } from "../util/fs";
import { reporter } from "../telemetry";
import { formatWorkunitURL, formatResultURL } from "../ecl/util";
import { LaunchConfigState, credentialManager, Credentials } from "../util/credentialManager";

export const NO_SELECTION = "no selection";
const MAX_LOGIN_ATTEMPTS = 3;

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
        g_launchConfigurations = {
            [NO_SELECTION]: {
                name: NO_SELECTION,
                type: "ecl",
                protocol: "http",
                serverAddress: "",
                port: 0,
                targetCluster: "",
                path: ""
            }
        };

        if (vscode.workspace.workspaceFolders) {
            for (const wuf of vscode.workspace.workspaceFolders) {
                gatherServers(wuf, vscode.workspace.workspaceFolders.length);
            }
        } else {
            gatherServers();
        }
    }
    return Object.values(g_launchConfigurations);
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
        const eclConfig = vscode.workspace.getConfiguration("ecl", null);
        retVal = eclConfig.get(key);
    } else if (typeof retVal === "string" && retVal.indexOf(configPrefix) === 0) {
        const configKey = retVal.substring(configPrefix.length, retVal.length - 1);
        const eclConfig = vscode.workspace.getConfiguration("ecl", null);
        retVal = eclConfig.get(configKey);
    }
    if (retVal === undefined) {
        retVal = defaultValue;
    }
    return retVal;
}

export function espUrl(launchRequestArgs: { protocol: LaunchProtocol, serverAddress: string, port: number, path: string }) {
    return join(`${launchRequestArgs.protocol}://${launchRequestArgs.serverAddress}:${launchRequestArgs.port}/`, launchRequestArgs.path);
}

export function wuDetailsUrl(launchRequestArgs: { protocol: LaunchProtocol, serverAddress: string, port: number, path: string }, wuid: string) {
    return formatWorkunitURL(espUrl(launchRequestArgs), wuid);
}

export function wuResultUrl(launchRequestArgs: { protocol: LaunchProtocol, serverAddress: string, port: number, path: string }, wuid: string, name: string) {
    return formatResultURL(espUrl(launchRequestArgs), wuid, name);
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

const configPrefix = "${config:ecl.";

export interface CheckResponse {
    errors: IECLErrorWarning[];
    checked: string[];
}

export class LaunchConfig implements LaunchRequestArguments {

    private readonly _lcID: string;
    private _user: string;
    private _credentials: Credentials;

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
        if (!this._user) {
            this._user = config(this._lcID, "user", "vscode_user");
        }
        return this._user;
    }

    get baseUrl() {
        return `${this.protocol}://${this.serverAddress}:${this.port}`;
    }

    get espUrl() {
        return join(this.baseUrl, this.path);
    }

    constructor(lcID: string) {
        this._lcID = lcID;
    }

    //  Credentials  ---
    async deleteCredentials() {
        this._credentials = undefined;
        const credentials = await this.getStoredCredentials();
        if (credentials) {
            await credentials.delete();
        }
    }

    async getStoredCredentials(user?: string): Promise<Credentials | undefined> {
        return await credentialManager.getCredentials(this.baseUrl, user ?? this.user);
    }

    private async updateCredentials(user: string, password: string, verified: boolean): Promise<Credentials> {
        this._user = user;
        this._credentials = await credentialManager.getCredentials(this.baseUrl, user);
        this._credentials.password = password;
        this._credentials.verified = verified;
        return this._credentials;
    }

    private async updateLaunchConfigUser(newUser: string): Promise<void> {
        try {
            const launchConfig = vscode.workspace.getConfiguration("launch");
            const configurations = launchConfig.get<any[]>("configurations") || [];

            const configIndex = configurations.findIndex(config =>
                config.type === "ecl" && config.name === this.name.replace(/ \(.*\)$/, "")
            );

            if (configIndex !== -1) {
                configurations[configIndex].user = newUser;
                await launchConfig.update("configurations", configurations, vscode.ConfigurationTarget.Workspace);

                if (g_launchConfigurations[this._lcID]) {
                    g_launchConfigurations[this._lcID].user = newUser;
                }
            }
            this._user = newUser;
        } catch (error) {
            logger.debug("Failed to update launch configuration user: " + (error instanceof Error ? error.message : String(error)));
        }
    }

    private async checkProxy(opts: IOptions) {
        if (opts.baseUrl.indexOf("https:") === 0) {
            const config = vscode.workspace.getConfiguration(undefined, null);
            if (config.get("http.proxySupport") === "override") {
                const eclConfig = vscode.workspace.getConfiguration("ecl", null);
                const response = eclConfig.get("forceProxySupport") ? SET_FALLBACK : await vscode.window.showWarningMessage(PROXY_WARNING, { modal: true }, SET_FALLBACK);
                switch (response) {
                    case SET_FALLBACK:
                        await config.update("http.proxySupport", "fallback", true);
                        break;
                }
            }
        }
    }

    private async verifyUser(credentials: { user: string, password: string, verified: boolean }): Promise<LaunchConfigState> {
        if (credentials.verified) {
            return LaunchConfigState.Ok;
        }

        const opts = this.opts(credentials);
        await this.checkProxy(opts);

        const acService = new AccountService(opts);
        return acService.VerifyUser({
            application: "vscode-ecl",
            version: "2"
        }).then(() => {
            credentials.verified = true;
            return LaunchConfigState.Ok;
        }).catch(e => {
            logger.debug("verifyUser catch:  -->" + e?.message + "<--");
            if (e?.cause?.message) {
                logger.debug(e.cause.message);
            }
            //  old client version warning  ---
            if (e.isESPExceptions && e.Exception.some((exception) => exception.Code === 20043)) {
                credentials.verified = true;
                return LaunchConfigState.Ok;
            }
            credentials.verified = false;
            return e?.message.indexOf("ECONNREFUSED") >= 0 ? LaunchConfigState.Unreachable : LaunchConfigState.CredentialsRequired;
        });
    }

    async pingServerXXX(timeout: number = 5000): Promise<LaunchConfigState> {
        const credentials = await this.checkCredentials();
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
                return e === "timeout" ? LaunchConfigState.Unreachable : LaunchConfigState.CredentialsRequired;
            });
    }

    private async promptUserID(attempt: number, attemptOf: number, currentUser?: string): Promise<string> {
        const user = await vscode.window.showInputBox({
            prompt: localize("User ID"),
            title: `Login to ${this.name} (attempt ${attempt} of ${attemptOf})`,
            password: false,
            value: currentUser ?? ""
        }) || "";
        return user;
    }

    private async promptPassword(attempt: number, attemptOf: number, currentPassword?: string): Promise<string> {
        const password = await vscode.window.showInputBox({
            prompt: localize("Password"),
            title: `Login to ${this.name} (attempt ${attempt} of ${attemptOf})`,
            password: true,
            value: currentPassword ?? ""
        }) || "";
        return password;
    }

    protected async _checkCredentials(): Promise<Credentials> {
        if (!this.name || this.name === NO_SELECTION) {
            vscode.commands.executeCommand("setContext", "ecl.connected", false);
            throw new Error(localize("No Selected ECL Launch configuration."));
        }

        const storedCreds = await this.getStoredCredentials();
        const launchConfigState: LaunchConfigState = storedCreds ? await this.verifyUser(storedCreds) : LaunchConfigState.Unknown;
        switch (launchConfigState) {
            case LaunchConfigState.Ok:
                vscode.commands.executeCommand("setContext", "ecl.connected", true);
                return storedCreds;
            case LaunchConfigState.CredentialsRequired:
                for (let i = 0; i < MAX_LOGIN_ATTEMPTS; ++i) {
                    const configUser = this.user;
                    const user = await this.promptUserID(i + 1, MAX_LOGIN_ATTEMPTS, storedCreds?.user);
                    if (user) {
                        const storedCreds = await this.getStoredCredentials(user);
                        const password = await this.promptPassword(i + 1, MAX_LOGIN_ATTEMPTS, storedCreds?.password);
                        if (password) {
                            const credentials = { user, password, verified: false };
                            if (await this.verifyUser(credentials) === LaunchConfigState.Ok) {
                                const credentials = await this.updateCredentials(user, password, true);
                                if (user !== configUser) {
                                    const updateConfig = await vscode.window.showInformationMessage(
                                        localize("You signed in as '{0}' but the launch configuration has '{1}' as the default user. Would you like to update the launch configuration to remember '{0}' as the default user?").replaceAll("{0}", user).replaceAll("{1}", configUser),
                                        { modal: true },
                                        localize("Yes, update default"),
                                        localize("No, keep current")
                                    );

                                    if (updateConfig === localize("Yes, update default")) {
                                        await this.updateLaunchConfigUser(user);
                                    }
                                }
                                credentials.verified = true;
                                vscode.commands.executeCommand("setContext", "ecl.connected", true);
                                return credentials;
                            }
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                vscode.commands.executeCommand("setContext", "ecl.connected", false);
                throw new Error(localize("Invalid Credentials."));
            case LaunchConfigState.Unknown:
            case LaunchConfigState.Unreachable:
            default:
                vscode.commands.executeCommand("setContext", "ecl.connected", false);
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
                const args = [...this.eclccSyntaxArgs];
                return clientTools.syntaxCheck(fileUri.fsPath, args).then((errors) => {
                    if (errors.hasUnknown()) {
                        logger.warning(`syntaxCheck-warning:  ${fileUri.fsPath} ${errors.unknown().toString()}`);
                    }
                    logger.debug(`syntaxCheck-resolve:  ${fileUri.fsPath} ${errors.errors().length} total.`);
                    reporter.sendTelemetryEvent("launchConfig.checkSyntax.success", {}, { "errorCount": errors.all().length });
                    return { errors: errors.all(), checked: errors.checked() };
                }).catch(e => {
                    logger.debug(`checkSyntax-exception:  ${fileUri.fsPath} ${e?.message}`);
                    reporter.sendTelemetryErrorEvent("launchConfig.checkSyntax.fail", { "message": e?.message });
                    vscode.window.showErrorMessage(`${localize("Syntax check exception")}: ${e?.message} (eclcc -syntax ${args.join(" ")} ${fileUri.fsPath})`);
                    return Promise.resolve({ errors: [], checked: [] });
                });
            }
        }).catch(e => {
            vscode.window.showInformationMessage(localize('Unable to locate "eclcc" binary.  Ensure ECL ClientTools is installed.'));
            return Promise.resolve({ errors: [], checked: [] });
        });
    }

    //  Misc  ---
    opts(credentials: { user: string, password: string }): IOptions {
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

    findLogicalFiles(pattern: string): Promise<WsDfu.DFULogicalFile[]> {
        return this.checkCredentials().then(credentials => {
            const service = new DFUService(this.opts(credentials));
            return service.DFUQuery({ LogicalName: pattern }).then(response => {
                return response.DFULogicalFiles.DFULogicalFile;
            }).catch(e => {
                logger.warning(e);
                return [];
            });
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
            return csService.ListUserIDs({}).then(response => response?.UserIDs?.Item ?? []);
        });
    }

    sign(key: string, passphrase: string, ecl: string) {
        return this.checkCredentials().then(credentials => {
            const csService = new CodesignService(this.opts(credentials));
            return csService.Sign({
                SigningMethod: WsCodesign.SigningMethodType.gpg,
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

                progress.report({ increment: 10, message: `${localize("Updating Workunit")} ${wu.Wuid}` });
                // eslint-disable-next-line no-async-promise-executor
                return new Promise<Workunit>(async (resolve, reject) => {
                    const attempts = MAX_LOGIN_ATTEMPTS;
                    let lastError;
                    for (let retry = 1; retry <= attempts; ++retry) {
                        progress.report({ increment: MAX_LOGIN_ATTEMPTS, message: `${localize("Updating Workunit")} ${wu.Wuid} (${retry} of ${attempts})` });
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
                logger.info(`Launch failed - ${e?.message}.${os.EOL}`);
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

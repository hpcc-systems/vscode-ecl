import * as vscode from "vscode";
import { WsWorkunits, Workunit, ClientTools, type IOptions } from "@hpcc-js/comms";
import { scopedLogger } from "@hpcc-js/util";
import { launchConfigurations, LaunchConfig, LaunchRequestArguments, espUrl, wuDetailsUrl, wuResultUrl, CheckResponse, launchConfiguration, IExecFile } from "./launchConfig";
import { LaunchConfigState, credentialManager, Credentials } from "../util/credentialManager";
import { LaunchMode } from "../debugger/launchRequestArguments";
import localize from "../util/localize";
import { eclTempFile } from "../util/fs";

const logger = scopedLogger("hpccplatform/session.ts");

const isMultiRoot = () => vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 1;

class Session {
    private _launchConfig: LaunchConfig;
    private _targetCluster?: string;

    constructor(id: string, targetCluster?: string) {
        this._launchConfig = new LaunchConfig(id);
        this._targetCluster = targetCluster;
    }

    get id() {
        return this._launchConfig.id;
    }

    get name() {
        return this._launchConfig.name;
    }

    get launchRequestArgs(): LaunchRequestArguments {
        return this._launchConfig;
    }

    get userID() {
        return this._launchConfig.user;
    }

    get targetCluster() {
        return this._targetCluster || this._launchConfig.targetCluster;
    }

    get overriddenTargetCluster() {
        return this._targetCluster;
    }

    targetClusters() {
        return this._launchConfig.targetClusters();
    }

    baseUrl() {
        return espUrl(this._launchConfig);
    }

    wuDetailsUrl(wuid: string) {
        return wuDetailsUrl(this._launchConfig, wuid);
    }

    wuResultUrl(wuid: string, name: string) {
        return wuResultUrl(this._launchConfig, wuid, name);
    }

    wuQuery(request: Partial<WsWorkunits.WUQuery>): Promise<Workunit[]> {
        return this._launchConfig.wuQuery(request);
    }

    bestClientTools(): Promise<ClientTools> {
        return this._launchConfig.bestClientTools();
    }

    locateClientTools(): Promise<ClientTools> {
        return this._launchConfig.locateClientTools();
    }

    checkSyntax(uri: vscode.Uri) {
        return this._launchConfig.checkSyntax(uri);
    }

    submit(uri: vscode.Uri, mode: LaunchMode = "submit") {
        return this._launchConfig.submit(uri, this.targetCluster, mode);
    }

    findLogicalFiles(pattern: string) {
        return this._launchConfig.findLogicalFiles(pattern);
    }

    fetchRecordDef(lf: string) {
        return this._launchConfig.fetchRecordDef(lf);
    }

    digitalKeys() {
        return this._launchConfig.digitalKeys();
    }

    sign(key: string, passphrase: string, ecl: string) {
        return this._launchConfig.sign(key, passphrase, ecl);
    }

    pingXXX(force = false) {
        return this._launchConfig.pingServerXXX();
    }

    verify(ecl: string) {
        return this._launchConfig.verify(ecl);
    }

    bundleList() {
        return this._launchConfig.bundleList();
    }

    bundleInstall(bundleUrl: string): Promise<IExecFile> {
        return this._launchConfig.bundleInstall(bundleUrl);
    }

    bundleUninstall(name: string): Promise<IExecFile> {
        return this._launchConfig.bundleUninstall(name);
    }

    async options(): Promise<IOptions> {
        const credentials = await this.getStoredCredentials();
        if (!credentials) {
            throw new Error("No stored credentials available");
        }

        return {
            baseUrl: credentials.baseUrl,
            userID: credentials.user,
            password: credentials.password,
            rejectUnauthorized: this.launchRequestArgs?.rejectUnauthorized ?? true,
            timeoutSecs: this.launchRequestArgs?.timeoutSecs ?? 60
        };
    }

    async getStoredCredentials(): Promise<Credentials | undefined> {
        return this._launchConfig.getStoredCredentials();
    }

    async checkCredentials(): Promise<Credentials | undefined> {
        return this._launchConfig.checkCredentials();
    }

    async deleteCredentials(): Promise<void> {
        this._launchConfig.deleteCredentials();
    }
}

export interface ICreateWorkunit {
    source: "editor" | "notebook" | "debugger";
    workunit: Workunit
}

export let sessionManager: SessionManager;

export class SessionManager {

    private _ctx: vscode.ExtensionContext;
    private _globalSession?: Session;
    private _pinnedSession?: Session;

    private _onDidChangeSession: vscode.EventEmitter<LaunchRequestArguments> = new vscode.EventEmitter<LaunchRequestArguments>();
    readonly onDidChangeSession: vscode.Event<LaunchRequestArguments> = this._onDidChangeSession.event;

    private _onDidCreateWorkunit: vscode.EventEmitter<ICreateWorkunit> = new vscode.EventEmitter<ICreateWorkunit>();
    readonly onDidCreateWorkunit: vscode.Event<ICreateWorkunit> = this._onDidCreateWorkunit.event;

    private _statusBarLaunch: vscode.StatusBarItem;
    private _statusBarTargetCluster: vscode.StatusBarItem;
    private _statusBarPin: vscode.StatusBarItem;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this._statusBarLaunch = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE + 2);
        this._statusBarLaunch.command = "hpccPlatform.switch";
        this._statusBarTargetCluster = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE + 1);
        this._statusBarTargetCluster.command = "hpccPlatform.switchTargetCluster";

        this._statusBarPin = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE);
        this._statusBarPin.command = "hpccPlatform.pin";

        vscode.commands.registerCommand("hpccPlatform.pin", async () => {
            const eclConfig = vscode.workspace.getConfiguration("ecl", null);
            const activeUri: string = vscode.window.activeTextEditor?.document?.uri.toString(true) || "";
            if (activeUri) {
                const pinnedLaunchConfigurations = eclConfig.get<object>("pinnedLaunchConfigurations");
                if (pinnedLaunchConfigurations[activeUri]) {
                    pinnedLaunchConfigurations[activeUri] = undefined;
                    this._pinnedSession = undefined;
                } else {
                    this._pinnedSession = new Session(this.session.id, this.session.overriddenTargetCluster);
                    pinnedLaunchConfigurations[activeUri] = { launchConfiguration: this.session.id, targetCluster: this.session.overriddenTargetCluster };
                }
                await eclConfig.update("pinnedLaunchConfigurations", pinnedLaunchConfigurations);
                this.updateSettings();
                this.refreshStatusBar();
            }
        });

        vscode.commands.registerCommand("hpccPlatform.switch", async () => {
            this.switch();
        });

        vscode.commands.registerCommand("hpccPlatform.switchTargetCluster", async () => {
            this.switchTargetCluster();
        });

        vscode.commands.registerCommand("hpccPlatform.eclwatch", async () => {
            vscode.env.openExternal(vscode.Uri.parse(`${this.session.baseUrl()}/esp/files/stub.htm`));
        });

        vscode.commands.registerCommand("hpccPlatform.login", async () => {
            await this.login();
        });

        vscode.commands.registerCommand("hpccPlatform.logout", async () => {
            await this.logout();
        });

        vscode.window.onDidChangeActiveTextEditor(() => {
            const prevBaseUrl = this.session.baseUrl();
            this._pinnedSession = undefined;
            if (this.isActiveECL) {
                const eclConfig = vscode.workspace.getConfiguration("ecl", null);
                const pinnedLaunchConfiguration = eclConfig.get<object>("pinnedLaunchConfigurations")[this.activePath];
                const launchConfigName = pinnedLaunchConfiguration?.launchConfiguration;
                if (launchConfigName) {
                    const pinnedConfig = launchConfiguration(launchConfigName);
                    if (pinnedConfig) {
                        this._pinnedSession = new Session(pinnedConfig.name, pinnedLaunchConfiguration?.targetCluster);
                    }
                }
            }
            if (prevBaseUrl !== this.session.baseUrl()) {
                this._onDidChangeSession.fire(this.session.launchRequestArgs);
            }
            this.refreshStatusBar();
        });

        vscode.debug.onDidReceiveDebugSessionCustomEvent(async event => {
            const id = `${event.session.name} (${event.session.workspaceFolder.name})`;
            const { targetCluster } = event.body;
            switch (event.event) {
                case "LaunchRequest":
                    if (this.session.id !== id) {
                        this.switchTo(id, targetCluster);
                    }
                    if (this.session && this.isActiveECL) {
                        vscode.window.showWarningMessage(`${localize("Submitting ECL via the Run/Debug page is being deprecated.  Please use the new Submit + Compile buttons at the top of the ECL Editor")}.`);
                        this.session.submit(this.activeUri).then(wu => {
                            this._onDidCreateWorkunit.fire({ source: "debugger", workunit: wu });
                        });
                    }
                    break;
            }
        });

        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration("launch")) {
                launchConfigurations(true);
                const currentConfig = launchConfiguration(this.session?.id);
                if (currentConfig && this.session) {
                    void this.switchTo(this.session.id, this.session.overriddenTargetCluster);
                }
            }
        });

        const eclConfig = vscode.workspace.getConfiguration("ecl", null);
        const settingsLaunchConfig = eclConfig.get<string>("launchConfiguration");
        const launchConfig = this._ctx.workspaceState.get<string>("ecl.launchConfiguration") || settingsLaunchConfig;
        const targetClusters = this._ctx.workspaceState.get<Record<string, string>>("ecl.targetCluster") || eclConfig.get<object>("targetCluster");
        const targetCluster = targetClusters[launchConfig];

        this.switchTo(launchConfig, targetCluster).then(() => {
            vscode.commands.executeCommand("setContext", "hpccPlatformActive", true);
        }).finally(() => {
            this.onDidChangeSession(() => {
                this.refreshStatusBar();
            });
        });
    }

    static attach(ctx: vscode.ExtensionContext): SessionManager {
        if (!sessionManager) {
            sessionManager = new SessionManager(ctx);
        }
        return sessionManager;
    }

    private get activeDocument() {
        return vscode.window.activeTextEditor?.document;
    }

    private get activeUri() {
        return this.activeDocument?.uri;
    }

    private get activePath() {
        return this.activeUri?.toString(true);
    }

    private get activeFsPath() {
        return this.activeUri?.fsPath;
    }

    private get isActiveECL() {
        return this.activeDocument && this.activeDocument.languageId === "ecl";
    }

    private get pinnedSession() {
        const activeUri = this.activePath;
        if (activeUri) {
            const eclConfig = vscode.workspace.getConfiguration("ecl", null);
            const pinnedLaunchConfigurations = eclConfig.get<object>("pinnedLaunchConfigurations");
            return pinnedLaunchConfigurations[activeUri];
        }
    }

    get session(): Session | undefined {
        return this._pinnedSession || this._globalSession;
    }

    set session(session: Session) {
        if (this._pinnedSession) {
            this._pinnedSession = session;
        } else {
            this._globalSession = session;
        }
    }

    bestClientTools(): Promise<ClientTools> {
        if (this.session) {
            return this.session.bestClientTools();
        }
        return Promise.resolve(undefined);
    }

    wuDetailsUrl(wuid: string) {
        return this.session.wuDetailsUrl(wuid);
    }

    wuResultUrl(wuid: string, name: string) {
        return this.session?.wuResultUrl(wuid, name);
    }

    wuQuery(request: Partial<WsWorkunits.WUQuery>): Promise<Workunit[]> {
        if (this.session) {
            return this.session.wuQuery(request);
        }
        return Promise.resolve([]);
    }

    checkSyntax(uri: vscode.Uri): Promise<CheckResponse> {
        if (this.session) {
            return this.session.checkSyntax(uri);
        }
        return Promise.resolve({
            errors: [],
            checked: []
        });
    }

    nbSubmitURI(uri: vscode.Uri, mode: LaunchMode = "submit"): Promise<Workunit> | undefined {
        if (this.session) {
            return this.session.submit(uri, mode).then(wu => {
                this._onDidCreateWorkunit.fire({ source: "notebook", workunit: wu });
                return wu;
            });
        }
    }

    submitURI(uri: vscode.Uri, mode: LaunchMode = "submit") {
        if (this.session) {
            return this.session.submit(uri, mode).then(wu => {
                this._onDidCreateWorkunit.fire({ source: "editor", workunit: wu });
                return wu;
            }).catch(e => {
                vscode.window.showErrorMessage(e.message);
            });
        }
    }

    async submit(context: vscode.ExtensionContext, doc: vscode.TextDocument, mode: LaunchMode = "submit") {
        if (this.session) {
            const eclConfig = vscode.workspace.getConfiguration("ecl", null);
            if (eclConfig.get("saveOnSubmit", false)) {
                await doc.save();
            }
            const tmpFile = await eclTempFile(context, doc);
            try {
                await this.submitURI(tmpFile.uri, mode);
            } finally {
                tmpFile.dispose();
            }
        }
    }

    async switchTo(id?: string, targetCluster?: string) {
        const rawConfig = launchConfiguration(id);
        if (rawConfig) {
            try {
                await credentialManager.migrateLaunchConfigIfNeeded(rawConfig);
            } catch (error) {
                logger.error(`Failed to migrate credentials during switchTo: ${error}`);
            }
        }

        if (!this.session || this.session.id !== id) {
            const configs = launchConfigurations().map(lc => lc.name);
            const launchID = configs.indexOf(id) >= 0 ? id : configs[0];
            if (launchID) {
                this.session = new Session(launchID, targetCluster);
                this._onDidChangeSession.fire(this.session.launchRequestArgs);
            }
        }
        if (this.session.overriddenTargetCluster !== targetCluster) {
            this.session = new Session(this.session.id, targetCluster);
        }

        this.updateSettings();

        if (this.session) {
            const storedCreds = await this.session.getStoredCredentials();
            if (storedCreds?.password) {
                await this.refreshStatusBar(LaunchConfigState.Ok);
            } else {
                await this.refreshStatusBar(LaunchConfigState.CredentialsRequired);
            }
        } else {
            await this.refreshStatusBar(LaunchConfigState.Unknown);
        }
    }

    updateSettings() {
        const eclConfig = vscode.workspace.getConfiguration("ecl", null);
        if (this._pinnedSession) {
            const activeUri = this.activePath;
            if (activeUri) {
                const pinnedLaunchConfigurations = eclConfig.get<object>("pinnedLaunchConfigurations");
                const currentPinned = pinnedLaunchConfigurations[activeUri];
                if (currentPinned?.launchConfiguration !== this.session.id ||
                    currentPinned?.targetCluster !== this.session.overriddenTargetCluster) {
                    pinnedLaunchConfigurations[activeUri] = { launchConfiguration: this.session.id, targetCluster: this.session.overriddenTargetCluster };
                    eclConfig.update("pinnedLaunchConfigurations", pinnedLaunchConfigurations);
                }
            }
        } else {
            const currentLaunchConfig = this._ctx.workspaceState.get<string>("ecl.launchConfiguration");
            const targetClusters = this._ctx.workspaceState.get<Record<string, string>>("ecl.targetCluster") || {};
            const currentTargetCluster = targetClusters[this.session.id];

            if (currentLaunchConfig !== this.session.id) {
                void this._ctx.workspaceState.update("ecl.launchConfiguration", this.session.id);
            }
            if (currentTargetCluster !== this.session.overriddenTargetCluster) {
                targetClusters[this.session.id] = this.session.overriddenTargetCluster;
                void this._ctx.workspaceState.update("ecl.targetCluster", targetClusters);
            }
        }
    }

    switch(): void {
        const configs = launchConfigurations().map(lc => lc.name);

        const input = vscode.window.createQuickPick<{ id: string, label: string }>();
        input.items = configs.map(id => {
            return {
                id,
                label: isMultiRoot() ? id : launchConfiguration(id).name,
            };
        });

        // Set current launch config as active item
        const currentId = this.session?.id;
        if (currentId) {
            const currentItem = input.items.find(item => item.id === currentId);
            if (currentItem) {
                input.activeItems = [currentItem];
            }
        }

        input.onDidChangeSelection(async items => {
            const item = items[0];
            if (item) {
                await this.switchTo(item.id);
            }
            input.hide();
        });
        input.show();
    }

    switchTargetCluster(): void {
        if (this.session) {
            this.session.targetClusters().then(targetClusters => {
                const input = vscode.window.createQuickPick();
                input.items = [{ label: localize("Auto Detect") }, ...targetClusters.map(tc => {
                    return {
                        label: tc.Name
                    };
                })];

                // Set current target cluster as active item
                const currentCluster = this.session.overriddenTargetCluster || this.session.targetCluster;
                if (currentCluster) {
                    const currentItem = input.items.find(item => item.label === currentCluster);
                    if (currentItem) {
                        input.activeItems = [currentItem];
                    }
                } else {
                    // If no override, select Auto Detect
                    input.activeItems = [input.items[0]];
                }

                input.onDidChangeSelection(async items => {
                    const item = items[0];
                    if (item) {
                        await this.switchTo(this.session.id, item.label === localize("Auto Detect") ? undefined : item.label);
                    }
                    input.hide();
                });
                input.show();
            });
        }
    }

    async login() {
        if (!this.session) {
            vscode.window.showWarningMessage(localize("No HPCC Platform connection available"));
            return;
        }

        try {
            await this.session.checkCredentials();
            vscode.window.showInformationMessage(localize("Successfully logged in to HPCC Platform"));
            vscode.commands.executeCommand("hpccPlatform.userRefresh");
            await this.refreshStatusBar(LaunchConfigState.Ok);
        } catch (error) {
            vscode.window.showErrorMessage(localize("Login failed") + `: ${error instanceof Error ? error.message : String(error)}`);
            await this.refreshStatusBar(LaunchConfigState.CredentialsRequired);
        }
    }

    async logout() {
        if (!this.session) {
            vscode.window.showWarningMessage(localize("No HPCC Platform connection available"));
            return;
        }

        try {
            await this.session.deleteCredentials();
            await this.switchTo();

            vscode.window.showInformationMessage(localize("Successfully logged out from HPCC Platform"));
        } catch (error) {
            vscode.window.showErrorMessage(localize("Logout failed") + `: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    refreshPinStatusBar() {
        let isPinned = false;
        const activeUri: string = vscode.window.activeTextEditor?.document?.uri.toString(true) || "";
        if (activeUri) {
            const eclConfig = vscode.workspace.getConfiguration("ecl", null);
            const pinnedLaunchConfigurations = eclConfig.get<object>("pinnedLaunchConfigurations");
            isPinned = !!pinnedLaunchConfigurations[activeUri];
        }
        this._statusBarPin.text = isPinned ? "$(pinned)" : "$(pin)";
        this._statusBarPin.tooltip = (isPinned ? localize("Unpin") : localize("Pin")) + ` ${localize("launch configuration to current document")}.`;
        if (this.isActiveECL) {
            this._statusBarPin.show();
        } else {
            this._statusBarPin.hide();
        }
    }

    stateIcon(state: LaunchConfigState): string {
        switch (state) {
            case LaunchConfigState.CredentialsRequired:
                return "$(key)";
            case LaunchConfigState.Ok:
                return "$(pass-filled)";
            case LaunchConfigState.Unreachable:
                return "$(error)";
            case LaunchConfigState.Unknown:
            default:
                return "$(question)";
        }
    }

    refreshLaunchStatusBar(state: LaunchConfigState) {
        this._statusBarLaunch.text = `${this.stateIcon(state)} ${isMultiRoot() ? this.session?.id : this.session?.name}`;
        this._statusBarLaunch.tooltip = localize("HPCC Platform Launch Configuration");
        if (this.isActiveECL) {
            this._statusBarLaunch.show();
        } else {
            this._statusBarLaunch.hide();
        }
    }

    refreshTCStatusBar() {
        this._statusBarTargetCluster.text = this.session.targetCluster;
        this._statusBarTargetCluster.tooltip = localize("HPCC Platform Target Cluster");
        if (this.isActiveECL) {
            this._statusBarTargetCluster.show();
        } else {
            this._statusBarTargetCluster.hide();
        }
    }

    async refreshStatusBar(state: LaunchConfigState = LaunchConfigState.Unknown) {
        if (state === LaunchConfigState.Unknown) {
            const creds = await this.session?.getStoredCredentials();
            state = creds?.verified ? LaunchConfigState.Ok : LaunchConfigState.CredentialsRequired;
        }
        this.refreshLaunchStatusBar(state);
        this.refreshTCStatusBar();
        this.refreshPinStatusBar();
    }
}

export function isPlatformConnected(): boolean {
    return !!sessionManager.session;
}

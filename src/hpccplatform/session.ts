import * as vscode from "vscode";
import { WsWorkunits, Workunit, ClientTools } from "@hpcc-js/comms";
import { launchConfigurations, LaunchConfig, LaunchRequestArguments, espUrl, wuDetailsUrl, wuResultUrl, CheckResponse, launchConfiguration, IExecFile } from "./launchConfig";
import { LaunchConfigState, LaunchMode } from "../debugger/launchRequestArguments";
import localize from "../util/localize";
import { ECL_MODE } from "../mode";
import { eclTempFile } from "../util/fs";

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

    get password() {
        return this._launchConfig.password;
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

    fetchRecordDef(lf: string) {
        return this._launchConfig.fetchRecordDef(lf);
    }

    digitalKeys() {
        return this._launchConfig.digitalKeys();
    }

    sign(key: string, passphrase: string, ecl: string) {
        return this._launchConfig.sign(key, passphrase, ecl);
    }

    ping(force = false) {
        return this._launchConfig.pingServer();
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
}

export interface ICreateWorkunit {
    source: "editor" | "notebook" | "debugger";
    workunit: Workunit
}

class SessionManager {

    private _globalSession?: Session;
    private _pinnedSession?: Session;

    private _onDidChangeSession: vscode.EventEmitter<LaunchRequestArguments> = new vscode.EventEmitter<LaunchRequestArguments>();
    readonly onDidChangeSession: vscode.Event<LaunchRequestArguments> = this._onDidChangeSession.event;

    private _onDidCreateWorkunit: vscode.EventEmitter<ICreateWorkunit> = new vscode.EventEmitter<ICreateWorkunit>();
    readonly onDidCreateWorkunit: vscode.Event<ICreateWorkunit> = this._onDidCreateWorkunit.event;

    private _onDidPing: vscode.EventEmitter<LaunchConfigState> = new vscode.EventEmitter<LaunchConfigState>();
    readonly onDidPing: vscode.Event<LaunchConfigState> = this._onDidPing.event;

    private _statusBarLaunch: vscode.StatusBarItem;
    private _statusBarTargetCluster: vscode.StatusBarItem;
    private _statusBarPin: vscode.StatusBarItem;

    constructor() {
        this._statusBarLaunch = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE + 2);
        this._statusBarLaunch.command = "hpccPlatform.switch";

        this._statusBarTargetCluster = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE + 1);
        this._statusBarTargetCluster.command = "hpccPlatform.switchTargetCluster";

        this._statusBarPin = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_VALUE);
        this._statusBarPin.command = "hpccPlatform.pin";

        vscode.commands.registerCommand("hpccPlatform.pin", async () => {
            const eclConfig = vscode.workspace.getConfiguration("ecl");
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

        vscode.window.onDidChangeActiveTextEditor(() => {
            const prevBaseUrl = this.session.baseUrl();
            this._pinnedSession = undefined;
            if (this.isActiveECL) {
                const eclConfig = vscode.workspace.getConfiguration("ecl");
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
                const launchConfig = eclConfig.get<string>("launchConfiguration");
                const targetCluster = eclConfig.get<object>("targetCluster")[launchConfig];
                this.switchTo(launchConfig, targetCluster);
            }

            if (e.affectsConfiguration("ecl.pingInterval")) {
                this.monitorConnection();
            }
        });

        const eclConfig = vscode.workspace.getConfiguration("ecl");
        const launchConfig = eclConfig.get<string>("launchConfiguration");
        const targetCluster = eclConfig.get<object>("targetCluster")[launchConfig];
        this.switchTo(launchConfig, targetCluster);
        //  Don't load HPCC Platform tree until session is fully initialized
        vscode.commands.executeCommand("setContext", "hpccPlatformActive", true);

        this.onDidPing(state => {
            this.refreshStatusBar(state);
        });
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
            const eclConfig = vscode.workspace.getConfiguration("ecl");
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

    async submit(doc: vscode.TextDocument, mode: LaunchMode = "submit") {
        if (this.session) {
            const eclConfig = vscode.workspace.getConfiguration("ecl");
            if (eclConfig.get("saveOnSubmit", false)) {
                await doc.save();
            }
            const tmpFile = await eclTempFile(doc);
            try {
                await this.submitURI(tmpFile.uri, mode);
            } finally {
                tmpFile.dispose();
            }
        }
    }

    async updateConnection() {
        const state = (await this.session?.ping(true)) || LaunchConfigState.Unknown;
        vscode.commands.executeCommand("setContext", "ecl.connected", state === LaunchConfigState.Ok);
        this._onDidPing.fire(state);
    }

    protected _monitor = {};
    monitorConnection() {
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        const pingInterval = eclConfig.get("pingInterval", 5);
        for (const key in this._monitor) {
            clearInterval(this._monitor[key]);
        }
        this.updateConnection();
        if (!isNaN(pingInterval) && pingInterval > 0) {
            this._monitor[this.session.id] = setInterval(() => {
                this.updateConnection();
            }, pingInterval * 1000);
        }
    }

    switchTo(id?: string, targetCluster?: string) {
        if (!this.session || this.session.id !== id) {
            vscode.commands.executeCommand("setContext", "ecl.connected", false);
            this._onDidPing.fire(LaunchConfigState.Unknown);
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
        this.refreshStatusBar();
        this.monitorConnection();
    }

    updateSettings() {
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        if (this._pinnedSession) {
            const activeUri = this.activePath;
            if (activeUri) {
                const pinnedLaunchConfigurations = eclConfig.get<object>("pinnedLaunchConfigurations");
                pinnedLaunchConfigurations[activeUri] = { launchConfiguration: this.session.id, targetCluster: this.session.overriddenTargetCluster };
                eclConfig.update("pinnedLaunchConfigurations", pinnedLaunchConfigurations);
            }
        } else {
            eclConfig.update("launchConfiguration", this.session.id);
            const targetClusters = eclConfig.get<object>("targetCluster");
            targetClusters[this.session.id] = this.session.overriddenTargetCluster;
            eclConfig.update("targetCluster", targetClusters);
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

        input.onDidChangeSelection(async items => {
            const item = items[0];
            if (item) {
                this.switchTo(item.id);
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

                input.onDidChangeSelection(async items => {
                    const item = items[0];
                    if (item) {
                        this.switchTo(this.session.id, item.label === localize("Auto Detect") ? undefined : item.label);
                    }
                    input.hide();
                });
                input.show();
            });
        }
    }

    refreshPinStatusBar() {
        let isPinned = false;
        const activeUri: string = vscode.window.activeTextEditor?.document?.uri.toString(true) || "";
        if (activeUri) {
            const eclConfig = vscode.workspace.getConfiguration("ecl");
            isPinned = false;
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
            case LaunchConfigState.Credentials:
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
        this._statusBarTargetCluster.tooltip = localize("HPCC Platform TargetCluster");
        if (this.isActiveECL) {
            this._statusBarTargetCluster.show();
        } else {
            this._statusBarTargetCluster.hide();
        }
    }

    refreshStatusBar(state: LaunchConfigState = LaunchConfigState.Unknown) {
        this.refreshLaunchStatusBar(state);
        this.refreshTCStatusBar();
        this.refreshPinStatusBar();
    }
}
export const sessionManager: SessionManager = new SessionManager();

import * as vscode from "vscode";
import { WUQuery, Workunit, ClientTools } from "@hpcc-js/comms";
import { launchConfigurations, LaunchConfig, LaunchRequestArguments, espUrl, wuDetailsUrl, wuResultUrl, CheckResponse, launchConfiguration } from "./launchConfig";
import { ECL_MODE } from "../mode";

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

    get launchRequestArgs(): Readonly<LaunchRequestArguments> {
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

    wuResultUrl(wuid: string, sequence: number) {
        return wuResultUrl(this._launchConfig, wuid, sequence);
    }

    wuQuery(request: WUQuery.Request): Promise<Workunit[]> {
        return this._launchConfig.wuQuery(request);
    }

    locateClientTools(): Promise<ClientTools> {
        return this._launchConfig.locateClientTools();
    }

    checkSyntax(uri: vscode.Uri) {
        return this._launchConfig.checkSyntax(uri);
    }

    submit(uri: vscode.Uri) {
        return this._launchConfig.submit(uri, this.targetCluster, "submit");
    }

    compile(uri: vscode.Uri) {
        return this._launchConfig.submit(uri, this.targetCluster, "compile");
    }

    fetchRecordDef(lf: string) {
        return this._launchConfig.fetchRecordDef(lf);
    }
}

class SessionManager {

    private _globalSession?: Session;
    private _pinnedSession?: Session;

    private _onDidChangeSession: vscode.EventEmitter<LaunchRequestArguments> = new vscode.EventEmitter<LaunchRequestArguments>();
    readonly onDidChangeSession: vscode.Event<LaunchRequestArguments> = this._onDidChangeSession.event;

    private _onDidCreateWorkunit: vscode.EventEmitter<Workunit> = new vscode.EventEmitter<Workunit>();
    readonly onDidCreateWorkunit: vscode.Event<Workunit> = this._onDidCreateWorkunit.event;

    private _statusBarPin: vscode.StatusBarItem;
    private _statusBarLaunch: vscode.StatusBarItem;
    private _statusBarTargetCluster: vscode.StatusBarItem;

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
                    const pinnedConfig = launchConfigurations()[launchConfigName];
                    if (pinnedConfig) {
                        this._pinnedSession = new Session(pinnedConfig, pinnedLaunchConfiguration?.targetCluster);
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
                        vscode.window.showWarningMessage("Submitting ECL via the Run/Debug page is being depricated.  Please use the new Submit + Compile buttons at the top of the ECL Editor.");
                        this.session.submit(this.activeUri).then(wu => {
                            this._onDidCreateWorkunit.fire(wu);
                        });
                    }
                    break;
            }
        });

        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration("launch")) {
                launchConfigurations(true);
            }
        });

        const eclConfig = vscode.workspace.getConfiguration("ecl");
        const launchConfig = eclConfig.get<string>("launchConfiguration");
        const targetCluster = eclConfig.get<object>("targetCluster")[launchConfig];
        this.switchTo(launchConfig, targetCluster);
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
        return vscode.languages.match(ECL_MODE, this.activeDocument) > 0;
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

    locateClientTools(): Promise<ClientTools> {
        if (this.session) {
            return this.session.locateClientTools();
        }
        return Promise.resolve(undefined);
    }

    wuDetailsUrl(wuid: string) {
        return this.session.wuDetailsUrl(wuid);
    }

    wuResultUrl(wuid: string, sequence: number) {
        return this.session?.wuResultUrl(wuid, sequence);
    }

    wuQuery(request: WUQuery.Request): Promise<Workunit[]> {
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

    submit(doc: vscode.TextDocument) {
        if (this.session) {
            return this.session.submit(doc.uri).then(wu => {
                this._onDidCreateWorkunit.fire(wu);
                return wu;
            }).catch(e => {
                vscode.window.showErrorMessage(e.message);
            });
        }
    }

    compile(doc: vscode.TextDocument) {
        if (this.session) {
            return this.session.compile(doc.uri).then(wu => {
                this._onDidCreateWorkunit.fire(wu);
                return wu;
            }).catch(e => {
                vscode.window.showErrorMessage(e.message);
            });
        }
    }

    switchTo(id?: string, targetCluster?: string) {
        if (!this.session || this.session.id !== id) {
            const configs = launchConfigurations();
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
        const configs = launchConfigurations();

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
                input.items = [{ label: "Auto Detect" }, ...targetClusters.map(tc => {
                    return {
                        label: tc.Name
                    };
                })];

                input.onDidChangeSelection(async items => {
                    const item = items[0];
                    if (item) {
                        this.switchTo(this.session.id, item.label === "Auto Detect" ? undefined : item.label);
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
        this._statusBarPin.tooltip = (isPinned ? "Unpin" : "Pin") + " launch configutation to current document.";
        this.isActiveECL ? this._statusBarPin.show() : this._statusBarPin.hide();
    }

    refreshLaunchStatusBar() {
        if (isMultiRoot()) {
            this._statusBarLaunch.text = this.session?.id;
        } else {
            this._statusBarLaunch.text = this.session?.name;
        }
        this._statusBarLaunch.tooltip = "HPCC Platform Launch Configuration";
        this.isActiveECL ? this._statusBarLaunch.show() : this._statusBarLaunch.hide();
    }

    refreshTCStatusBar() {
        this._statusBarTargetCluster.text = this.session.targetCluster;
        this._statusBarTargetCluster.tooltip = "HPCC Platform TargetCluster";
        this.isActiveECL ? this._statusBarTargetCluster.show() : this._statusBarTargetCluster.hide();
    }

    refreshStatusBar() {
        this.refreshPinStatusBar();
        this.refreshLaunchStatusBar();
        this.refreshTCStatusBar();
    }
}
export const sessionManager: SessionManager = new SessionManager();

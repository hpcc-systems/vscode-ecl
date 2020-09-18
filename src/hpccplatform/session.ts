import * as vscode from "vscode";
import { WUQuery, Workunit } from "@hpcc-js/comms";
import { LaunchConfig, LaunchRequestArguments, espUrl, wuDetailsUrl, wuResultUrl } from "./launchConfig";
import { ECL_MODE } from "../mode";

class Session {
    private _launchRequestArgs: LaunchRequestArguments;
    private _launchConfig: LaunchConfig;
    private _targetCluster?: string;

    constructor(launchRequestArgs: LaunchRequestArguments, targetCluster?: string) {
        this._launchRequestArgs = launchRequestArgs;
        this._launchConfig = new LaunchConfig(launchRequestArgs);
        this._targetCluster = targetCluster;
    }

    get name() {
        return this._launchRequestArgs.name;
    }

    get launchRequestArgs() {
        return this._launchRequestArgs;
    }

    get userID() {
        return this._launchRequestArgs.user;
    }

    get targetCluster() {
        return this._targetCluster || this._launchRequestArgs.targetCluster;
    }

    get overriddenTargetCluster() {
        return this._targetCluster;
    }

    targetClusters() {
        return this._launchConfig.targetClusters();
    }

    baseUrl() {
        return espUrl(this._launchRequestArgs);
    }

    wuDetailsUrl(wuid: string) {
        return wuDetailsUrl(this._launchRequestArgs, wuid);
    }

    wuResultUrl(wuid: string, sequence: number) {
        return wuResultUrl(this._launchRequestArgs, wuid, sequence);
    }

    wuQuery(request: WUQuery.Request): Promise<Workunit[]> {
        return this._launchConfig.wuQuery(request);
    }

    submit(fsPath: string) {
        return this._launchConfig.submit(fsPath, this.targetCluster, "submit");
    }

    compile(fsPath: string) {
        return this._launchConfig.submit(fsPath, this.targetCluster, "compile");
    }
}

class SessionManager {

    private _globalSession?: Session;
    private _pinnedSession?: Session;

    private _isActiveECL: boolean = false;

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
                    this._pinnedSession = new Session(this.session.launchRequestArgs, this.session.overriddenTargetCluster);
                    pinnedLaunchConfigurations[activeUri] = { launchConfiguration: this.session.name, targetCluster: this.session.overriddenTargetCluster };
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

        vscode.commands.registerCommand("ecl.submit", () => {
            this.submit(vscode.window.activeTextEditor.document);
        });

        vscode.commands.registerCommand("ecl.compile", () => {
            this.compile(vscode.window.activeTextEditor.document);
        });

        vscode.window.onDidChangeActiveTextEditor(() => {
            const prevBaseUrl = this.session.baseUrl();
            const activeUri: string = this.activeUri;
            this._pinnedSession = undefined;
            if (activeUri) {
                const eclConfig = vscode.workspace.getConfiguration("ecl");
                const pinnedLaunchConfiguration = eclConfig.get<object>("pinnedLaunchConfigurations")[activeUri];
                const launchConfigName = pinnedLaunchConfiguration?.launchConfiguration;
                if (launchConfigName) {
                    const pinnedConfig = this.configurations()[launchConfigName];
                    if (pinnedConfig) {
                        this._pinnedSession = new Session(pinnedConfig, pinnedLaunchConfiguration?.targetCluster);
                    }
                }
            }
            this._isActiveECL = vscode.window.activeTextEditor && vscode.languages.match(ECL_MODE, vscode.window.activeTextEditor.document) > 0;
            if (prevBaseUrl !== this.session.baseUrl()) {
                this._onDidChangeSession.fire(this.session.launchRequestArgs);
            }
            this.refreshStatusBar();
        });

        vscode.debug.onDidReceiveDebugSessionCustomEvent(async event => {
            const launchRequestArgs = event.session.configuration as unknown as LaunchRequestArguments;
            switch (event.event) {
                case "LaunchRequest":
                    if (this.session.name !== event.session.name) {
                        this.switchTo(event.session.name, launchRequestArgs.targetCluster);
                    }
                    if (this.session) {
                        this.session.submit(launchRequestArgs.program).then(wu => {
                            this._onDidCreateWorkunit.fire(wu);
                        });
                    }
                    break;
            }
        });

        this._isActiveECL = vscode.window.activeTextEditor && vscode.languages.match(ECL_MODE, vscode.window.activeTextEditor.document) > 0;

        const eclConfig = vscode.workspace.getConfiguration("ecl");
        const launchConfig = eclConfig.get<string>("launchConfiguration");
        const targetCluster = eclConfig.get<object>("targetCluster")[launchConfig];
        this.switchTo(launchConfig, targetCluster);
    }

    private get activeUri() {
        return vscode.window.activeTextEditor?.document?.uri.toString(true) || "";
    }

    private get pinnedSession() {
        const activeUri = this.activeUri;
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

    submit(doc: vscode.TextDocument) {
        if (this.session) {
            return this.session.submit(doc.uri.fsPath).then(wu => {
                this._onDidCreateWorkunit.fire(wu);
                return wu;
            });
        }
    }

    compile(doc: vscode.TextDocument) {
        if (this.session) {
            return this.session.compile(doc.uri.fsPath).then(wu => {
                this._onDidCreateWorkunit.fire(wu);
                return wu;
            });
        }
    }

    configurations() {
        const retVal: { [name: string]: LaunchRequestArguments } = {};

        function gatherServers(uri?: vscode.Uri) {
            const eclLaunch = vscode.workspace.getConfiguration("launch", uri);
            if (eclLaunch.has("configurations")) {
                for (const launchConfig of eclLaunch.get<any[]>("configurations")!) {
                    if (launchConfig.type === "ecl" && launchConfig.name) {
                        retVal[launchConfig.name] = launchConfig;
                    }
                }
            }
        }
        if (vscode.workspace.workspaceFolders) {
            for (const wuf of vscode.workspace.workspaceFolders) {
                gatherServers(wuf.uri);
            }
        } else {
            gatherServers();
        }
        return retVal;
    }

    switchTo(name?: string, targetCluster?: string) {
        if (!this.session || this.session.name !== name) {
            const configs = this.configurations();
            const launchRequestArgs = configs[name] || configs[Object.keys(configs)[0]];
            if (launchRequestArgs) {
                this.session = new Session(launchRequestArgs, targetCluster);
                this._onDidChangeSession.fire(this.session.launchRequestArgs);
            }
        }
        if (this.session.overriddenTargetCluster !== targetCluster) {
            this.session = new Session(this.session.launchRequestArgs, targetCluster);
        }
        this.updateSettings();
        this.refreshStatusBar();
    }

    updateSettings() {
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        if (this._pinnedSession) {
            const activeUri = this.activeUri;
            if (activeUri) {
                const pinnedLaunchConfigurations = eclConfig.get<object>("pinnedLaunchConfigurations");
                pinnedLaunchConfigurations[activeUri] = { launchConfiguration: this.session.name, targetCluster: this.session.overriddenTargetCluster };
                eclConfig.update("pinnedLaunchConfigurations", pinnedLaunchConfigurations);
            }
        } else {
            eclConfig.update("launchConfiguration", this.session.name);
            const targetClusters = eclConfig.get<object>("targetCluster");
            targetClusters[this.session.name] = this.session.overriddenTargetCluster;
            eclConfig.update("targetCluster", targetClusters);
        }
    }

    switch(): void {
        const configs = this.configurations();

        const input = vscode.window.createQuickPick();
        input.items = Object.keys(configs).map(name => {
            return {
                label: name
            };
        });

        input.onDidChangeSelection(async items => {
            const item = items[0];
            if (item) {
                this.switchTo(item.label);
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
                        this.switchTo(this.session.name, item.label === "Auto Detect" ? undefined : item.label);
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
        this._isActiveECL ? this._statusBarPin.show() : this._statusBarPin.hide();
    }

    refreshLaunchStatusBar() {
        this._statusBarLaunch.text = this.session?.name;
        this._statusBarLaunch.tooltip = "HPCC Platform Launch Configuration";
        this._isActiveECL ? this._statusBarLaunch.show() : this._statusBarLaunch.hide();
    }

    refreshTCStatusBar() {
        this._statusBarTargetCluster.text = this.session.targetCluster;
        this._statusBarTargetCluster.tooltip = "HPCC Platform TargetCluster";
        this._isActiveECL ? this._statusBarTargetCluster.show() : this._statusBarTargetCluster.hide();
    }

    refreshStatusBar() {
        this.refreshPinStatusBar();
        this.refreshLaunchStatusBar();
        this.refreshTCStatusBar();
    }
}
export const sessionManager: SessionManager = new SessionManager();

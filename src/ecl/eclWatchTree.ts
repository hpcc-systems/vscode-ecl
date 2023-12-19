import { Workunit, WUStateID, Result, WUInfo, WUDetails } from "@hpcc-js/comms";
import * as vscode from "vscode";
import { sessionManager } from "../hpccplatform/session";
import localize from "../util/localize";
import { Item, Tree } from "./tree";
import { eclWatchPanelView } from "./eclWatchPanelView";
import { SaveData } from "./saveData";

const PrevWeeks: string[] = ["Last Week", "Two Weeks Ago", "Three Weeks Ago", "Four Weeks Ago", "Five Weeks Ago", "Six Weeks Ago", "Seven Weeks Ago"].map(localize);

export let eclWatchTree: ECLWatchTree;

export class ECLWatchTree extends Tree {

    _myWorkunits = true;
    _rendered = false;

    private constructor(ctx: vscode.ExtensionContext) {
        super(ctx, "hpccPlatform");

        this.updateMenu();

        sessionManager.onDidChangeSession(launchConfigArgs => {
            this.refresh();
        });

        sessionManager.onDidCreateWorkunit(evt => {
            vscode.commands.executeCommand("workbench.files.action.focusFilesExplorer");
            vscode.commands.executeCommand("hpccPlatform.focus");
            if (this._rendered) {
                this.refresh();
                const eclConfig = vscode.workspace.getConfiguration("ecl");
                const wuShowResults = eclConfig.get<string>("WUShowResults");
                switch (wuShowResults) {
                    case "disabled":
                        break;
                    case "external":
                        vscode.env.openExternal(vscode.Uri.parse(`${evt.workunit.BaseUrl}/esp/files/stub.htm?Widget=WUDetailsWidget&Wuid=${evt.workunit.Wuid}`));
                        break;
                    case "internal":
                    default:
                        if (evt.source !== "notebook") {
                            eclWatchPanelView.navigateTo(sessionManager.session.launchRequestArgs, evt.workunit.Wuid);
                        }
                        break;
                }
            }
        });

        vscode.commands.registerCommand("hpccPlatform.myWorkunits", async () => {
            this._myWorkunits = false;
            this.refresh();
        });

        vscode.commands.registerCommand("hpccPlatform.allWorkunits", async () => {
            this._myWorkunits = true;
            this.refresh();
        });

        vscode.commands.registerCommand("hpccPlatform.refresh", (element?: Item) => {
            this.refresh(element);
        });

        vscode.commands.registerCommand("hpccPlatform.openResults", (wuNode: ECLWUNode) => {
            wuNode.openResults();
        });

        vscode.commands.registerCommand("hpccPlatform.browseMetrics", (wuNode: ECLWUNode) => {
            wuNode.browseMetrics();
        });

        vscode.commands.registerCommand("hpccPlatform.browseECLWatch", (wuNode: ECLWUNode) => {
            wuNode.browseECLWatch();
        });

        vscode.commands.registerCommand("hpccPlatform.openECL", (wuNode: ECLWUNode) => {
            wuNode.openECL();
        });

        vscode.commands.registerCommand("hpccPlatform.copyWUID", (wuNode: ECLWUNode) => {
            wuNode.copyWuid();
        });

        vscode.commands.registerCommand("hpccPlatform.saveWUAs", (wuNode: ECLWUNode) => {
            wuNode.saveWUAs();
        });

        vscode.commands.registerCommand("hpccPlatform.abortWU", (wuNode: ECLWUNode) => {
            wuNode.abort();
        });

        vscode.commands.registerCommand("hpccPlatform.deleteWU", (wuNode: ECLWUNode) => {
            wuNode.delete();
        });

    }

    static attach(ctx: vscode.ExtensionContext) {
        if (!eclWatchTree) {
            eclWatchTree = new ECLWatchTree(ctx);
        }
        return eclWatchTree;
    }

    updateMenu() {
        vscode.commands.executeCommand("setContext", "hpccPlatform.isMyWorkunits", this._myWorkunits);
        vscode.commands.executeCommand("setContext", "hpccPlatform.isAllWorkunits", !this._myWorkunits);
    }

    refresh(element?: Item): void {
        this.updateMenu();
        super.refresh(element);
    }

    getRootChildren(): vscode.ProviderResult<Item<ECLWatchTree>[]> {
        this._treeView.title = `${localize("Loading")}...`;

        this._rendered = true;

        return sessionManager.wuQuery({
            Owner: this._myWorkunits ? sessionManager.session.userID : undefined,
            Sortby: "Wuid",
            Descending: false,
            Count: 1
        }).then(workunits => {
            let year = 1970;
            let month = 0;
            let day = 1;
            if (workunits.length) {
                const wuid = workunits[0].Wuid;
                year = parseInt(wuid.substring(1, 5));
                month = parseInt(wuid.substring(5, 7)) - 1;
                day = parseInt(wuid.substring(7, 9));
            }
            const oldestDay = new Date(year, month, day);
            const oldestWeek = new Date(year, month, day - 7);
            const oldestMonth = new Date(year, month, 1);
            const oldestYear = new Date(year, 0, 1);

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const retVal: Item<ECLWatchTree>[] = [];

            //  Days
            let currDate = now.getDate() - 1;
            let curr = new Date(now.getFullYear(), now.getMonth(), currDate);
            while (curr.getDay() !== 5 && curr >= oldestDay) {
                retVal.push(new ECLDateRangeNode(this, getDayName(curr), curr, new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 1)));
                curr = new Date(now.getFullYear(), now.getMonth(), --currDate);
            }

            //  Weeks
            let idx = 0;
            currDate -= 6;
            curr = new Date(now.getFullYear(), now.getMonth(), currDate);
            retVal.push(new ECLDateRangeNode(this, PrevWeeks[idx++], curr, new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 7)));
            while (curr.getMonth() === now.getMonth() && curr >= oldestWeek) {
                currDate -= 7;
                curr = new Date(now.getFullYear(), now.getMonth(), currDate);
                retVal.push(new ECLDateRangeNode(this, PrevWeeks[idx++], curr, new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 7)));
            }

            //  Months
            idx = 0;
            let currMonth = now.getMonth() - 1;
            curr = new Date(now.getFullYear(), currMonth, 1);
            while ((curr.getFullYear() === now.getFullYear() || idx < 1) && curr >= oldestMonth) {
                ++idx;
                retVal.push(new ECLDateRangeNode(this, getMonthName(curr), curr, new Date(curr.getFullYear(), curr.getMonth() + 1, 1)));
                curr = new Date(now.getFullYear(), --currMonth, 1);
            }

            //  Years
            let currYear = now.getFullYear() - 1;
            curr = new Date(currYear, 0, 1);
            while (curr >= oldestYear) {
                retVal.push(new ECLDateRangeNode(this, `${currYear}`, curr, new Date(curr.getFullYear() + 1, 0, 1)));
                curr = new Date(--currYear, 0, 1);
            }

            //  Today
            return sessionManager.wuQuery({
                Owner: this._myWorkunits ? sessionManager.session.userID : undefined,
                StartDate: today.toISOString(),
                Count: 999999
            }).then(workunits => {
                this._treeView.title = sessionManager.session.id;
                return [...workunits.map(wu => new ECLWUNode(this, wu)), ...retVal];
            }).catch(e => {
                this._treeView.title = sessionManager.session.id;
                return [new ECLErrorNode(this, e)];
            });
        }).catch(e => {
            this._treeView.title = sessionManager.session.id;
            return [new ECLErrorNode(this, e)];
        });
    }
}

//  https://microsoft.github.io/vscode-codicons/dist/codicon.html
export const Circle = {
    account: new vscode.ThemeIcon("account"),
    colorMode: new vscode.ThemeIcon("color-mode"),
    dashboard: new vscode.ThemeIcon("dashboard"),
    error: new vscode.ThemeIcon("error"),
    info: new vscode.ThemeIcon("info"),
    issueClosed: new vscode.ThemeIcon("issue-closed"),
    issueReopened: new vscode.ThemeIcon("issue-reopened"),
    issues: new vscode.ThemeIcon("issues"),
    pass: new vscode.ThemeIcon("pass"),
    play: new vscode.ThemeIcon("play-circle"),
    question: new vscode.ThemeIcon("question"),
    record: new vscode.ThemeIcon("record"),
    slash: new vscode.ThemeIcon("slash"),
    smiley: new vscode.ThemeIcon("smiley"),
    stop: new vscode.ThemeIcon("stop-circle"),
    sync: new vscode.ThemeIcon("sync"),
};

const globe = new vscode.ThemeIcon("globe");

class ECLErrorNode extends Item<ECLWatchTree> {

    constructor(tree: ECLWatchTree, private _error: Error) {
        super(tree);
    }

    getLabel(): string {
        return this._error.message;
    }

    iconPath() {
        return Circle.error;
    }
}

export class ECLResultNode extends Item<ECLWatchTree> {

    readonly url: string;
    readonly wu: Workunit;

    constructor(wu: Workunit, tree: ECLWatchTree, private _result: Result) {
        super(tree);
        this.url = `${this._result.BaseUrl}/?Widget=ResultWidget&Wuid=${this._result.Wuid}&Sequence=${this._result.Sequence}`;
        this.wu = wu;
    }

    getWU(): Workunit {
        return this.wu;
    }

    getResult(): Result {
        return this._result;
    }

    getLabel(): string {
        return this._result.Name;
    }

    getDescription(): string {
        return this._result.Value ?? "";
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.showWUDetails",
            arguments: [sessionManager.session.launchRequestArgs, this._result.Wuid, this._result.Sequence],
            title: localize("Open ECL Workunit Details")
        };
    }

    contextValue(): string {
        return "ECLResultNode";
    }
}

class ECLOutputsNode extends Item<ECLWatchTree> {

    constructor(tree: ECLWatchTree, private _wu: Workunit) {
        super(tree);
    }

    getLabel(): string {
        return localize("Outputs");
    }

    hasChildren() {
        return true;
    }

    getChildren() {
        return this._wu.fetchResults().then(results => results.map(result => new ECLResultNode(this._wu, this._tree, result)));
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.showWUDetails",
            arguments: [sessionManager.session.launchRequestArgs, this._wu.Wuid],
            title: localize("Open ECL Workunit Details")
        };
    }
}

export class ECLWUNode extends Item<ECLWatchTree> {
    private _wu: Workunit;

    readonly url: string;

    constructor(tree: ECLWatchTree, wu: Workunit) {
        super(tree);
        this._wu = wu;
        this.url = `${wu.BaseUrl}/?Widget=WUDetailsWidget&Wuid=${wu.Wuid}`;
        if (!this._wu.isComplete()) {
            this._wu.watchUntilComplete(changes => {
                tree.refresh(this);
            });
        }
    }

    getLabel(): string {
        return this._wu.Jobname || this._wu.Wuid;
    }

    getDescription(): string {
        const extras: string[] = [];
        if (this._wu.Jobname) {
            extras.push(this._wu.Wuid);
        }
        if (!this._tree._myWorkunits && this._wu.Owner) extras.push(this._wu.Owner);
        if (!this._wu.isComplete() || this._wu.isDeleted()) extras.push(this._wu.State);
        return extras.join(" ");
    }

    iconPath() {
        switch (this._wu.StateID) {
            case WUStateID.Compiled:
                return this._wu.isRunning() ? Circle.play : Circle.pass;
            case WUStateID.Running:
                return Circle.play;
            case WUStateID.Completed:
                return Circle.pass;
            case WUStateID.Failed:
                return Circle.error;
            case WUStateID.Archived:
                return Circle.info;
            case WUStateID.Aborting:
                return Circle.issues;
            case WUStateID.Aborted:
                return Circle.error;
            case WUStateID.Blocked:
                return Circle.record;
            case WUStateID.Submitted:
                return Circle.play;
            case WUStateID.Scheduled:
                return Circle.info;
            case WUStateID.Compiling:
                return Circle.play;
            case WUStateID.Wait:
                return Circle.record;
            case WUStateID.UploadingFiled:
                return Circle.info;
            case WUStateID.Paused:
                return Circle.record;
        }
        return Circle.question;
    }

    openResults() {
        eclWatchPanelView.navigateTo(sessionManager.session.launchRequestArgs, this._wu.Wuid);
    }

    browseMetrics() {
        vscode.env.openExternal(vscode.Uri.parse(this.url + "/metrics"));
    }

    browseECLWatch() {
        vscode.env.openExternal(vscode.Uri.parse(this.url));
    }

    openECL() {
        this._wu.fetchQuery().then((inf: WUInfo.Query) => {
            const ecl = inf.Text;
            vscode.workspace.openTextDocument({ content: ecl, language: "ecl" }).then(document => {
                vscode.window.showTextDocument(document);
            });
        });
    }

    copyWuid() {
        vscode.env.clipboard.writeText(this._wu.Wuid);
    }

    saveWUAs() {
        const saveData = new SaveData(this._wu);
        saveData.saveWUAs(this._wu);
    }

    abort() {
        this._wu.abort().then(() => this._tree.refresh(this));
    }

    delete() {
        this._wu.delete().then(() => this._tree.refresh());
    }

    hasChildren() {
        return true;
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.showWUDetails",
            arguments: [sessionManager.session.launchRequestArgs, this._wu.Wuid],
            title: localize("Open ECL Workunit Details")
        };
    }

    getChildren() {
        return this._wu.fetchResults().then(results => results.map(result => new ECLResultNode(this._wu, this._tree, result)));
    }

    contextValue(): string {
        return this._wu.isComplete() ? "ECLWUNodeComplete" : "ECLWUNode";
    }
}

class ECLDateRangeNode extends Item<ECLWatchTree> {
    _name: string;

    constructor(tree: ECLWatchTree, name: string, private _from: Date, private _to: Date) {
        super(tree);
        this._name = name;
    }

    getLabel(): string {
        return this._name;
    }

    iconPath() {
        return vscode.ThemeIcon.Folder;
    }

    hasChildren(): boolean {
        return true;
    }

    getChildren(): vscode.ProviderResult<ECLWUNode[]> {
        return sessionManager.wuQuery({
            Owner: this._tree._myWorkunits ? sessionManager.session.userID : undefined,
            StartDate: this._from.toISOString(),
            EndDate: this._to.toISOString(),
            Count: 999999
        }).then(workunits => {
            return workunits.map(wu => new ECLWUNode(this._tree, wu));
        }).catch(e => {
            return [];
        });
    }
}

function getDayName(date: Date) {
    return date.toLocaleDateString(vscode.env.language, { weekday: "long" });
}

function getMonthName(date: Date) {
    return date.toLocaleDateString(vscode.env.language, { month: "long" });
}

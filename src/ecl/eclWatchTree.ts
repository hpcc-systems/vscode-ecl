import { Workunit, WUStateID, Result } from "@hpcc-js/comms";
import * as vscode from "vscode";
import { sessionManager } from "../hpccplatform/session";

export let eclWatchTree: ECLWatchTree;

const PrevWeeks: string[] = ["Last Week", "Two Weeks Ago", "Three Weeks Ago", "Four Weeks Ago", "Five Weeks Ago", "Six Weeks Ago", "Seven Weeks Ago"];

export class ECLWatchTree implements vscode.TreeDataProvider<ECLNode> {
    _ctx: vscode.ExtensionContext;

    _onDidChangeTreeData: vscode.EventEmitter<ECLNode | null> = new vscode.EventEmitter<ECLNode | null>();
    readonly onDidChangeTreeData: vscode.Event<ECLNode | null> = this._onDidChangeTreeData.event;

    private _treeView: vscode.TreeView<ECLNode>;
    _myWorkunits = true;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        this.updateMenu();

        this._treeView = vscode.window.createTreeView("hpccPlatform", {
            treeDataProvider: this,
            showCollapseAll: true
        });

        sessionManager.onDidChangeSession(launchConfigArgs => {
            this.refresh();
        });

        sessionManager.onDidCreateWorkunit(wu => {
            vscode.commands.executeCommand("hpccPlatform.focus");
            this.refresh();
            const eclConfig = vscode.workspace.getConfiguration("ecl");
            if (eclConfig.get<boolean>("WUAutoOpen")) {
                vscode.env.openExternal(vscode.Uri.parse(`${wu.BaseUrl}/esp/files/stub.htm?Widget=WUDetailsWidget&Wuid=${wu.Wuid}`));
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

        vscode.commands.registerCommand("hpccPlatform.refresh", () => {
            this.refresh();
        });

        this._treeView.title = "Loading...";
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

    refresh(): void {
        this.updateMenu();
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(node: ECLNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        if (!node._treeItem) {
            node._treeItem = new vscode.TreeItem(node.getLabel(), node.initialCollapseState());
            node._treeItem.contextValue = node.constructor.name;
        } else {
            node._treeItem.label = node.getLabel();
        }
        node._treeItem.iconPath = node.iconPath();
        node._treeItem.command = node.command();
        return node._treeItem;
    }

    getChildren(element?: ECLNode): vscode.ProviderResult<ECLNode[]> {
        if (element) {
            return element.getChildren();
        }

        this._treeView.title = sessionManager.session.name;
        return sessionManager.wuQuery({
            Owner: this._myWorkunits ? sessionManager.session.userID : undefined,
            Sortby: "Wuid",
            Descending: false,
            Count: 1
        }).then(workunits => {
            if (workunits.length === 0) {
                return [];
            }
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

            const retVal: ECLNode[] = [];

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
                return [...workunits.map(wu => new ECLWUNode(this, wu)), ...retVal];
            }).catch(e => {
                return [new ECLErrorNode(this, e)];
            });
        }).catch(e => {
            return [new ECLErrorNode(this, e)];
        });
    }
}

//  https://microsoft.github.io/vscode-codicons/dist/codicon.html
const Circle = {
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

export class ECLNode {
    _tree: ECLWatchTree;
    _treeItem?: vscode.TreeItem;

    constructor(tree: ECLWatchTree) {
        this._tree = tree;
    }

    getLabel(): string {
        return "TODO";
    }

    hasChildren(): boolean {
        return false;
    }

    initialCollapseState(): vscode.TreeItemCollapsibleState {
        return this.hasChildren() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
    }

    getChildren(): vscode.ProviderResult<ECLNode[]> {
        return [];
    }

    command(): vscode.Command | undefined {
        return undefined;
    }

    iconPath(): vscode.ThemeIcon | undefined {
        return undefined;
    }
}

export class ECLErrorNode extends ECLNode {
    private _wu: Workunit;

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

export class ECLWebNode extends ECLNode {
    private _wu: Workunit;

    constructor(tree: ECLWatchTree, private _label: string) {
        super(tree);
    }

    getLabel(): string {
        return this._label;
    }

    iconPath() {
        return globe;
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.openWebSite",
            arguments: [sessionManager.wuDetailsUrl(this._wu.Wuid), this._wu.Wuid, true],
            title: "Open Web Site"
        };
    }

}

export class ECLResultNode extends ECLNode {

    readonly url: string;

    constructor(tree: ECLWatchTree, private _result: Result) {
        super(tree);
        this.url = `${this._result.BaseUrl}/?Widget=ResultWidget&Wuid=${this._result.Wuid}&Sequence=${this._result.Sequence}`;
    }

    getLabel(): string {
        return `${this._result.Name}:  ${this._result.Value}`;
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.openECLWatch",
            arguments: [sessionManager.session.launchRequestArgs, `${this._result.Name} - ${this._result.Wuid}`, this._result.Wuid, this._result.Sequence],
            title: "Open ECL Workunit Details"
        };
    }
}

class ECLOutputsNode extends ECLNode {

    constructor(tree: ECLWatchTree, private _wu: Workunit) {
        super(tree);
    }

    getLabel(): string {
        return "Outputs";
    }

    hasChildren() {
        return true;
    }

    getChildren() {
        return this._wu.fetchResults().then(results => results.map(result => new ECLResultNode(this._tree, result)));
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.openECLWatch",
            arguments: [sessionManager.session.launchRequestArgs, this._wu.Wuid, this._wu.Wuid],
            title: "Open ECL Workunit Details"
        };
    }
}

export class ECLWUNode extends ECLNode {
    private _wu: Workunit;

    readonly url: string;

    constructor(tree: ECLWatchTree, wu: Workunit) {
        super(tree);
        this._wu = wu;
        this.url = `${wu.BaseUrl}/?Widget=WUDetailsWidget&Wuid=${wu.Wuid}`;
        if (!this._wu.isComplete()) {
            let prevStateID;
            this._wu.watchUntilComplete(changes => {
                if (prevStateID !== this._wu.StateID) {
                    prevStateID = this._wu.StateID;
                    this._tree._onDidChangeTreeData.fire(this);
                }
            });
        }
    }

    getLabel(): string {
        let primary = this._wu.Wuid;
        const extras: string[] = [];
        if (!this._wu.isComplete()) extras.push(this._wu.State);
        if (!this._tree._myWorkunits && this._wu.Owner) extras.push(this._wu.Owner);
        if (this._wu.Jobname) {
            primary = this._wu.Jobname;
            extras.push(this._wu.Wuid);
        }
        return extras.length ? `${primary} (${extras.join(", ")})` : primary;
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

    hasChildren() {
        return true;
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.openECLWatch",
            arguments: [sessionManager.session.launchRequestArgs, this._wu.Wuid, this._wu.Wuid],
            title: "Open ECL Workunit Details"
        };
    }

    getChildren() {
        return this._wu.fetchResults().then(results => results.map(result => new ECLResultNode(this._tree, result)));
    }
}

export class ECLDateRangeNode extends ECLNode {
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

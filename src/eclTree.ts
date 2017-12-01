import { Workunit } from "@hpcc-js/comms";
import * as vscode from "vscode";
import { eclCommands } from "./eclCommand";
import { LaunchConfig } from "./util";

let eclTree: ECLTree;
class ECLNode {
    _tree: ECLTree;
    _treeItem: vscode.TreeItem;

    constructor(tree: ECLTree) {
        this._tree = tree;
    }

    getLabel(): string {
        return "TODO";
    }

    hasChildren(): boolean {
        return false;
    }

    getChildren(): vscode.ProviderResult<ECLNode[]> {
        return [];
    }

    command(): vscode.Command | undefined {
        return undefined;
    }
}

class ECLWUNode extends ECLNode {
    _baseUrl: string;
    _wu: Workunit;

    constructor(tree: ECLTree, baseUrl: string, wu: Workunit) {
        super(tree);
        this._baseUrl = baseUrl;
        this._wu = wu;
        if (!this._wu.isComplete()) {
            this._wu.watchUntilComplete(changes => {
                this._tree.refresh(true);
            });
        }
    }

    wuDetailsUrl() {
        return `${this._baseUrl}/?Wuid=${this._wu.Wuid}&Widget=WUDetailsWidget`;
    }

    getLabel(): string {
        return this._wu.isComplete() ? this._wu.Wuid : `${this._wu.Wuid} (${this._wu.State})`;
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.openWUDetails",
            arguments: [this.wuDetailsUrl(), this._wu.Wuid],
            title: "Open ECL Workunit Details"
        };
    }
}

class ECLRootNode extends ECLNode {
    _fsPath: string;
    _lastRefresh: number = 0;

    constructor(tree: ECLTree) {
        super(tree);
    }

    set(fsPath: string, force: boolean = false): boolean {
        if (this._fsPath !== fsPath || force) {
            this._fsPath = fsPath;
            this._lastRefresh = Date.now();
            return true;
        }
        if (Date.now() - this._lastRefresh > 5000) {
            this._lastRefresh = Date.now();
            return true;
        }
        return false;
    }

    getLabel(): string {
        return "root";
    }

    hasChildren(): boolean {
        return true;
    }

    baseUrl(config: any): string {
        return `${config.protocol}://${config.serverAddress}:${config.port}`;
    }

    gatherServers(retVal: string[], uri?: vscode.Uri) {
        const eclLaunch = vscode.workspace.getConfiguration("launch", uri);
        if (eclLaunch.has("configurations")) {
            for (const launchConfig of eclLaunch.get<any[]>("configurations")!) {
                if (launchConfig.type === "ecl" && launchConfig.name) {
                    const baseUrl = this.baseUrl(launchConfig);
                    if (retVal.indexOf(baseUrl) < 0)
                        retVal.push(baseUrl);
                }
            }
        }
    }

    getChildren(): vscode.ProviderResult<ECLWUNode[]> {
        if (!this._fsPath) return [];
        const servers: string[] = [];
        if (vscode.workspace.workspaceFolders) {
            for (const wuf of vscode.workspace.workspaceFolders) {
                this.gatherServers(servers, wuf.uri);
            }
        } else {
            this.gatherServers(servers);
        }

        return Promise.all(servers.map(server => Workunit.query({ baseUrl: server }, {
            ApplicationValues: {
                ApplicationValue: [{
                    Application: "vscode-ecl",
                    Name: "filePath",
                    Value: this._fsPath
                }]
            }
        }))).then(responses => {
            const retVal: ECLWUNode[] = [];
            for (let i = 0; i < responses.length; ++i) {
                const response = responses[i];
                for (const wu of response) {
                    retVal.push(new ECLWUNode(this._tree, servers[i], wu));
                }
            }
            return retVal;
        });
    }
}

export class ECLTree implements vscode.TreeDataProvider<ECLNode> {
    _ctx: vscode.ExtensionContext;
    _onDidChangeTreeData: vscode.EventEmitter<ECLNode | null> = new vscode.EventEmitter<ECLNode | null>();
    readonly onDidChangeTreeData: vscode.Event<ECLNode | null> = this._onDidChangeTreeData.event;

    _root = new ECLRootNode(this);

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;

        vscode.window.registerTreeDataProvider("eclWatch", this);
        vscode.window.onDidChangeActiveTextEditor(event => {
            this.refresh();
        });
        vscode.debug.onDidReceiveDebugSessionCustomEvent(event => {
            switch (event.event) {
                case "WUCreated":
                    this.refresh();
                    const eclConfig = vscode.workspace.getConfiguration("ecl");
                    if (eclConfig.get<boolean>("WUAutoOpen")) {
                        const launchConfig = new LaunchConfig(event.body);
                        eclCommands.openWUDetails(launchConfig.wuDetailsUrl(event.body.wuid), event.body.wuid);
                    }
                    break;
            }
        }, null, ctx.subscriptions);
        this.refresh();
    }

    static attach(ctx: vscode.ExtensionContext): ECLTree {
        if (!eclTree) {
            eclTree = new ECLTree(ctx);
        }
        return eclTree;
    }

    refresh(force: boolean = false): void {
        if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === "ecl") {
            const fsPath = vscode.window.activeTextEditor.document.uri.fsPath;
            if (fsPath && this._root.set(fsPath, force)) {
                this._onDidChangeTreeData.fire();
            }
        }
    }

    getTreeItem(node: ECLNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        if (!node._treeItem) {
            node._treeItem = new vscode.TreeItem(node.getLabel(), node.hasChildren() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
            node._treeItem.command = node.command();
        }
        return node._treeItem;
    }

    getChildren(element?: ECLNode): vscode.ProviderResult<ECLNode[]> {
        if (!element) {
            return this._root.getChildren();
        } else {
            return element.getChildren();
        }
    }
}

import { Workunit } from "@hpcc-js/comms";
import * as vscode from "vscode";
import { LaunchConfig, LaunchRequestArguments } from "./debugger/launchConfig";
import { eclCommands } from "./eclCommand";

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

    collapseState(): vscode.TreeItemCollapsibleState {
        return this.hasChildren() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
    }

    getChildren(): vscode.ProviderResult<ECLNode[]> {
        return [];
    }

    command(): vscode.Command | undefined {
        return undefined;
    }
}

const disabledLaunchConfig: { [name: string]: boolean } = {};

class ECLWUNode extends ECLNode {
    _launchNode: ECLLaunchNode;
    _wu: Workunit;

    constructor(launchNode: ECLLaunchNode, wu: Workunit) {
        super(launchNode._tree);
        this._launchNode = launchNode;
        this._wu = wu;
        if (!this._wu.isComplete()) {
            this._wu.watchUntilComplete(changes => {
                this._tree.refresh(true);
            });
        }
    }

    getLabel(): string {
        return this._wu.isComplete() ? this._wu.Wuid : `${this._wu.Wuid} (${this._wu.State})`;
    }

    command(): vscode.Command | undefined {
        return {
            command: "ecl.openWUDetails",
            arguments: [this._launchNode._launchConfig.wuDetailsUrl(this._wu.Wuid), this._wu.Wuid],
            title: "Open ECL Workunit Details"
        };
    }
}

class ECLLaunchNode extends ECLNode {
    _rootNode: ECLRootNode;
    _name: string;
    _launchConfig: LaunchConfig;

    constructor(rootNode: ECLRootNode, name: string, config: LaunchRequestArguments) {
        super(rootNode._tree);
        this._rootNode = rootNode;
        this._name = name;
        this._launchConfig = new LaunchConfig(config);
    }

    getLabel(): string {
        return this._name + (disabledLaunchConfig[this._name] ? " (unresponsive)" : "");
    }

    collapseState(): vscode.TreeItemCollapsibleState {
        return vscode.TreeItemCollapsibleState.Expanded;
    }

    getChildren(): vscode.ProviderResult<ECLWUNode[]> {
        if (disabledLaunchConfig[this._name]) return [];
        disabledLaunchConfig[this._name] = true;
        return this._launchConfig.query({
            Cluster: this._launchConfig._config.targetCluster,
            ApplicationValues: {
                ApplicationValue: [{
                    Application: "vscode-ecl",
                    Name: "filePath",
                    Value: this._rootNode._fsPath
                }]
            },
            Count: 5
        }).then(workunits => {
            disabledLaunchConfig[this._name] = false;
            return workunits.map(wu => new ECLWUNode(this, wu));
        }).catch(e => {
            return [];
        });
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

    getChildren(): vscode.ProviderResult<ECLLaunchNode[]> {
        const retVal: ECLLaunchNode[] = [];
        const context = this;
        function gatherServers(uri?: vscode.Uri) {
            const eclLaunch = vscode.workspace.getConfiguration("launch", uri);
            if (eclLaunch.has("configurations")) {
                for (const launchConfig of eclLaunch.get<any[]>("configurations")!) {
                    if (launchConfig.type === "ecl" && launchConfig.name) {
                        retVal.push(new ECLLaunchNode(context, launchConfig.name, launchConfig));
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

        return Promise.all(retVal.map(launchNode => {
            if (disabledLaunchConfig[launchNode._name] === undefined) {
                return launchNode._launchConfig.ping(3000).then(alive => {
                    disabledLaunchConfig[launchNode._name] = !alive;
                    return launchNode;
                });
            } else {
                return Promise.resolve(launchNode);
            }
        }));
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
            node._treeItem = new vscode.TreeItem(node.getLabel(), node.collapseState());
            node._treeItem.command = node.command();
        }
        /*
        treeItem.command = {
            command: 'extension.openJsonSelection',
            title: '',
            arguments: [new vscode.Range(this.editor.document.positionAt(node.offset), this.editor.document.positionAt(node.offset + node.length))]
        };
        treeItem.iconPath = this.getIcon(node);
        treeItem.contextValue = this.getNodeType(node);
        */
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

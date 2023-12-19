import { ExtensionContext, Event, EventEmitter, TreeItem, TreeDataProvider, Command, commands, env, ProviderResult, ThemeIcon, TreeItemCollapsibleState, TreeView, Uri, window, workspace } from "vscode";

export class Tree implements TreeDataProvider<Item> {
    _ctx: ExtensionContext;

    private _onDidChangeTreeData: EventEmitter<Item | undefined> = new EventEmitter<Item | undefined>();
    readonly onDidChangeTreeData: Event<Item | undefined> = this._onDidChangeTreeData.event;

    protected _treeView: TreeView<Item>;

    protected constructor(ctx: ExtensionContext, id: string, showCollapseAll = true) {
        this._ctx = ctx;

        this._treeView = window.createTreeView(id, {
            treeDataProvider: this,
            showCollapseAll: showCollapseAll
        });
    }

    refresh(element?: Item): void {
        this._onDidChangeTreeData.fire(element);
    }

    getTreeItem(node: Item): TreeItem | Thenable<TreeItem> {
        if (!node._treeItem) {
            node._treeItem = new TreeItem(node.getLabel(), node.initialCollapseState());
        } else {
            node._treeItem.label = node.getLabel();
        }
        node._treeItem.description = node.getDescription();
        node._treeItem.contextValue = node.contextValue();
        node._treeItem.iconPath = node.iconPath();
        node._treeItem.command = node.command();
        return node._treeItem;
    }

    getChildren(element?: Item): ProviderResult<Item[]> {
        if (element) {
            return element.getChildren();
        }
        return this.getRootChildren();
    }

    getRootChildren(element?: Item): ProviderResult<Item[]> {
        return [];
    }
}

export class Item<T extends Tree = Tree> {
    _tree: T;
    _treeItem?: TreeItem;

    constructor(tree: T) {
        this._tree = tree;
    }

    getLabel(): string {
        return "TODO";
    }

    getDescription(): string {
        return undefined;
    }

    hasChildren(): boolean {
        return false;
    }

    initialCollapseState(): TreeItemCollapsibleState {
        return this.hasChildren() ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None;
    }

    getChildren(): ProviderResult<Item[]> {
        return [];
    }

    command(): Command | undefined {
        return undefined;
    }

    iconPath(): ThemeIcon | undefined {
        return undefined;
    }

    contextValue(): string {
        return "Node";
    }
}
import type { WsDfu, XSDXMLNode } from "@hpcc-js/comms";
import * as vscode from "vscode";
import { sessionManager } from "../hpccplatform/session";
import localize from "../util/localize";
import { eclWatchPanelView } from "./eclWatchPanelView";
import { logicalFileChildren, logicalFileECL, type LogicalFileEntry, type LogicalFileScope } from "./logicalFiles";
import { Item, Tree } from "./tree";

let logicalFilesTree: LogicalFilesTree;
export class LogicalFilesTree extends Tree {

    protected constructor(ctx: vscode.ExtensionContext) {
        super(ctx, "hpccResources.logicalFiles");

        ctx.subscriptions.push(
            sessionManager.onDidChangeSession(() => this.refresh()),
            vscode.commands.registerCommand("hpccResources.logicalFiles.refresh", (item?: Item) => {
                this.refresh(item instanceof LogicalFileScopeItem ? item : undefined);
            }),
            vscode.commands.registerCommand("hpccResources.logicalFiles.view", (item?: Item) => {
                if (item instanceof LogicalFileItem) {
                    item.view();
                }
            }),
            vscode.commands.registerCommand("hpccResources.logicalFiles.openECL", async (item?: Item) => {
                if (item instanceof LogicalFileItem) {
                    await item.openECL();
                }
            }),
            vscode.commands.registerCommand("hpccResources.logicalFiles.copyName", async (item?: Item) => {
                if (item instanceof LogicalFileItem) {
                    await item.copyName();
                }
            }),
            vscode.commands.registerCommand("hpccResources.logicalFiles.copyRecord", async (item?: Item) => {
                if (item instanceof LogicalFileItem) {
                    await item.copyRecord();
                }
            })
        );
    }

    static attach(ctx: vscode.ExtensionContext): LogicalFilesTree {
        if (!logicalFilesTree) {
            logicalFilesTree = new LogicalFilesTree(ctx);
        }
        return logicalFilesTree;
    }

    getRootChildren() {
        return this.scopeChildren("");
    }

    async scopeChildren(scope: string): Promise<Item[]> {
        const session = sessionManager.session;
        if (!session?.launchRequestArgs?.serverAddress) {
            this._treeView.description = undefined;
            this._treeView.message = localize("Select an HPCC Platform launch configuration to browse logical files");
            return [];
        }
        this._treeView.description = session.name;
        this._treeView.message = undefined;
        try {
            const { scopes, files } = logicalFileChildren(await session.fetchLogicalFileScope(scope), scope);
            if (!scope && scopes.length === 0 && files.length === 0) {
                this._treeView.message = localize("No logical files found");
            }
            return [
                ...scopes.map(s => new LogicalFileScopeItem(this, s)),
                ...files.map(f => new LogicalFileItem(this, f))
            ];
        } catch (e) {
            return [new LogicalFileErrorItem(this, e instanceof Error ? e.message : String(e))];
        }
    }
}

class LogicalFileScopeItem extends Item<LogicalFilesTree> {

    constructor(tree: LogicalFilesTree, private _scope: LogicalFileScope) {
        super(tree);
    }

    getLabel() {
        return this._scope.label;
    }

    getTooltip() {
        return this._scope.scope;
    }

    hasChildren() {
        return true;
    }

    getChildren() {
        return this._tree.scopeChildren(this._scope.scope);
    }

    iconPath() {
        return new vscode.ThemeIcon("folder");
    }

    contextValue() {
        return "LogicalFileScope";
    }
}

class LogicalFileItem extends Item<LogicalFilesTree> {

    constructor(tree: LogicalFilesTree, private _entry: LogicalFileEntry) {
        super(tree);
    }

    get file(): WsDfu.DFULogicalFile {
        return this._entry.file;
    }

    getLabel() {
        return this._entry.label;
    }

    getDescription() {
        return this.file.RecordCount ? `${this.file.RecordCount}` : undefined;
    }

    hasChildren() {
        return true;
    }

    async getChildren(): Promise<Item[]> {
        try {
            const session = sessionManager.session;
            if (!session) {
                throw new Error(localize("Select an HPCC Platform launch configuration to browse logical files"));
            }
            const schema = await vscode.window.withProgress({
                location: { viewId: "hpccResources.logicalFiles" },
                title: localize("Fetching file fields")
            }, async () => session.fetchLogicalFileSchema(this.file.Name, this.file.NodeGroup));
            const fields = schema?.fields();
            if (!fields?.length) {
                throw new Error(localize("Fields are not available for this logical file"));
            }
            return fields.map(field => new LogicalFileFieldItem(this._tree, field));
        } catch (e) {
            return [new LogicalFileErrorItem(this._tree, e instanceof Error ? e.message : String(e))];
        }
    }

    getTooltip() {
        return [
            this.file.Name,
            this.file.Description,
            this.file.NodeGroup && `${localize("Cluster")}:  ${this.file.NodeGroup}`,
            this.file.RecordCount && `${localize("Records")}:  ${this.file.RecordCount}`,
            this.file.Totalsize && `${localize("Size")}:  ${this.file.Totalsize}`
        ].filter(Boolean).join("\n");
    }

    iconPath() {
        if (this.file.isSuperfile) {
            return new vscode.ThemeIcon("files");
        }
        return new vscode.ThemeIcon(this.file.ContentType === "key" ? "key" : "database");
    }

    contextValue() {
        return "LogicalFile";
    }

    command(): vscode.Command {
        return {
            command: "hpccResources.logicalFiles.view",
            title: localize("View Content"),
            arguments: [this]
        };
    }

    view() {
        const session = sessionManager.session;
        if (session) {
            eclWatchPanelView.navigateToLogicalFile(session.launchRequestArgs, this.file.Name, this.file.NodeGroup);
        }
    }

    async openECL() {
        const session = sessionManager.session;
        if (!session) return;
        try {
            const content = logicalFileECL(this.file.Name, await this.fetchDetail(session));
            const document = await vscode.workspace.openTextDocument({ language: "ecl", content });
            await vscode.window.showTextDocument(document);
        } catch (e) {
            vscode.window.showErrorMessage(e instanceof Error ? e.message : String(e));
        }
    }

    async copyName() {
        try {
            await vscode.env.clipboard.writeText(this.file.Name);
        } catch (e) {
            vscode.window.showErrorMessage(e instanceof Error ? e.message : String(e));
        }
    }

    async copyRecord() {
        try {
            const session = sessionManager.session;
            if (!session) {
                throw new Error(localize("Select an HPCC Platform launch configuration to browse logical files"));
            }
            const detail = await this.fetchDetail(session);
            if (!detail.Ecl?.trim()) {
                throw new Error(localize("Record definition is not available for this logical file"));
            }
            await vscode.env.clipboard.writeText(detail.Ecl);
        } catch (e) {
            vscode.window.showErrorMessage(e instanceof Error ? e.message : String(e));
        }
    }

    private fetchDetail(session: NonNullable<typeof sessionManager.session>) {
        return vscode.window.withProgress({
            location: { viewId: "hpccResources.logicalFiles" },
            title: localize("Fetching record definition")
        }, async () => session.fetchLogicalFileDetail(this.file.Name));
    }
}

class LogicalFileFieldItem extends Item<LogicalFilesTree> {

    constructor(tree: LogicalFilesTree, private _field: XSDXMLNode) {
        super(tree);
    }

    getLabel() {
        return this._field.name;
    }

    getDescription() {
        const type = this._field.type || (this.hasChildren() ? "RECORD" : localize("Unknown"));
        return this._field.isSet ? `SET OF ${type}` : type;
    }

    getTooltip() {
        return `${this.getLabel()}: ${this.getDescription()}`;
    }

    hasChildren() {
        return this._field.children().length > 0;
    }

    getChildren() {
        return this._field.children().map(field => new LogicalFileFieldItem(this._tree, field));
    }

    iconPath() {
        return new vscode.ThemeIcon("symbol-field");
    }

    contextValue() {
        return "LogicalFileField";
    }
}

class LogicalFileErrorItem extends Item<LogicalFilesTree> {

    constructor(tree: LogicalFilesTree, private _message: string) {
        super(tree);
    }

    getLabel() {
        return this._message;
    }

    getTooltip() {
        return this._message;
    }

    iconPath() {
        return new vscode.ThemeIcon("error");
    }

    contextValue() {
        return "LogicalFileError";
    }
}

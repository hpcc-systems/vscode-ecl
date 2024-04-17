import * as vscode from "vscode";
import localize from "../../util/localize";
import { serializer } from "./serializer";

export let commands: Commands;
export class Commands {
    _ctx: vscode.ExtensionContext;

    private constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;

        ctx.subscriptions.push(vscode.commands.registerCommand("notebook.cell.public", this.public, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("notebook.cell.private", this.private, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("notebook.cell.name", this.cellName, this));
        ctx.subscriptions.push(vscode.commands.registerCommand("notebook.cell.db", this.dbName, this));

        // cell toolbar meta  ---
        ctx.subscriptions.push(vscode.window.onDidChangeNotebookEditorSelection(e => {
            const cell = e.notebookEditor.notebook.cellAt(e.selections[0]?.start);
            vscode.commands.executeCommand("setContext", "cellLangId", cell.document.languageId);

            this.updateToolbar(serializer.node(cell).private !== true);
        }));

        // status bar provider
        ctx.subscriptions.push(vscode.notebooks.registerNotebookCellStatusBarItemProvider("ecl-notebook", new class implements vscode.NotebookCellStatusBarItemProvider {

            provideCellStatusBarItems(cell: vscode.NotebookCell) {
                return [];
            }
        }));

        this.updateToolbar(true);
    }

    static attach(ctx: vscode.ExtensionContext): Commands {
        if (!commands) {
            commands = new Commands(ctx);
        }
        return commands;
    }

    updateToolbar(publicCell: boolean) {
        vscode.commands.executeCommand("setContext", "isPublic", publicCell);
        vscode.commands.executeCommand("setContext", "isPrivate", !publicCell);
    }

    public(cell: vscode.NotebookCell) {
        serializer.node(cell).private = true;
        this.updateToolbar(false);
    }

    private(cell: vscode.NotebookCell) {
        serializer.node(cell).private = false;
        this.updateToolbar(true);
    }

    async cellName(cell: vscode.NotebookCell) {
        const node = serializer.node(cell);
        node.name = node.name ?? "";
        const name = await vscode.window.showInputBox({ value: node.name, title: localize("Result Name"), placeHolder: localize("Result Name") });
        if (name !== undefined) {
            node.name = name;
        }
    }

    async dbName(cell: vscode.NotebookCell) {
        const node = serializer.node(cell);
        const data = {
            ...node?.data
        };
        data.source = {
            name: "",
            ...node?.data?.source,
        };
        const name = await vscode.window.showInputBox({ value: data.source.name, title: localize("Database Name"), placeHolder: localize("Database Name") });
        if (name !== undefined) {
            data.source.name = name;
            node.data = data;
        }
    }
}


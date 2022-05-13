import * as vscode from "vscode";
import * as path from "path";
import { hashSum } from "@hpcc-js/util";
import { sessionManager } from "../hpccplatform/session";
import { deleteFile, writeFile } from "../util/fs";

function encodeID(id: string) {
    return id.split(" ").join("_");
}

export interface OJSOutput {
    code: string;
    eclResults: { [id: string]: object };
    folder: string;
}

export class Controller {
    readonly controllerId = "ecl-notebook-controller-id";
    readonly notebookType = "ecl-notebook";
    readonly label = "ECL Notebook";
    readonly supportedLanguages = ["ecl", "ojs"];

    private readonly _controller: vscode.NotebookController;
    private _executionOrder = 0;

    constructor() {
        this._controller = vscode.notebooks.createNotebookController(
            this.controllerId,
            this.notebookType,
            this.label
        );

        this._controller.supportedLanguages = this.supportedLanguages;
        this._controller.supportsExecutionOrder = true;
        this._controller.executeHandler = this.execute.bind(this);
    }

    dispose() {
        this._controller.dispose();
    }

    private async executeECL(cell: vscode.NotebookCell): Promise<vscode.NotebookCellOutputItem> {
        let tmpPath: string;
        try {
            const basename = path.basename(cell.document.uri.fsPath, ".eclnb");
            const dirname = path.dirname(cell.document.uri.fsPath);
            const code = cell.document.getText();
            const jobname = `${basename}-${hashSum(code.trim())}`;
            tmpPath = `${path.join(dirname, jobname)}.tmp`;
            await writeFile(tmpPath, cell.document.getText());
            const uri = vscode.Uri.file(tmpPath);
            const wu = await sessionManager.submitURI(uri);
            deleteFile(tmpPath);
            tmpPath = "";
            if (wu) {
                await wu.watchUntilComplete();
                const results = await wu.fetchResults();
                const outputs = {};
                await Promise.all(results.map(result => {
                    return result.fetchRows().then(rows => {
                        outputs[encodeID(result.Name)] = rows;
                    });
                }));
                return vscode.NotebookCellOutputItem.json(outputs);
            }
        } catch (e) {
            return vscode.NotebookCellOutputItem.error(e);
        } finally {
            if (tmpPath) {
                deleteFile(tmpPath);
            }
        }
    }

    private async executeOJS(cell: vscode.NotebookCell, cells: vscode.NotebookCell[]): Promise<vscode.NotebookCellOutputItem> {
        let eclResults = {};
        cell.notebook.getCells()
            .filter(c => c !== cell)
            .forEach(otherCell => {
                otherCell.outputs.forEach(op => {
                    op.items.filter(item => item.mime === "application/json")
                        .forEach(item => {
                            try {
                                eclResults = { ...eclResults, ...JSON.parse(item.data.toString()) };
                            } catch (e) {
                            }
                        });
                });
            });
        const retVal: OJSOutput = {
            code: cell.document.getText(),
            folder: path.dirname(cell.document.uri.path),
            eclResults
        };
        return vscode.NotebookCellOutputItem.json(retVal, "application/hpcc.ojs+json");
    }

    private async executeCell(cell: vscode.NotebookCell, cells: vscode.NotebookCell[]): Promise<void> {
        const execution = this._controller.createNotebookCellExecution(cell);
        execution.executionOrder = ++this._executionOrder;
        execution.start(Date.now());
        const cellOutput = new vscode.NotebookCellOutput([], {});
        execution.replaceOutput(cellOutput);
        switch (cell.document.languageId) {
            case "ecl":
                cellOutput.items.push(await this.executeECL(cell));
                break;
            case "ojs":
                cellOutput.items.push(await this.executeOJS(cell, cells));
                break;
        }
        execution.replaceOutput(cellOutput);
        execution.end(true, Date.now());
    }

    private async execute(cells: vscode.NotebookCell[], _notebook: vscode.NotebookDocument, _controller: vscode.NotebookController): Promise<void> {
        for (const cell of cells) {
            await this.executeCell(cell, cells);
        }
    }
}

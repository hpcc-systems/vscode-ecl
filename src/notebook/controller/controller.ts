import type { IOptions, Workunit } from "@hpcc-js/comms";

import * as path from "path";
import * as vscode from "vscode";
import { parseModule } from "@hpcc-js/observable-shim";
import { hashSum } from "@hpcc-js/util";
import { reporter } from "../../telemetry/index";
import { sessionManager } from "../../hpccplatform/session";
import { deleteFile, writeFile } from "../../util/fs";
import { launchConfiguration, LaunchRequestArguments } from "../../hpccplatform/launchConfig";
import { OJSOutput } from "./serializer-types";
import { MIME, serializer } from "./serializer";

function encodeID(id: string) {
    return id.split(" ").join("_");
}

async function watchUntilComplete(wu: Workunit): Promise<void> {
    return new Promise(resolve => {
        const handle = setInterval(async () => {
            if (wu.isComplete()) {
                clearInterval(handle);
                resolve();
            } else {
                await wu.refresh();
                if (wu.isComplete()) {
                    clearInterval(handle);
                    resolve();
                }
            }
        }, 5000);
    });
}

export class Controller {
    readonly controllerId = "ecl-kernal";
    readonly notebookType = "ecl-notebook";
    readonly label = "ECL Notebook";
    readonly supportedLanguages = ["ecl", "ojs", "omd", "html", "svg", "dot", "mermaid", "tex", "sql"];

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

        const wuMessagaging = vscode.notebooks.createRendererMessaging("ecl-notebook-wurenderer");
        wuMessagaging.onDidReceiveMessage(event => {
            switch (event.message.command) {
                case "fetchConfig":
                    const config = launchConfiguration(event.message.name);
                    if (config) {
                        wuMessagaging.postMessage({
                            type: "fetchConfigResponse",
                            configuration: this.configToIOptions(config)
                        }, event.editor);
                    }
                    break;
            }
        });

        vscode.workspace.onDidChangeNotebookDocument(evt => {
            for (const contentChange of evt.contentChanges) {
                for (const removed of contentChange.removedCells) {
                    const execution = this._controller.createNotebookCellExecution(removed);
                    execution.executionOrder = ++this._executionOrder;
                    execution.start(Date.now());
                    execution.clearOutput(removed);
                    execution.end(true, Date.now());
                }
            }
        });

    }

    configToIOptions(config?: LaunchRequestArguments): IOptions {
        if (!config) return undefined;
        return {
            baseUrl: `${config.protocol}://${config.serverAddress}:${config.port}`,
            userID: config.user,
            password: config.password,
            rejectUnauthorized: config.rejectUnauthorized,
            timeoutSecs: config.timeoutSecs
        };
    }

    dispose() {
        this._controller.dispose();
    }

    private async executeECL(cell: vscode.NotebookCell, notebook: vscode.NotebookDocument, otherCells: vscode.NotebookCell[]): Promise<vscode.NotebookCellOutputItem> {
        let tmpPath: string;
        let outputItem: vscode.NotebookCellOutputItem;
        try {
            const basename = path.basename(cell.document.uri.fsPath, ".eclnb");
            const dirname = path.dirname(cell.document.uri.fsPath);
            let code = "";
            const cells = cell.notebook.getCells(new vscode.NotebookRange(0, cell.index));
            for (const otherCell of cells) {
                if (!serializer.node(otherCell).private && otherCell.document.languageId === cell.document.languageId) {
                    code += otherCell.document.getText();
                }
            }
            code += cell.document.getText();
            const jobname = `${basename}-${hashSum(code.trim())}`;
            tmpPath = `${path.join(dirname, jobname)}.tmp`;
            await writeFile(tmpPath, code);
            const uri = vscode.Uri.file(tmpPath);
            const wu = await sessionManager.nbSubmitURI(uri);
            deleteFile(tmpPath);
            tmpPath = "";
            if (wu) {
                await watchUntilComplete(wu);
                const results = await wu.fetchResults();
                const outputs = {};
                await Promise.all(results.map(result => {
                    const name = encodeID(result.Name);
                    return result.fetchRows().then(rows => {
                        if (rows.length === 1 && rows[0][name]) {
                            outputs[name] = rows[0][name];
                        } else {
                            outputs[name] = rows;
                        }
                    });
                }));

                const ojsOutput: OJSOutput = serializer.ojsOutput(cell, notebook.uri, otherCells);
                ojsOutput.cell.ojsSource = "";
                try {
                    for (const key in outputs) {
                        ojsOutput.cell.ojsSource += `${key} = ${JSON.stringify(outputs[key])};`;
                    }
                    outputItem = vscode.NotebookCellOutputItem.json(ojsOutput, MIME);
                } catch (e) { }
            }
        } catch (e: any) {
            if (e.message.indexOf("0003:  Definition must contain EXPORT or SHARED value") >= 0) {
                outputItem = vscode.NotebookCellOutputItem.text("...no action...");
            } else {
                outputItem = vscode.NotebookCellOutputItem.error(e);
            }
        } finally {
            if (tmpPath) {
                deleteFile(tmpPath);
            }
        }
        return outputItem;
    }

    private executeOJS(cell: vscode.NotebookCell, notebook: vscode.NotebookDocument, otherCells: vscode.NotebookCell[]): Promise<vscode.NotebookCellOutputItem> {
        try {
            parseModule(serializer.ojsSource(cell));
        } catch (e: any) {
            const msg = e?.message ?? "Unknown Error";
            return Promise.resolve(vscode.NotebookCellOutputItem.stderr(msg));
        }
        const ojsOutput = serializer.ojsOutput(cell, notebook.uri, otherCells);
        return Promise.resolve(vscode.NotebookCellOutputItem.json(ojsOutput, MIME));
    }

    private async createOutputItem(cell: vscode.NotebookCell, notebook: vscode.NotebookDocument, otherCells: vscode.NotebookCell[]) {
        switch (cell.document.languageId) {
            case "ecl":
                return this.executeECL(cell, notebook, otherCells);
            case "ojs":
            case "omd":
            case "html":
            case "svg":
            case "dot":
            case "mermaid":
            case "tex":
            case "sql":
            case "javascript":
            default:
                return this.executeOJS(cell, notebook, otherCells);
        }
    }

    private async executeCell(cell: vscode.NotebookCell, outputItem: vscode.NotebookCellOutputItem, notebook: vscode.NotebookDocument, otherCells: vscode.NotebookCell[]) {
        const execution = this._controller.createNotebookCellExecution(cell);
        execution.executionOrder = ++this._executionOrder;
        execution.start(Date.now());
        // serializer.node(cell).output = outputItem;
        await execution.replaceOutput([new vscode.NotebookCellOutput([outputItem])]);
        execution.end([outputItem].every(op => op.mime.indexOf(".stderr") < 0), Date.now());
    }

    private async execute(cells: vscode.NotebookCell[], notebook: vscode.NotebookDocument): Promise<void> {
        const outputItems = await Promise.all(cells.map(c => this.createOutputItem(c, notebook, [])));
        for (let i = 0; i < cells.length; ++i) {
            reporter.sendTelemetryEvent("controller.execute.cell");
            this.executeCell(cells[i], outputItems[i], notebook, cells.filter(c => c !== cells[i]));
        }
    }
}

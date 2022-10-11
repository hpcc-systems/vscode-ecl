import type { IOptions } from "@hpcc-js/comms";

import * as path from "path";
import * as vscode from "vscode";
import { parseCell } from "@hpcc-js/observable-shim";
import { hashSum } from "@hpcc-js/util";
import { reporter } from "../../telemetry/index";
import { sessionManager } from "../../hpccplatform/session";
import { deleteFile, writeFile } from "../../util/fs";
import { launchConfiguration, LaunchRequestArguments } from "../../hpccplatform/launchConfig";
import { OJSOutput, serializer, WUOutput } from "./serializer";

function encodeID(id: string) {
    return id.split(" ").join("_");
}

export class Controller {
    readonly controllerId = "ecl-kernal";
    readonly notebookType = "ecl-notebook";
    readonly label = "ECL Notebook";
    readonly supportedLanguages = ["ecl", "ojs", "omd", "html", "svg", "dot", "mermaid", "tex"];

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

    private async executeECL(cell: vscode.NotebookCell): Promise<vscode.NotebookCellOutputItem> {
        let tmpPath: string;
        try {
            const basename = path.basename(cell.document.uri.fsPath, ".eclnb");
            const dirname = path.dirname(cell.document.uri.fsPath);
            let code = "";
            const cells = cell.notebook.getCells(new vscode.NotebookRange(0, cell.index));
            for (const otherCell of cells) {
                if (otherCell.document.languageId === cell.document.languageId) {
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
                await wu.watchUntilComplete();
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

                const retVal: WUOutput = serializer.wuOutput(sessionManager.session.name, wu.Wuid, outputs);
                return vscode.NotebookCellOutputItem.json(retVal, "application/hpcc.wu+json");
            }
        } catch (e) {
            if (e.message.indexOf("0003:  Definition must contain EXPORT or SHARED value") >= 0) {
                return vscode.NotebookCellOutputItem.text("...no action...");
            }
            return vscode.NotebookCellOutputItem.error(e);
        } finally {
            if (tmpPath) {
                deleteFile(tmpPath);
            }
        }
    }

    private executeOJS(cell: vscode.NotebookCell, notebook: vscode.NotebookDocument, otherCells: vscode.NotebookCell[]): vscode.NotebookCellOutputItem {
        try {
            parseCell(serializer.ojsSource(cell));
        } catch (e: any) {
            const msg = e?.message ?? "Unknown Error";
            return vscode.NotebookCellOutputItem.stderr(msg);
        }
        const ojsOutput = serializer.ojsOutput(cell, notebook.uri, otherCells);
        return vscode.NotebookCellOutputItem.json(ojsOutput, "application/hpcc.ojs+json");
    }

    private async executeCell(cell: vscode.NotebookCell, notebook: vscode.NotebookDocument, otherCells: vscode.NotebookCell[]) {
        const execution = this._controller.createNotebookCellExecution(cell);
        execution.executionOrder = ++this._executionOrder;
        execution.start(Date.now());
        const outputItems: vscode.NotebookCellOutputItem[] = [];
        switch (cell.document.languageId) {
            case "ecl":
                const outputItem = await this.executeECL(cell);
                // outputItems.push(outputItem);
                try {
                    const wuOutput = JSON.parse(Buffer.from(outputItem.data).toString());
                    for (const key in wuOutput.results) {
                        const ojsOutput: OJSOutput = {
                            cell: {
                                node: { id: `${key}`, value: `${key} = ${wuOutput.results[key]}`, mode: "js" },
                                ojsSource: `${key} = ${wuOutput.results[key]}`
                            },
                            uri: notebook.uri.toString(),
                            folder: "",
                            notebook: { nodes: [], files: [] },
                            otherCells: []
                        };
                        outputItems.push(vscode.NotebookCellOutputItem.json(ojsOutput, "application/hpcc.ojs+json"));
                    }
                } catch (e) { }
                break;
            case "ojs":
            case "html":
            case "dot":
            case "mermaid":
            default:
                outputItems.push(this.executeOJS(cell, notebook, otherCells));
                break;
        }
        // serializer.node(cell).output = outputItem;
        await execution.replaceOutput([new vscode.NotebookCellOutput(outputItems)]);
        execution.end(outputItems.every(op => op.mime.indexOf(".stderr") < 0), Date.now());
    }

    private async execute(cells: vscode.NotebookCell[], notebook: vscode.NotebookDocument): Promise<void> {
        for (const cell of cells) {
            reporter.sendTelemetryEvent("controller.execute.cell");
            this.executeCell(cell, notebook, cells.filter(c => c !== cell));
        }
    }
}

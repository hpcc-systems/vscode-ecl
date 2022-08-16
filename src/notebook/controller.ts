import * as vscode from "vscode";
import * as path from "path";
import { hashSum } from "@hpcc-js/util";
import { sessionManager } from "../hpccplatform/session";
import { deleteFile, writeFile } from "../util/fs";
import { LaunchConfig, launchConfiguration, LaunchRequestArguments } from "../hpccplatform/launchConfig";
import { IConnection, IOptions, Workunit } from "@hpcc-js/comms";

function encodeID(id: string) {
    return id.split(" ").join("_");
}

export interface WUOutput {
    configuration: string;
    wuid: string;
    results: { [id: string]: object };
}

export interface OJSOutput {
    code: string;
    folder: string;
    eclResults: WUOutput[];
}

export class Controller {
    readonly controllerId = "ecl-kernal";
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

        const ojsMessagaging = vscode.notebooks.createRendererMessaging("ecl-notebook-ojsrenderer");
        ojsMessagaging.onDidReceiveMessage(event => {
            switch (event.message.command) {
                case "fetchConfigs":
                    const configurations = {};
                    event.message.names.forEach(name => {
                        configurations[name] = this.configToIOptions(launchConfiguration(name));
                    });
                    ojsMessagaging.postMessage({
                        type: "fetchConfigsResponse",
                        configurations
                    }, event.editor);
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

                const retVal: WUOutput = {
                    configuration: sessionManager.session.name,
                    wuid: wu.Wuid,
                    results: outputs
                };
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

    private async executeOJS(cell: vscode.NotebookCell, cells: vscode.NotebookCell[]): Promise<vscode.NotebookCellOutputItem> {
        const items = [];
        cell.notebook.getCells().filter(c => c !== cell).forEach(otherCell => {
            otherCell.outputs.forEach(op => {
                op.items.filter(item => item.mime === "application/hpcc.wu+json").forEach(item => {
                    items.push(item);
                });
            });
        });

        const eclResults: WUOutput[] = [];
        for (const item of items) {
            try {
                eclResults.push(JSON.parse(item.data.toString()));
                // const config = launchConfiguration(data.configuration);
                // if (config) {
                //     const wu = Workunit.attach(this.configToIOptions(config), data.wuid);
                //     await wu.watchUntilComplete();
                //     await wu.fetchResults().then(results => {
                //         return Promise.all(results.map(r => r.fetchRows())).then(resultRows => {
                //             results.forEach((r, i) => {
                //                 eclResults[r.Name] = resultRows[i];
                //             });
                //         });
                //     });
                // }
            } catch (e) {
            }
        }

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

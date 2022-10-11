import type { ohq } from "@hpcc-js/observablehq-compiler";

import * as path from "path";
import { NotebookSerializer, CancellationToken, NotebookData, NotebookCellData, NotebookCellKind, NotebookCell, Uri, NotebookCellOutput, NotebookCellOutputItem, NotebookRange } from "vscode";
import { v4 as uuidv4 } from "uuid";
import { TextDecoder, TextEncoder } from "util";

export interface WUOutput {
    configuration: string;
    wuid: string;
    results: { [id: string]: object };
}

export interface OJSCell {
    node: Readonly<ohq.Node>
    ojsSource: string;
}

export interface OJSOutput {
    uri: string;
    folder: string;
    notebook: ohq.Notebook;
    cell: OJSCell;
    otherCells: OJSCell[];
}

function encode(str: string) {
    return str
        .split("`").join("\\`")
        ;
}

interface RawNotebookOutput {
    mime: string;
    data: string;
}

interface Meta {
    notebook: { [id: string]: ohq.Notebook },
    node: { [id: string | number]: ohq.Node }
}

export let serializer: Serializer;
export class Serializer implements NotebookSerializer {

    protected _meta: Meta = {
        notebook: {},
        node: {}
    };

    protected constructor() {
    }

    static attach(): Serializer {
        if (!serializer) {
            serializer = new Serializer();
        }
        return serializer;
    }

    notebook(cell: NotebookCell): ohq.Notebook {
        return this._meta.notebook[cell.notebook.metadata?.id] ?? {
            id: uuidv4(),
            files: [],
            nodes: []
        };
    }

    node(cell: NotebookCell): ohq.Node {
        return this._meta.node[cell.metadata?.id] ?? {
            id: uuidv4(),
            mode: cell.document.languageId,
            value: cell.document.getText()
        };
    }

    wuOutput(configuration: string, wuid: string, results: { [id: string]: object }): WUOutput {
        return {
            configuration,
            wuid,
            results
        };
    }

    ojsSource(cell: NotebookCell) {
        switch (cell.document.languageId) {
            case "ojs":
                return cell.document.getText();
            case "omd":
                return `md\`${encode(cell.document.getText())}\``;
            case "html":
                return `htl.html\`${encode(cell.document.getText())}\``;
            case "tex":
                return `tex.block\`${encode(cell.document.getText())}\``;
            case "sql":
                return `${this.node(cell)?.name} = db.sql\`${encode(cell.document.getText())}\`;`;
            case "javascript":
                return `{${cell.document.getText()}}`;
            default:
                return `${cell.document.languageId}\`${cell.document.getText()}\``;
        }
    }

    ojsCell(cell: NotebookCell): OJSCell {
        return {
            node: this.node(cell),
            ojsSource: this.ojsSource(cell)
        };
    }

    ojsOutput(cell: NotebookCell, uri: Uri, otherCells: NotebookCell[]): OJSOutput {
        const folder = path.dirname(cell.document.uri.path);

        // let globals = {};
        // const cells = cell.notebook.getCells(new NotebookRange(0, cell.index));
        // for (const otherCell of cells) {
        //     otherCell.outputs.forEach(op => {
        //         op.items.filter(item => item.mime === "application/hpcc.wu+json").forEach(item => {
        //             try {
        //                 globals = { ...globals, ...JSON.parse(item.data.toString()) };
        //             } catch (e) {
        //             }
        //         });
        //     });
        // }

        return {
            uri: uri.toString(),
            folder,
            notebook: this._meta.notebook[cell.notebook.metadata.id],
            cell: this.ojsCell(cell),
            otherCells: otherCells.map(c => this.ojsCell(c))
        };
    }

    //  NotebookSerializer  ---

    async deserializeNotebook(content: Uint8Array, _token: CancellationToken): Promise<NotebookData> {
        const contents = new TextDecoder("utf-8").decode(content);

        let notebook: ohq.Notebook;
        try {
            notebook = {
                id: uuidv4(),
                ...JSON.parse(contents)
            };
        } catch {
            notebook = {
                id: uuidv4(),
                files: [],
                nodes: []
            } as unknown as ohq.Notebook;
        }

        const cells = notebook.nodes?.map(node => {
            let kind: NotebookCellKind;
            let mode: string;
            switch (node.mode) {
                case "md":
                    kind = NotebookCellKind.Markup;
                    mode = "markdown";
                    break;
                case "ecl":
                    kind = NotebookCellKind.Markup;
                    mode = "ecl";
                    break;
                case "js":
                    kind = NotebookCellKind.Code;
                    mode = "ojs";
                    break;
                default:
                    kind = NotebookCellKind.Code;
                    mode = node.mode;
            }
            const retVal = new NotebookCellData(node.mode === "md" ?
                NotebookCellKind.Markup :
                NotebookCellKind.Code, node.value, mode);
            retVal.metadata = retVal.metadata ?? {};
            retVal.metadata.id = node.id;
            this._meta.node[node.id] = node;

            const items: NotebookCellOutputItem[] = [];
            node.outputs?.forEach(output => {
                items.push(new NotebookCellOutputItem(new Uint8Array(Buffer.from(output.data, "base64")), output.mime));
            });
            retVal.outputs = [new NotebookCellOutput(items)];
            return retVal;
        });

        const retVal = new NotebookData(cells);
        retVal.metadata = retVal.metadata ?? {};
        retVal.metadata.id = notebook.id;
        this._meta.notebook[notebook.id] = notebook;
        return retVal;
    }

    async serializeNotebook(data: NotebookData, _token: CancellationToken): Promise<Uint8Array> {
        const jsonNotebook: ohq.Notebook = this._meta.notebook[data.metadata?.id];
        jsonNotebook.nodes = [];

        for (const cell of data.cells) {
            let mode: string;
            const outputs: RawNotebookOutput[] = [];
            switch (cell.kind) {
                case NotebookCellKind.Markup:
                    mode = "md";
                    break;
                default:
                    switch (cell.languageId) {
                        case "ojs":
                            mode = "js";
                            break;
                        case "ecl":
                            mode = "ecl";
                            cell.outputs?.forEach(op => {
                                op.items.forEach(item => {
                                    outputs.push({ mime: item.mime, data: Buffer.from(item.data).toString("base64") });
                                });
                            });
                            break;
                        default:
                            mode = cell.languageId;
                    }
            }
            const node = this._meta.node[cell.metadata?.id];
            const item: ohq.Node = {
                id: cell.metadata?.id ?? uuidv4(),
                name: "",
                ...node,
                value: cell.value,
                mode,
                outputs: outputs
            };
            jsonNotebook.nodes.push(item);
        }

        return new TextEncoder().encode(JSON.stringify(jsonNotebook, undefined, 4));
    }
}

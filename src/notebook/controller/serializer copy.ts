import { NotebookSerializer, CancellationToken, NotebookData, NotebookCellData, NotebookCellKind, NotebookCellOutput, NotebookCellOutputItem } from "vscode";
import type { ohq } from "@hpcc-js/observablehq-compiler";
import { TextDecoder, TextEncoder } from "util";

interface RawNotebookOutput {
    mime: string;
    data: number[];
}

interface RawNotebookCell {
    kind: NotebookCellKind;
    language: string;
    value: string;
    metadata: { [key: string]: any };
    outputs: RawNotebookOutput[];
}

export class Serializer implements NotebookSerializer {

    deserializeNotebook(content: Uint8Array, _token: CancellationToken): NotebookData {
        const contents = new TextDecoder("utf-8").decode(content);

        let raw: RawNotebookCell[];
        try {
            raw = <RawNotebookCell[]>JSON.parse(contents);
        } catch {
            raw = [];
        }

        const cells = raw.map(item => {
            const retVal = new NotebookCellData(item.kind, item.value, item.language);
            retVal.metadata = retVal.metadata || {};
            retVal.metadata.custom = retVal.metadata.custom || {};
            if (item.outputs) {
                const cellOutput = new NotebookCellOutput(item.outputs.map(item => new NotebookCellOutputItem(Uint8Array.from(item.data), item.mime)));
                retVal.outputs = [cellOutput];
            }
            return retVal;
        });

        return new NotebookData(cells);
    }

    serializeNotebook(data: NotebookData, _token: CancellationToken): Uint8Array {

        const contents: RawNotebookCell[] = [];

        for (const cell of data.cells) {
            const outputs: RawNotebookOutput[] = [];
            cell.outputs?.forEach(op => {
                op.items.forEach(item => {
                    outputs.push({ mime: item.mime, data: Array.from(item.data) });
                });

            });

            const sCell = {
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value,
                metadata: cell.metadata || {},
                outputs
            };
            sCell.metadata.custom = sCell.metadata.custom || {};
            contents.push(sCell);
        }

        return new TextEncoder().encode(JSON.stringify(contents));
    }
}

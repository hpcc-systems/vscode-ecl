import * as vscode from "vscode";
import { TextDecoder, TextEncoder } from "util";

interface RawNotebookOutput {
    mime: string;
    data: number[];
}

interface RawNotebookCell {
    kind: vscode.NotebookCellKind;
    language: string;
    value: string;
    outputs: RawNotebookOutput[];
}

export class Serializer implements vscode.NotebookSerializer {
    async deserializeNotebook(content: Uint8Array, _token: vscode.CancellationToken): Promise<vscode.NotebookData> {
        const contents = new TextDecoder().decode(content);

        let raw: RawNotebookCell[];
        try {
            raw = <RawNotebookCell[]>JSON.parse(contents);
        } catch {
            raw = [];
        }

        const cells = raw.map(item => {
            const retVal = new vscode.NotebookCellData(item.kind, item.value, item.language);
            if (item.outputs) {
                const cellOutput = new vscode.NotebookCellOutput(item.outputs.map(item => new vscode.NotebookCellOutputItem(Uint8Array.from(item.data), item.mime)));
                retVal.outputs = [cellOutput];
            }
            return retVal;
        });

        return new vscode.NotebookData(cells);
    }

    async serializeNotebook(data: vscode.NotebookData, _token: vscode.CancellationToken): Promise<Uint8Array> {
        const contents: RawNotebookCell[] = [];

        for (const cell of data.cells) {
            const outputs: RawNotebookOutput[] = [];
            cell.outputs?.forEach(op => {
                op.items.forEach(item => {
                    outputs.push({ mime: item.mime, data: Array.from(item.data) });
                });

            });

            contents.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value,
                outputs
            });
        }

        return new TextEncoder().encode(JSON.stringify(contents));
    }
}

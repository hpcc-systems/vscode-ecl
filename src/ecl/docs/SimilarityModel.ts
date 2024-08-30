import * as vscode from "vscode";
import { Llama } from "@hpcc-js/wasm-llama";
import { Zstd } from "@hpcc-js/wasm-zstd";
import { Embeddings } from "@langchain/core/embeddings";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

class LlamaEmbeddings extends Embeddings {

    private _modelData: Promise<Uint8Array>;

    constructor(modelPath: Promise<vscode.Uri>, fields?) {
        super(fields);
        this._modelData = modelPath
            .then(modelPath => vscode.workspace.fs.readFile(modelPath))
            .then(modelBin => new Uint8Array(modelBin))
            ;
    }

    embedDocuments(documents: string[]): Promise<number[][]> {
        return Promise.all([Llama.load(), this._modelData]).then(([llama, modelData]) => {
            const embeddings: number[][] = [];
            for (const text of documents) {
                const vectors = llama.embedding(text, modelData);
                vectors.forEach(vector => {
                    embeddings.push(vector);
                });
                Llama.unload();
            }
            return embeddings;
        });
    }

    embedQuery(document: string): Promise<number[]> {
        return Promise.all([Llama.load(), this._modelData]).then(([llama, modelData]) => {
            const vectors = llama.embedding(document, modelData);
            return vectors[0];
        });
    }
}

export async function loadStore(modelPath: Promise<vscode.Uri>, docsPath: vscode.Uri) {
    const docsVStore = new MemoryVectorStore(new LlamaEmbeddings(modelPath));
    const [zstd, buff] = await Promise.all([Zstd.load(), vscode.workspace.fs.readFile(docsPath)]);
    const jsonUint8Array = zstd.decompress(new Uint8Array(buff));
    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(jsonUint8Array);
    const data = JSON.parse(jsonStr);
    docsVStore.memoryVectors = docsVStore.memoryVectors.concat(data.vectors);
    return docsVStore;
}


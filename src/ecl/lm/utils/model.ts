import * as vscode from "vscode";
import * as path from "path";
import { WebBlob } from "@hpcc-js/wasm-llama";

const MODEL_FILENAME = "bge-base-en-v1.5-q4_k_m.gguf";
const MODEL_URL = `https://huggingface.co/CompendiumLabs/bge-base-en-v1.5-gguf/resolve/main/${MODEL_FILENAME}`;

async function checkModelFolderExists(ctx: vscode.ExtensionContext) {
    const modelsFolder = vscode.Uri.joinPath(ctx.globalStorageUri, "models");
    try {
        await vscode.workspace.fs.stat(modelsFolder);
    } catch (error: any) {
        if (error.code === "FileNotFound") {
            await vscode.workspace.fs.createDirectory(modelsFolder);
        } else {
            vscode.window.showErrorMessage(`Error locating models folder: ${error.message}`);
        }
    }
    return modelsFolder;
}

export async function checkModelExists(ctx: vscode.ExtensionContext) {
    const modelsFolder = await checkModelFolderExists(ctx);
    const modelPath = path.join(modelsFolder.fsPath, MODEL_FILENAME);
    try {
        await vscode.workspace.fs.stat(vscode.Uri.file(modelPath));
    } catch (error: any) {
        if (error.code === "FileNotFound") {
            const modelBlob = await WebBlob.create(new URL(MODEL_URL));
            await vscode.workspace.fs.writeFile(vscode.Uri.file(modelPath), new Uint8Array(await modelBlob.arrayBuffer()));
        } else {
            vscode.window.showErrorMessage(`Error locating model: ${error.message}`);
        }
    }
    return vscode.Uri.file(modelPath);
}

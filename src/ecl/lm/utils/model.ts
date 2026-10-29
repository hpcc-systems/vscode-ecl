import * as vscode from "vscode";
import * as path from "path";
import { WebBlob } from "@hpcc-js/wasm-llama";

const MODEL_FILENAME = "nomic-embed-text-v1.5.Q4_K_M.gguf";
const MODEL_URL = `https://huggingface.co/nomic-ai/nomic-embed-text-v1.5-GGUF/resolve/main/${MODEL_FILENAME}`;
const modelPromises = new Map<string, Promise<vscode.Uri>>();

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

async function ensureModelExists(ctx: vscode.ExtensionContext) {
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

export function checkModelExists(ctx: vscode.ExtensionContext): Promise<vscode.Uri> {
    const storageKey = ctx.globalStorageUri.toString();
    const existingPromise = modelPromises.get(storageKey);
    if (existingPromise) {
        return existingPromise;
    }

    const modelPromise = ensureModelExists(ctx).then(
        modelPath => {
            modelPromises.delete(storageKey);
            return modelPath;
        },
        error => {
            modelPromises.delete(storageKey);
            throw error;
        }
    );
    modelPromises.set(storageKey, modelPromise);
    return modelPromise;
}

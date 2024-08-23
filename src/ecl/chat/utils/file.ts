import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";

export interface File {
    name: string;
    path: string;
    content?: string;
}
export async function createFileWithContent(
    filePath: string,
    content: string
): Promise<void> {
    const fileUri = vscode.Uri.file(filePath);
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, "utf8"));
}

async function createFileAndOpenInEditor(file: any, baseUri: vscode.Uri) {
    const newFilePath = vscode.Uri.joinPath(baseUri, file.path);
    const dirPath = path.dirname(newFilePath.fsPath);
    await fs.mkdir(dirPath, { recursive: true });
    try {
        await vscode.workspace.fs.stat(newFilePath);
    } catch (err) {
        await createFileWithContent(newFilePath.fsPath, file.content);
        const document = await vscode.workspace.openTextDocument(newFilePath);
        const editor = await vscode.window.showTextDocument(document);
        await vscode.commands.executeCommand("editor.action.formatDocument");
    }
}

export async function createFolderAndFiles(files: any[]): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        const baseUri = workspaceFolders[0].uri;
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Creating files",
                cancellable: false,
            },
            async (progress) => {
                if (files.length > 0) {
                    const blockName = files[0].path.split("/")[1];
                    const blockPath = path.join(baseUri.fsPath, "/blocks/" + blockName);
                    try {
                        await fs.rmdir(blockPath, { recursive: true });
                    } catch (err) {
                        console.error(`Failed to delete directory: ${err}`);
                    }
                }

                await Promise.all(files.map(async (file, i) => {
                    await createFileAndOpenInEditor(file, baseUri);
                    progress.report({
                        increment: 100.0 / files.length,
                        message: `Creating file: ${file.path}`,
                    });
                }));
            }
        );
    }
}
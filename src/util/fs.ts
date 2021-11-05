import * as path from "path";
import { FileType, Uri, workspace } from "vscode";

const fs = workspace.fs;

export const exists = async (fsPath: string): Promise<boolean> => {
    try {
        await fs.stat(Uri.file(fsPath));
        return true;
    } catch (e) {
        return false;
    }
};

export function readFile(fsPath: string, encoding: string = "utf-8"): Thenable<string> {
    return fs.readFile(Uri.file(fsPath)).then(_content => {
        return new TextDecoder(encoding).decode(_content);
    });
}

export function writeFile(fsPath: string, _content: string): Thenable<void> {
    const content = new TextEncoder().encode(_content);
    return fs.writeFile(Uri.file(fsPath), content);
}

export function deleteFile(fsPath: string): Thenable<void> {
    return fs.delete(Uri.file(fsPath));
}

export function createDirectory(fsPath: string): Thenable<void> {
    return fs.createDirectory(Uri.file(fsPath));
}

export function readDirectory(fsPath: string): Thenable<[string, FileType][]> {
    return fs.readDirectory(Uri.file(fsPath));
}

//  ECL Helpers  ---
export const isHidden = (source: string) => source.indexOf(".") === 0;

export async function isDirectory(fsPath: string): Promise<boolean> {
    return fs.stat(Uri.file(fsPath)).then(stat => {
        return isTypeDirectory(stat.type);
    });
}

export const isTypeDirectory = (type: FileType): boolean => !!(type & FileType.Directory);

export const isEcl = (source: string) => path.extname(source).toLowerCase() === ".ecl";

export const modAttrs = async (source: string) => {
    return (await fs.readDirectory(Uri.file(source)))
        .filter(([name, type]) => {
            return !isHidden(name);
        }).map(([name, type]) => {
            return [path.join(source, name), type] as [string, FileType];
        }).filter(([fsPath, type]) => {
            return isTypeDirectory(type) || isEcl(fsPath);
        })
        ;
};


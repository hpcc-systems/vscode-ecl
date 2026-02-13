// Mock vscode module for vitest tests
export const workspace = {
    fs: {
        readFile: () => Promise.resolve(new Uint8Array())
    }
};

export const Uri = {
    file: (path: string) => ({ fsPath: path, path })
};

// Add other vscode APIs as needed for tests
export default {
    workspace,
    Uri
};

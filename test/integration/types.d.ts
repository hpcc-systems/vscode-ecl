declare module '@vscode/test-electron' {
    interface RunTestsOptions {
        extensionDevelopmentPath: string;
        extensionTestsPath: string;
        launchArgs?: string[];
    }
    export function runTests(options: RunTestsOptions): Promise<void>;
    export function downloadAndUnzipVSCode(version?: string): Promise<void>;
}

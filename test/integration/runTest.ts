import * as path from 'path';
import { runTests, downloadAndUnzipVSCode } from '@vscode/test-electron';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // __dirname -> dist-test/integration ; ascend two levels to project root
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to the extension test script (the file that imports tests)
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Ensure VS Code is downloaded (cache will be reused)
        await downloadAndUnzipVSCode('stable');

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                extensionDevelopmentPath,
                '--disable-gpu',         // Disable GPU hardware acceleration for headless environments
                '--no-sandbox'           // Disable sandboxing for headless environments
            ],
        });
    } catch (err) {
        console.error('Failed to run integration tests');
        if (err instanceof Error) {
            console.error(err.message, err.stack);
        }
        process.exit(1);
    }
}

main();

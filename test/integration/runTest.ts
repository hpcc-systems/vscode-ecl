import * as path from 'path';
import { runTests, downloadAndUnzipVSCode } from '@vscode/test-electron';
import * as cp from 'child_process';
import * as os from 'os';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // __dirname -> dist-test/integration ; ascend two levels to project root
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to the extension test script (the file that imports tests)
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Ensure VS Code is downloaded (cache will be reused)
        const vscodeExecutablePath = await downloadAndUnzipVSCode('stable');

        // Install the required extension dependency before running tests
        // Determine the CLI path based on the platform
        const platform = os.platform();
        let cliPath: string;

        if (platform === 'darwin') {
            cliPath = path.join(vscodeExecutablePath, 'Contents', 'Resources', 'app', 'bin', 'code');
        } else if (platform === 'win32') {
            cliPath = path.join(path.dirname(vscodeExecutablePath), 'bin', 'code.cmd');
        } else {
            cliPath = path.join(path.dirname(vscodeExecutablePath), 'bin', 'code');
        }

        console.log('Installing GordonSmith.observable-js extension...');
        try {
            cp.spawnSync(cliPath, ['--install-extension', 'GordonSmith.observable-js', '--force'], {
                encoding: 'utf-8',
                stdio: 'inherit'
            });
            console.log('Extension installation completed.');
        } catch (installErr) {
            console.warn('Warning: Failed to install GordonSmith.observable-js extension:', installErr);
            console.warn('Tests requiring this extension will be skipped.');
        }

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

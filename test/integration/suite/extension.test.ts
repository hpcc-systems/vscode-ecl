import * as assert from 'assert';
import * as vscode from 'vscode';

export async function run(): Promise<void> {
    console.log('Test: extension manifest is discoverable');
    {
        const ext = vscode.extensions.getExtension('hpcc-systems.ecl');
        assert.ok(ext, 'Extension should be found in the extension manifest');
        console.log('  PASS');
    }

    console.log('Test: extension can activate when dependencies are present');
    {
        const ext = vscode.extensions.getExtension('hpcc-systems.ecl');
        assert.ok(ext, 'Extension should be found');

        // Check if required dependency is present
        const requiredDep = vscode.extensions.getExtension('GordonSmith.observable-js');
        if (!requiredDep) {
            console.log('  SKIPPED: GordonSmith.observable-js extension not installed (expected in CI/minimal environments)');
        } else {
            // Attempt activation
            try {
                await ext?.activate();
            } catch (e: unknown) {
                const msg = (e as Error)?.message || String(e);
                throw new Error(`Extension activation failed: ${msg}`);
            }

            const commands = await vscode.commands.getCommands(true);
            assert.ok(commands.includes('ecl.submit'), 'ecl.submit command should be registered');
            assert.ok(commands.includes('ecl.compile'), 'ecl.compile command should be registered');
            console.log('  PASS');
        }
    }
}

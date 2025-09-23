import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Activation Test', () => {
    test('extension manifest is discoverable and core commands present (activation optional)', async function () {
        const ext = vscode.extensions.getExtension('hpcc-systems.ecl');
        assert.ok(ext, 'Extension should be found');
        // Attempt activation but skip test if dependency chain missing
        try {
            await ext?.activate();
        } catch (e: unknown) {
            const msg = (e as Error)?.message || String(e);
            if (msg.includes('depends on unknown extension')) {
                // Skip due to missing dependency in test harness environment
                this.skip();
                return;
            }
            throw e;
        }

        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('ecl.submit'), 'ecl.submit command should be registered');
        assert.ok(commands.includes('ecl.compile'), 'ecl.compile command should be registered');
    });
});

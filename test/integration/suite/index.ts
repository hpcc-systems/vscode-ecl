import * as path from 'path';
import { globSync } from 'glob';

export async function run(): Promise<void> {
    const testsRoot = path.resolve(__dirname);
    const files = globSync('**/*.test.js', { cwd: testsRoot });

    let failures = 0;

    for (const f of files) {
        const mod = require(path.resolve(testsRoot, f));
        if (typeof mod.run === 'function') {
            try {
                await mod.run();
            } catch (e) {
                failures++;
                console.error(`FAIL: ${f}`, e);
            }
        }
    }

    if (failures > 0) {
        throw new Error(`${failures} test files failed.`);
    }
}

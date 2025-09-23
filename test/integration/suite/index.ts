import * as path from 'path';
import Mocha from 'mocha';
import { globSync } from 'glob';

export function run(): Promise<void> {
    const mocha = new Mocha({
        ui: 'tdd',
        color: true,
        timeout: 20000
    });

    const testsRoot = path.resolve(__dirname);

    return new Promise((resolve, reject) => {
        try {
            const files = globSync('**/*.test.js', { cwd: testsRoot });
            for (const f of files) {
                mocha.addFile(path.resolve(testsRoot, f));
            }
            mocha.run((failures: number) => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                } else {
                    resolve();
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

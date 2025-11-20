// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively extracts all %xxx% strings from an object or array
 */
function extractLocalizationKeys(obj: unknown, keys: Set<string>): void {
    if (typeof obj === "string") {
        // Match %xxx% pattern
        const matches = obj.match(/%([^%]+)%/g);
        if (matches) {
            matches.forEach(match => {
                // Remove the % characters to get the key
                const key = match.substring(1, match.length - 1);
                keys.add(key);
            });
        }
    } else if (Array.isArray(obj)) {
        obj.forEach(item => extractLocalizationKeys(item, keys));
    } else if (typeof obj === "object" && obj !== null) {
        Object.values(obj).forEach(value => extractLocalizationKeys(value, keys));
    }
}

describe('Localization (NLS)', () => {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const nlsPath = path.join(process.cwd(), 'package.nls.json');

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf-8'));

    it('all %xxx% strings in package.json exist in package.nls.json', () => {
        // Extract all localization keys from package.json
        const keys = new Set<string>();
        extractLocalizationKeys(pkg, keys);

        // Check which keys are missing from package.nls.json
        const missingKeys: string[] = [];
        keys.forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(nls, key)) {
                missingKeys.push(key);
            }
        });

        // Sort for consistent error messages
        missingKeys.sort();

        // Assert no missing keys with helpful error message
        expect(missingKeys,
            `The following keys are referenced in package.json but missing in package.nls.json:\n${missingKeys.map(k => `  - ${k}`).join('\n')}`
        ).toEqual([]);
    });

    it('package.nls.json is valid JSON', () => {
        expect(nls).toBeDefined();
        expect(typeof nls).toBe('object');
    });

    it('package.nls.json contains some expected keys', () => {
        // Check for a few keys that should definitely exist
        expect(nls).toHaveProperty('Submit');
        expect(nls).toHaveProperty('Compile');
    });
});

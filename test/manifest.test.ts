// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Extension Manifest (package.json)', () => {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    it('has correct name and publisher', () => {
        expect(pkg.name).toBe('ecl');
        expect(pkg.publisher).toBe('hpcc-systems');
    });

    it('declares expected activation events', () => {
        const events: string[] = pkg.activationEvents || [];
        for (const ev of ['workspaceContains:*.ecl', 'workspaceContains:*.kel']) {
            expect(events).toContain(ev);
        }
    });

    it('includes core commands', () => {
        type CommandEntry = { command: string };
        const commands = (pkg.contributes?.commands as CommandEntry[] | undefined)?.map(c => c.command) || [];
        for (const cmd of ['ecl.submit', 'ecl.compile', 'ecl.checkSyntax']) {
            expect(commands).toContain(cmd);
        }
    });
});
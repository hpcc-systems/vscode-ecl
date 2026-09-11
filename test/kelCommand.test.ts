import { describe, expect, it, vi } from "vitest";

vi.mock("vscode", () => ({
    Diagnostic: class { },
    DiagnosticSeverity: { Information: 0 },
    Position: class { },
    Range: class { }
}));

vi.mock("../src/kel/clientTools", () => ({}));
vi.mock("../src/kel/diagnostic", () => ({}));
vi.mock("../src/util/fs", () => ({}));
vi.mock("../src/util/localize", () => ({ default: (value: string) => value }));

import { isMavenCredentialFailure } from "../src/kel/command";

describe("Maven settings prompt detection", () => {
    it("recognizes Maven repository credential failures", () => {
        expect(isMavenCredentialFailure("", "[ERROR] 401 Unauthorized from kel-compiler-repo1")).toBe(true);
        expect(isMavenCredentialFailure("K50001 - Error executing Maven: authentication failed", "")).toBe(true);
    });

    it("rejects unrelated KEL and authentication failures", () => {
        expect(isMavenCredentialFailure("KEL syntax error", "")).toBe(false);
        expect(isMavenCredentialFailure("Authentication failed for HPCC Platform", "")).toBe(false);
        expect(isMavenCredentialFailure("Unable to find version 1.0", "")).toBe(false);
    });
});
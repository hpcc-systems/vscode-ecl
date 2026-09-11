import { describe, expect, it, vi } from "vitest";
import type * as vscode from "vscode";

vi.mock("vscode", () => ({
    workspace: {
        getConfiguration: () => ({
            get: () => true
        })
    },
    Range: class { }
}));

import { parse } from "../src/kel/parser";

function document(text: string): vscode.TextDocument {
    return {
        getText: () => text,
        positionAt: (offset: number) => offset,
        uri: { path: "/test.kel" }
    } as unknown as vscode.TextDocument;
}

describe("KEL parser model", () => {
    it("collects imports and top-level declarations", () => {
        const text = [
            "IMPORT Customer, Address FROM domain.people;",
            "Person := ENTITY(FLAT(id));",
            "FUNCTION: DisplayName(string value) <= value;",
            "QUERY: FindPerson(string name) <= name;",
            "SHELL: Search(string term) <= term;"
        ].join("\n");

        const parsed = parse(document(text));

        expect(parsed.errors).toEqual([]);
        expect(parsed.imports).toMatchObject([{
            source: "domain.people",
            names: ["Customer", "Address"]
        }]);
        expect(parsed.symbols.map(symbol => [symbol.name, symbol.kind])).toEqual([
            ["Person", "entity"],
            ["DisplayName", "function"],
            ["FindPerson", "query"],
            ["Search", "shell"]
        ]);
        expect(text.slice(parsed.symbols[0].selectionStart, parsed.symbols[0].selectionStop + 1)).toBe("Person");
    });

    it("tracks package members and simple imports", () => {
        const parsed = parse(document([
            "IMPORT shared.types, common;",
            "PACKAGE People;",
            "FUNCTION: FullName(value) <= value;",
            "SHELL: Exported <= FullName;",
            "END;"
        ].join("\n")));

        expect(parsed.imports.map(item => item.source)).toEqual(["shared.types", "common"]);
        expect(parsed.symbols.map(symbol => ({ name: symbol.name, container: symbol.container }))).toEqual([
            { name: "People", container: undefined },
            { name: "FullName", container: "People" },
            { name: "Exported", container: "People" }
        ]);
    });

    it("does not report grammar warnings for embedded ECL snippets", () => {
        const parsed = parse(document([
            "FUNCTION: CastDate(TIMESTAMP value) <= ECL((STRING)value[..8]) RETURNS DATE;",
            "FUNCTION: FindText(STRING value) <= ECL(STD.Str.Find(value, 'text', 1) > 0) FROM STD RETURNS BOOLEAN;"
        ].join("\n")));

        expect(parsed.errors).toEqual([]);
    });

    it("does not report warnings for nested ECL function calls", () => {
        const parsed = parse(document(
            "FUNCTION: SASIndexW(STRING wd, STRING y) <= ECL(IF(REGEXFIND('^' + wd + '$', y), 1, 0)) RETURNS INTEGER;"
        ));

        expect(parsed.errors).toEqual([]);
    });

    it("does not report grammar warnings for ECL in FILTER clauses", () => {
        const parsed = parse(document("USE Customers(FLAT, Customer(FILTER(score > 0 AND name = 'A')));"));

        expect(parsed.errors).toEqual([]);
    });

    it("still reports malformed KEL surrounding an ECL snippet", () => {
        const parsed = parse(document("FUNCTION: CastDate(TIMESTAMP value) <= ECL((STRING)value) RETURNS;"));

        expect(parsed.errors.length).toBeGreaterThan(0);
    });
});
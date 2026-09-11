import { describe, expect, it, vi } from "vitest";

vi.mock("vscode", () => ({}));

import { definitionTarget, identifierAtOffset } from "../src/kel/documentSymbolProvider";
import { Parsed } from "../src/kel/parser";
import { KELSymbol } from "../src/kel/visitor";

const localSymbol: KELSymbol = {
    name: "LocalPerson",
    kind: "entity",
    detail: "ENTITY",
    start: 10,
    stop: 40,
    selectionStart: 10,
    selectionStop: 20
};

const parsed: Parsed = {
    errors: [],
    symbols: [localSymbol],
    imports: [
        {
            source: "domain.people",
            names: ["Customer", "Address"],
            start: 0,
            stop: 40,
            sourceStart: 30,
            sourceStop: 42
        },
        {
            source: "shared.types",
            names: [],
            start: 50,
            stop: 70,
            sourceStart: 57,
            sourceStop: 68
        },
        {
            source: "generated.service",
            names: ["SPC"],
            alias: "service",
            start: 80,
            stop: 110,
            sourceStart: 96,
            sourceStop: 112
        }
    ]
};

describe("KEL language provider helpers", () => {
    it("finds a complete dotted identifier at the cursor", () => {
        const text = "result := types.Customer;";

        expect(identifierAtOffset(text, text.indexOf("Customer") + 2)).toEqual({
            text: "types.Customer",
            start: text.indexOf("types"),
            stop: text.indexOf("Customer") + "Customer".length
        });
    });

    it("resolves local and package-imported symbols", () => {
        expect(definitionTarget(parsed, "LocalPerson")).toEqual({ local: localSymbol });
        expect(definitionTarget(parsed, "Customer")).toEqual({
            source: "domain.people",
            symbol: "Customer"
        });
    });

    it("resolves qualified module members and aliases", () => {
        expect(definitionTarget(parsed, "types.Person")).toEqual({
            source: "shared.types",
            symbol: "Person"
        });
        expect(definitionTarget(parsed, "service.Call")).toEqual({
            source: "generated.service",
            symbol: "Call"
        });
        expect(definitionTarget(parsed, "types")).toEqual({ source: "shared.types" });
    });
});
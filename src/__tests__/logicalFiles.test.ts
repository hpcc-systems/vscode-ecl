// @vitest-environment node
import { describe, expect, it } from "vitest";
import { eclString, logicalFileChildren, logicalFileECL } from "../ecl/logicalFiles";

const ACCOUNTS_ECL = "RECORD\n  unsigned3 personid;\n  string20 account;\n END;\n";
const KEY_ECL = "RECORD\n  unsigned3 personid\n  =>\n  string20 account;\n  unsigned8 recpos;\n END;\n";

describe("logicalFileChildren", () => {
    it("maps the root DFUFileView response (Scope=\"\") to scopes only", () => {
        const children = logicalFileChildren([
            { Directory: "thor", isDirectory: true },
            { Directory: ".", isDirectory: true },
            { Directory: "progguide", isDirectory: true }
        ], "");
        expect(children.scopes).toEqual([
            { label: ".", scope: "." },
            { label: "progguide", scope: "progguide" },
            { label: "thor", scope: "thor" }
        ]);
        expect(children.files).toEqual([]);
    });

    it("treats \".\" as a literal scope", () => {
        const file = { Name: ".::books.json", Directory: "/var/lib/HPCCSystems/hpcc-data/thor", isDirectory: false };
        const children = logicalFileChildren([file], ".");
        expect(children.scopes).toEqual([]);
        expect(children.files).toEqual([{ label: "books.json", file }]);
    });

    it("joins relative sub-scopes to their parent and shortens full file names", () => {
        const accounts = { Name: "progguide::exampledata::accounts", Directory: "/var/lib/HPCCSystems/hpcc-data/thor/progguide/exampledata" };
        const children = logicalFileChildren([
            { Directory: "keys", isDirectory: true },
            accounts,
            { Name: "progguide::exampledata::people" }
        ], "progguide::exampledata");
        expect(children.scopes).toEqual([{ label: "keys", scope: "progguide::exampledata::keys" }]);
        expect(children.files.map(f => f.label)).toEqual(["accounts", "people"]);
        expect(children.files[0].file).toBe(accounts);
    });

    it("does not double-prefix sub-scopes that share the parent name", () => {
        expect(logicalFileChildren([{ Directory: "progguide", isDirectory: true }], "progguide").scopes)
            .toEqual([{ label: "progguide", scope: "progguide::progguide" }]);
    });

    it("ignores rows without names", () => {
        expect(logicalFileChildren([{ isDirectory: true }, {}], "")).toEqual({ scopes: [], files: [] });
    });
});

describe("logicalFileECL", () => {
    it("generates a THOR dataset with a CHOOSEN(50) output for flat files", () => {
        expect(logicalFileECL("progguide::exampledata::accounts", { Ecl: ACCOUNTS_ECL, ContentType: "flat" })).toBe([
            "//  Logical file:  progguide::exampledata::accounts",
            "Layout := RECORD",
            "  unsigned3 personid;",
            "  string20 account;",
            " END;",
            "",
            "ds := DATASET('~progguide::exampledata::accounts', Layout, THOR);",
            "OUTPUT(CHOOSEN(ds, 50));",
            ""
        ].join("\n"));
    });

    it("generates an INDEX for keys", () => {
        const ecl = logicalFileECL("progguide::exampledata::keys::accounts.personid.payload", { Ecl: KEY_ECL, ContentType: "key" });
        expect(ecl).toContain("Layout := RECORD\n  unsigned3 personid\n  =>\n");
        expect(ecl).toContain("idx := INDEX(Layout, '~progguide::exampledata::keys::accounts.personid.payload');\nOUTPUT(CHOOSEN(idx, 50));");
    });

    it.each([
        ["csv", "CSV"],
        ["xml", "XML"],
        ["json", "JSON"],
        ["", "THOR"]
    ])("maps content type %j to %s", (contentType, format) => {
        expect(logicalFileECL("a::b", { Ecl: ACCOUNTS_ECL, ContentType: contentType })).toContain(`ds := DATASET('~a::b', Layout, ${format});`);
    });

    it("keeps a placeholder layout when the platform has no record definition", () => {
        const ecl = logicalFileECL(".::books.json", { Ecl: "", ContentType: "json" });
        expect(ecl).toContain("Layout := RECORD\n    //  TODO:  Record definition is not available for this logical file\n    STRING line;\nEND;");
        expect(ecl).toContain("ds := DATASET('~.::books.json', Layout, JSON);");
    });

    it("escapes logical names and supports custom row counts", () => {
        const ecl = logicalFileECL("~scope::o'brien\\x", { Ecl: "RECORD STRING a; END" }, 10);
        expect(ecl).toContain("Layout := RECORD STRING a; END;");
        expect(ecl).toContain("DATASET('~scope::o\\'brien\\\\x', Layout, THOR);\nOUTPUT(CHOOSEN(ds, 10));");
        expect(() => logicalFileECL("a", {}, 0)).toThrow();
    });

    it("escapes ECL string literals", () => {
        expect(eclString("a'b\\c\nd")).toBe("'a\\'b\\\\c\\nd'");
    });
});

import { describe, expect, it } from "vitest";
import { detectECLCallable, hasTerminalAction } from "../src/ecl/lm/callable";
import { classifyECLTask, isToolValidatedForSource, nextRequiredTool, requiresQualityPipeline } from "../src/ecl/lm/orchestration";
import { reviewECL } from "../src/ecl/lm/review";
import { classifySyntaxStatus, hasSyntaxCheckEvidence, INormalizedSyntaxIssue, normalizeSyntaxIssues, toolchainFailureDetail } from "../src/ecl/lm/syntaxResult";

describe("ECL task classification", () => {
    it("routes generated code through the quality pipeline", () => {
        const kind = classifyECLTask("Write an ECL JOIN for these records");
        expect(kind).toBe("write");
        expect(requiresQualityPipeline(kind)).toBe(true);
    });

    it("keeps generated Roxie code in the write workflow", () => {
        expect(classifyECLTask("Write a Roxie query for this dataset")).toBe("write");
    });

    it("recognizes additional modification verbs", () => {
        expect(classifyECLTask("Optimize this ECL and add a field")).toBe("write");
    });

    it("prioritizes platform requests", () => {
        expect(classifyECLTask("Find failed workunits and explain their errors")).toBe("platform");
    });

    it("classifies explicit review and compile requests", () => {
        expect(classifyECLTask("Review this ECL for production readiness")).toBe("review");
        expect(classifyECLTask("Does this ECL compile?")).toBe("compile");
    });
});

describe("syntax result classification", () => {
    const issue = (severity: string, unresolvedImport = false): INormalizedSyntaxIssue => ({
        filePath: "query.ecl",
        severity,
        message: "diagnostic",
        unresolvedImport,
        sourceAttributed: true,
    });

    it("does not fail compilation for warnings alone", () => {
        expect(classifySyntaxStatus([issue("warning")])).toBe("pass");
    });

    it("returns conditional pass for unresolved imports only", () => {
        expect(classifySyntaxStatus([issue("error", true)])).toBe("conditional_pass");
    });

    it("fails on real compiler errors", () => {
        expect(classifySyntaxStatus([issue("error")])).toBe("fail");
    });

    it("requires compiler output before reporting a result", () => {
        expect(hasSyntaxCheckEvidence([], [])).toBe(false);
        expect(hasSyntaxCheckEvidence([], ["query.ecl"])).toBe(true);
        expect(hasSyntaxCheckEvidence([issue("error")], [])).toBe(true);
    });
});

describe("eclcc toolchain failures", () => {
    // eclcc writes unlocated failures such as "Error: Unable to open logfile" to stderr before it reads the source.
    const toolchainError = [{ severity: "Error", msg: "Unable to open logfile: Permission denied" }];

    it("does not attribute an unlocated eclcc failure to the submitted source", () => {
        const issues = normalizeSyntaxIssues(toolchainError, [], "/tmp/ecl_syntax_check_1.ecl");
        expect(issues[0].sourceAttributed).toBe(false);
        expect(hasSyntaxCheckEvidence(issues, [])).toBe(false);
        expect(toolchainFailureDetail(issues)).toContain("Unable to open logfile");
    });

    it("still treats located diagnostics as real compiler results", () => {
        const issues = normalizeSyntaxIssues(
            [{ filePath: "/tmp/query.ecl", line: 3, col: 5, severity: "error", code: 2167, msg: "Unknown identifier" }],
            ["/tmp/query.ecl"],
            "/tmp/query.ecl"
        );
        expect(issues[0].sourceAttributed).toBe(true);
        expect(hasSyntaxCheckEvidence(issues, ["/tmp/query.ecl"])).toBe(true);
        expect(toolchainFailureDetail(issues)).toBeUndefined();
        expect(classifySyntaxStatus(issues)).toBe("fail");
    });
});

describe("detached snippet checks", () => {
    // A temp copy of ProgGuide/CrossTab.ecl cannot see its sibling DeclareData.ecl via `$`.
    const memberError = [{
        filePath: "/tmp/ecl_syntax_check_1.ecl",
        line: 5,
        col: 13,
        severity: "error",
        msg: "Object does not have a member named 'DeclareData'",
    }];

    it("reports unresolved module members as conditional when the snippet is detached", () => {
        const issues = normalizeSyntaxIssues(memberError, ["/tmp/ecl_syntax_check_1.ecl"], "/tmp/ecl_syntax_check_1.ecl", true);
        expect(issues[0].unresolvedImport).toBe(true);
        expect(classifySyntaxStatus(issues)).toBe("conditional_pass");
    });

    it("keeps them as real errors when the file is checked in place", () => {
        const issues = normalizeSyntaxIssues(memberError, ["/ws/CrossTab.ecl"], "/ws/CrossTab.ecl", false);
        expect(issues[0].unresolvedImport).toBe(false);
        expect(classifySyntaxStatus(issues)).toBe("fail");
    });
});

describe("quality pipeline validation", () => {
    const reviewTool = "ecl-extension-eclCodeReview";
    const syntaxTool = "ecl-extension-syntaxCheck";
    const source = "OUTPUT('validated');";

    it("invalidates tool results for stale source", () => {
        const validations = new Map([
            [reviewTool, { source: "OUTPUT('old');", sequence: 0 }],
            [syntaxTool, { source: "OUTPUT('old');", sequence: 1 }],
        ]);
        expect(nextRequiredTool([reviewTool, syntaxTool], validations, source)).toBe(reviewTool);
        expect(isToolValidatedForSource(syntaxTool, validations, source)).toBe(false);
    });

    it("requires tools to run in pipeline order", () => {
        const validations = new Map([
            [reviewTool, { source, sequence: 1 }],
            [syntaxTool, { source, sequence: 0 }],
        ]);
        expect(nextRequiredTool([reviewTool, syntaxTool], validations, source)).toBe(syntaxTool);
    });

    it("accepts ordered validations for the final source", () => {
        const validations = new Map([
            [reviewTool, { source, sequence: 0 }],
            [syntaxTool, { source, sequence: 1 }],
        ]);
        expect(nextRequiredTool([reviewTool, syntaxTool], validations, source)).toBeUndefined();
    });
});

describe("portable ECL review", () => {
    it("flags an unbounded JOIN", () => {
        const findings = reviewECL("result := JOIN(left, right, LEFT.id = RIGHT.id);");
        expect(findings.some(finding => finding.ruleId === "ECL-JOIN-001" && finding.severity === "medium")).toBe(true);
    });

    it("accepts a bounded JOIN", () => {
        const findings = reviewECL("result := JOIN(left, right, LEFT.id = RIGHT.id, ATMOST(1));");
        expect(findings.some(finding => finding.ruleId === "ECL-JOIN-001")).toBe(false);
    });

    it("scopes findings to individual call sites", () => {
        const findings = reviewECL([
            "bounded := JOIN(a, b, LEFT.id = RIGHT.id, ATMOST(1));",
            "unbounded := JOIN(c, d, LEFT.id = RIGHT.id);",
        ].join("\n"));
        expect(findings.some(finding => finding.ruleId === "ECL-JOIN-001")).toBe(true);
    });

    it("does not let an unrelated MANY suppress a LOOKUP JOIN finding", () => {
        const findings = reviewECL([
            "other := JOIN(a, b, LEFT.id = RIGHT.id, LOOKUP, MANY);",
            "risky := JOIN(c, d, LEFT.id = RIGHT.id, LOOKUP);",
        ].join("\n"));
        expect(findings.some(finding => finding.ruleId === "ECL-JOIN-002" && finding.severity === "high")).toBe(true);
    });

    it("flags FUNCTIONMACRO definitions without LOCAL state", () => {
        const findings = reviewECL("EXPORT AddRows(ds) := FUNCTIONMACRO\n  result := PROJECT(ds, t(LEFT));\n  RETURN result;\nENDMACRO;");
        expect(findings.some(finding => finding.ruleId === "ECL-MACRO-001")).toBe(true);
    });

    it("does not treat the LOCAL join modifier as a LOCAL definition", () => {
        const findings = reviewECL("EXPORT AddRows(ds) := FUNCTIONMACRO\n  result := JOIN(ds, ds, LEFT.id = RIGHT.id, ATMOST(1), LOCAL);\n  RETURN result;\nENDMACRO;");
        expect(findings.some(finding => finding.ruleId === "ECL-MACRO-001")).toBe(true);
    });
});

describe("callable ECL detection", () => {
    it("detects exported callable constructs", () => {
        expect(detectECLCallable("EXPORT AddOne := FUNCTION\n RETURN 1;\nEND;")).toEqual({
            kind: "function",
            name: "AddOne",
        });
    });

    it("distinguishes runnable ECL actions", () => {
        expect(hasTerminalAction("OUTPUT(DATASET([{ 1 }], { INTEGER value }));")).toBe(true);
        expect(hasTerminalAction("EXPORT MyModule := MODULE\nEND;")).toBe(false);
    });
});

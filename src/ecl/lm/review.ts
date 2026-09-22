export type ECLReviewSeverity = "high" | "medium" | "low";

export interface IECLReviewFinding {
    ruleId: string;
    severity: ECLReviewSeverity;
    message: string;
    evidence: string;
    suggestion: string;
}

interface IECLReviewRule {
    ruleId: string;
    severity: ECLReviewSeverity;
    test: (source: string) => boolean;
    message: string;
    evidence: string;
    suggestion: string;
}

// Returns the argument text of each `keyword(...)` call so rules match a single call site rather than the whole file.
function callArguments(source: string, keyword: string): string[] {
    const retVal: string[] = [];
    const pattern = new RegExp(`\\b${keyword}\\s*\\(`, "gi");
    for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
        const start = match.index + match[0].length;
        let depth = 1;
        let pos = start;
        while (pos < source.length && depth > 0) {
            if (source[pos] === "(") {
                ++depth;
            } else if (source[pos] === ")") {
                --depth;
            }
            ++pos;
        }
        if (depth === 0) {
            retVal.push(source.slice(start, pos - 1));
        }
        pattern.lastIndex = start;
    }
    return retVal;
}

const rules: IECLReviewRule[] = [
    {
        ruleId: "ECL-JOIN-001",
        severity: "medium",
        test: source => callArguments(source, "JOIN").some(args => !/\b(ATMOST|KEEP|LIMIT|LOOKUP|ALL)\b/i.test(args)),
        message: "JOIN has no visible cardinality or lookup bound.",
        evidence: "JOIN without ATMOST, KEEP, or a suitable LOOKUP strategy can create unexpectedly large matches.",
        suggestion: "Confirm the intended cardinality and add the appropriate JOIN modifier or bound.",
    },
    {
        ruleId: "ECL-JOIN-002",
        severity: "high",
        test: source => callArguments(source, "JOIN").some(args => /\bLOOKUP\b/i.test(args) && !/\bMANY\b/i.test(args)),
        message: "LOOKUP JOIN does not declare how duplicate right-side keys are handled.",
        evidence: "LOOKUP assumes a single matching right-side row unless MANY is specified.",
        suggestion: "Ensure right-side keys are unique or add MANY when duplicate matches are intentional.",
    },
    {
        ruleId: "ECL-MACRO-001",
        severity: "high",
        test: source => /\bFUNCTIONMACRO\b/i.test(source) && !/^[ \t]*LOCAL\b/im.test(source),
        message: "FUNCTIONMACRO contains no LOCAL definitions.",
        evidence: "Expanded macro definitions can collide when the callable is invoked repeatedly.",
        suggestion: "Mark internal definitions LOCAL unless they are intentionally exported.",
    },
    {
        ruleId: "ECL-INDEX-001",
        severity: "medium",
        test: source => callArguments(source, "INDEX").some(args => /\b(VARSTRING|STRING|UNICODE)\b(?!\s*\d)/i.test(args)),
        message: "INDEX definition appears to use a variable- or unspecified-width key field.",
        evidence: "INDEX key fields require stable fixed-width representations.",
        suggestion: "Use an explicitly sized fixed-width type for key fields and keep variable data in the payload.",
    },
    {
        ruleId: "ECL-CHILD-001",
        severity: "medium",
        test: source => callArguments(source, "DATASET").some(args => /^\s*\{/.test(args) && !/\bMAXCOUNT\s*\(/i.test(args)),
        message: "Inline child DATASET has no MAXCOUNT bound.",
        evidence: "Unbounded child datasets can produce unsafe record sizes and unpredictable resource use.",
        suggestion: "Add a justified MAXCOUNT bound to the child dataset definition.",
    },
    {
        ruleId: "ECL-STRING-001",
        severity: "medium",
        test: source => /\bSTRING\d+\b[^;\n]*\+/i.test(source),
        message: "Fixed-width STRING concatenation may retain padding or truncate the result.",
        evidence: "Fixed-width ECL strings preserve their declared width during string operations.",
        suggestion: "TRIM inputs deliberately and assign the result to a sufficiently sized or variable-width type.",
    },
    {
        ruleId: "ECL-DISTRIBUTE-001",
        severity: "medium",
        test: source => /\b(NORMALIZE|ROLLUP)\s*\(/i.test(source) && !/\bDISTRIBUTE\s*\(/i.test(source),
        message: "A potentially expansion-heavy operation has no visible distribution strategy.",
        evidence: "NORMALIZE and ROLLUP can amplify existing data skew on Thor.",
        suggestion: "Check graph skew and use DISTRIBUTE on an appropriate key when the input is uneven.",
    },
    {
        ruleId: "ECL-ACTION-001",
        severity: "low",
        test: source => /\bMODULE\b/i.test(source) && /\bOUTPUT\s*\(/i.test(source) && !/\bWHEN\s*\(/i.test(source),
        message: "MODULE contains an OUTPUT action without an explicit WHEN dependency.",
        evidence: "Actions drive ECL execution; placing an action in a module does not make it a return value.",
        suggestion: "Expose definitions from the module and sequence side effects explicitly with WHEN when required.",
    },
];

export function reviewECL(source: string): IECLReviewFinding[] {
    return rules
        .filter(rule => rule.test(source))
        .map(({ test: _test, ...finding }) => finding);
}


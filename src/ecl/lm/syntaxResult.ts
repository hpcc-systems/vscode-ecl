export interface INormalizedSyntaxIssue {
    filePath: string;
    line?: number;
    column?: number;
    severity: string;
    code?: string;
    message: string;
    unresolvedImport: boolean;
    //  False when eclcc could not attribute the diagnostic to a source location, e.g. toolchain failures such as an unwritable log file.
    sourceAttributed: boolean;
}

export type SyntaxCheckStatus = "pass" | "conditional_pass" | "fail";

// eclcc error 2081 is "Import names unknown module", raised for imports eclcc can't resolve outside a full workspace/repo checkout.
const ECLCC_UNKNOWN_IMPORT_CODE = "2081";
const UNRESOLVED_IMPORT = /unknown module|cannot resolve.*import/i;
//  A snippet compiled outside its own folder loses `$` and relative IMPORTs, so member lookups against them fail spuriously.
const DETACHED_MODULE_REFERENCE = /does not have a member named/i;

export function normalizeSyntaxIssues(errors: any[], checked: string[], fallbackPath: string, detached = false): INormalizedSyntaxIssue[] {
    return errors.map(error => {
        const message = error.msg || error.message || "Unknown syntax issue";
        const code = error.code ? String(error.code) : undefined;
        const sourcePath = typeof error.filePath === "string" && error.filePath.length > 0 ? error.filePath : undefined;
        return {
            filePath: sourcePath ?? checked[0] ?? fallbackPath,
            line: typeof error.line === "number" ? error.line : undefined,
            column: typeof error.col === "number" ? error.col : undefined,
            severity: typeof error.severity === "string" ? error.severity : "error",
            code,
            message,
            unresolvedImport: code === ECLCC_UNKNOWN_IMPORT_CODE ||
                UNRESOLVED_IMPORT.test(message) ||
                (detached && DETACHED_MODULE_REFERENCE.test(message)),
            sourceAttributed: sourcePath !== undefined,
        };
    });
}

export function classifySyntaxStatus(issues: INormalizedSyntaxIssue[]): SyntaxCheckStatus {
    const errors = issues.filter(issue => ["error", "fatal"].includes(issue.severity.toLowerCase()));
    if (errors.length === 0) {
        return "pass";
    }
    return errors.every(issue => issue.unresolvedImport) ? "conditional_pass" : "fail";
}

export function hasSyntaxCheckEvidence(issues: INormalizedSyntaxIssue[], checked: string[]): boolean {
    return checked.length > 0 || issues.some(issue => issue.sourceAttributed);
}

// eclcc diagnostics with no source location describe a toolchain failure, not the submitted ECL.
export function toolchainFailureDetail(issues: INormalizedSyntaxIssue[]): string | undefined {
    const details = issues.filter(issue => !issue.sourceAttributed).map(issue => issue.message);
    return details.length > 0 ? details.join("; ") : undefined;
}


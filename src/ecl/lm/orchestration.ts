export type ECLTaskKind = "explain" | "write" | "review" | "compile" | "platform";

const PLATFORM_TERMS = /\b(workunits?|wuid|logical files?|clusters?|thor|roxie|hthor|metrics?|jobs?)\b/i;
const COMPILE_TERMS = /\b(compile|syntax check|validate|compiler error|does this compile)\b/i;
const REVIEW_TERMS = /\b(review|audit|production ready|best practice|performance issue|code quality)\b/i;
const WRITE_TERMS = /\b(write|create|generate|refactor|rewrite|fix|implement|modify|change|add|remove|update|edit|replace|adjust|extend|convert|migrate|improve|optimi[sz]e)\b/i;

export interface IToolValidation {
    source: string;
    sequence: number;
}

export function normalizeECLSource(source: unknown): string {
    return typeof source === "string" ? source.trim() : "";
}

export function nextRequiredTool(
    requiredTools: string[],
    validations: ReadonlyMap<string, IToolValidation>,
    finalSource: string
): string | undefined {
    const normalizedSource = normalizeECLSource(finalSource);
    let previousSequence = -1;
    return requiredTools.find(tool => {
        const validation = validations.get(tool);
        if (
            !validation ||
            validation.sequence <= previousSequence ||
            (normalizedSource.length > 0 && validation.source !== normalizedSource)
        ) {
            return true;
        }
        previousSequence = validation.sequence;
        return false;
    });
}

export function isToolValidatedForSource(
    tool: string,
    validations: ReadonlyMap<string, IToolValidation>,
    source: string
): boolean {
    const validation = validations.get(tool);
    return !!validation && validation.source === normalizeECLSource(source);
}

export function classifyECLTask(prompt: string): ECLTaskKind {
    if (COMPILE_TERMS.test(prompt)) {
        return "compile";
    }
    if (REVIEW_TERMS.test(prompt)) {
        return "review";
    }
    if (WRITE_TERMS.test(prompt)) {
        return "write";
    }
    if (PLATFORM_TERMS.test(prompt)) {
        return "platform";
    }
    return "explain";
}

export function requiresQualityPipeline(kind: ECLTaskKind): boolean {
    return kind === "write";
}

export const MAX_TOOL_ITERATIONS = 12;
export const MAX_REPAIR_ATTEMPTS = 3;

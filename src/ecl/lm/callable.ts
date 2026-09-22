export type ECLCallableKind = "function" | "functionmacro" | "macro" | "module";

export interface IECLCallable {
    kind: ECLCallableKind;
    name?: string;
}

export function detectECLCallable(source: string): IECLCallable | undefined {
    const match = source.match(/\b(?:(?:EXPORT|SHARED)\s+([A-Za-z_]\w*)\s*:=\s*)?(FUNCTIONMACRO|FUNCTION|MACRO|MODULE)\b/i);
    if (!match) {
        return undefined;
    }

    return {
        name: match[1],
        kind: match[2].toLowerCase() as ECLCallableKind,
    };
}

export function hasTerminalAction(source: string): boolean {
    return /\b(OUTPUT|BUILD|APPLY)\s*\(/i.test(source);
}


import type { WsDfu } from "@hpcc-js/comms";

export const DEFAULT_PREVIEW_ROWS = 50;

export interface LogicalFileScope {
    label: string;
    scope: string;
}

export interface LogicalFileEntry {
    label: string;
    file: WsDfu.DFULogicalFile;
}

export interface LogicalFileChildren {
    scopes: LogicalFileScope[];
    files: LogicalFileEntry[];
}

//  DFUFileView returns scope names relative to the requested scope and file names fully qualified;
//  the root request uses Scope="" and "." is a literal scope (e.g. ".::books.json").
export function logicalFileChildren(rows: WsDfu.DFULogicalFile[], scope = ""): LogicalFileChildren {
    const scopes = new Map<string, LogicalFileScope>();
    const files = new Map<string, LogicalFileEntry>();
    const prefix = scope ? `${scope}::` : "";
    for (const row of rows) {
        const fullName = row.isDirectory ? row.Directory : row.Name;
        if (!fullName) continue;
        const normalized = fullName.replace(/^::/, "");
        const name = row.isDirectory && prefix && !normalized.startsWith(prefix) ? `${prefix}${normalized}` : normalized;
        if (!name.startsWith(prefix)) continue;
        const remainder = name.substring(prefix.length);
        const separator = remainder.indexOf("::");
        if (row.isDirectory || separator >= 0) {
            const label = separator >= 0 ? remainder.substring(0, separator) : remainder;
            scopes.set(label, { label, scope: `${prefix}${label}` });
        } else {
            files.set(row.Name, { label: remainder, file: row });
        }
    }
    const byLabel = (left: { label: string }, right: { label: string }) => left.label.localeCompare(right.label);
    return {
        scopes: [...scopes.values()].sort(byLabel),
        files: [...files.values()].sort(byLabel)
    };
}

export function eclString(value: string): string {
    return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n")}'`;
}

export interface LogicalFileDefinition {
    Ecl?: string;
    ContentType?: string;
    Format?: string;
    isSuperfile?: boolean;
}

function datasetFormat(detail: LogicalFileDefinition): "THOR" | "CSV" | "XML" | "JSON" | "INDEX" {
    const kind = `${detail.ContentType || ""} ${detail.Format || ""}`.toLowerCase();
    if (/\bkey\b/.test(kind)) return "INDEX";
    if (/\bcsv\b/.test(kind)) return "CSV";
    if (/\bxml\b/.test(kind)) return "XML";
    if (/\bjson\b/.test(kind)) return "JSON";
    return "THOR";
}

export function logicalFileECL(name: string, detail: LogicalFileDefinition, rows = DEFAULT_PREVIEW_ROWS): string {
    if (!Number.isSafeInteger(rows) || rows < 1) throw new Error("rows must be a positive integer");
    const ecl = detail.Ecl?.trim();
    const layout = ecl ? (ecl.endsWith(";") ? ecl : `${ecl};`) : "RECORD\n    //  TODO:  Record definition is not available for this logical file\n    STRING line;\nEND;";
    const fileName = eclString(`~${name.replace(/^~/, "")}`);
    const format = datasetFormat(detail);
    const source = format === "INDEX" ?
        `idx := INDEX(Layout, ${fileName});\nOUTPUT(CHOOSEN(idx, ${rows}));` :
        `ds := DATASET(${fileName}, Layout, ${format});\nOUTPUT(CHOOSEN(ds, ${rows}));`;
    return `//  Logical file:  ${name.replace(/[\r\n]+/g, " ")}\nLayout := ${layout}\n\n${source}\n`;
}

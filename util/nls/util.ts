import * as fs from "fs";

export const outDir = "./tmp";

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

export function encodeKey(id: string): string {
    if (!id) return id;
    const symbols = [];//[" ", "_", "+", "-", ".", ",", "(", ")", "'", "\"", "/", "\\"];
    symbols.forEach(s => {
        id = id.split(s).join("_");
    });
    return id;
}

export function sortAndWrite(filePath: string, obj: object) {
    const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    const tmp = {};
    keys.forEach(k => tmp[k] = obj[k]);
    fs.writeFileSync(filePath, JSON.stringify(tmp, undefined, 4), "utf-8");
}

import * as fs from "fs";
import * as path from "path";

import { sortAndWrite } from "./util";

const locales = ["bs", "es", "fr", "hr", "hu", "pt-br", "sr", "zh"];

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const en = JSON.parse(fs.readFileSync("./package.nls.json", "utf-8"));

function fix(item: any, what: string): boolean {
    let key = item[what];
    if (key === undefined) return false;
    let retVal = false;
    if (key[0] !== "%" || key[key.length - 1] !== "%") {
        key = `%${key}%`;
        item[what] = key;
        retVal = retVal || true;
    }
    key = key.substring(1, key.length - 1);
    if (!en[key]) {
        en[key] = key;
        retVal = retVal || true;
    }
    return retVal;
}

export function fixPackage() {

    let touched = false;
    for (const key in pkg.contributes.commands) {
        const item = pkg.contributes.commands[key];
        touched = fix(item, "title") || touched;
        touched = fix(item, "description") || touched;
    }

    for (const key in pkg.contributes.configuration.properties) {
        const item = pkg.contributes.configuration.properties[key];
        touched = fix(item, "description") || touched;
    }

    for (const key in pkg.contributes.debuggers[0].configurationAttributes.launch.properties) {
        const item = pkg.contributes.debuggers[0].configurationAttributes.launch.properties[key];
        touched = fix(item, "description") || touched;
    }

    for (const key in pkg.contributes.debuggers[0].configurationSnippets) {
        const item = pkg.contributes.debuggers[0].configurationSnippets[key];
        touched = fix(item, "description") || touched;
    }

    if (touched) {
        fs.writeFileSync("./package.json", JSON.stringify(pkg, undefined, 2), "utf-8");
        sortAndWrite("./package.nls.json", en);
    }
}

const localizeRegex = /localize\("(.*?)"\)/gm;

function extractStrs(filePath: string, found: object) {
    const content = fs.readFileSync(filePath, "utf-8");
    let match = localizeRegex.exec(content);
    while (match != null) {
        found[match[1]] = true;
        match = localizeRegex.exec(content);
    }
}

function traverseDir(dir, found: object) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath, found);
        } else {
            extractStrs(fullPath, found);
        }
    });
}

export function updateLocaleFiles() {
    const found = {};
    traverseDir("./src", found);

    locales.forEach(l => {
        const otherFile = `./package.nls.${l}.json`;
        const otherFileMissing = `./tmp/package.nls.${l}.missing.json`;
        let other = {};
        if (fs.existsSync(otherFile)) {
            other = JSON.parse(fs.readFileSync(otherFile, "utf-8"));
        } else {
            sortAndWrite(otherFile, {});
        }

        const otherMissing = {};
        let touched = false;
        for (const key in en) {
            if (other[key] === undefined) {
                otherMissing[key] = "";
                touched = true;
            }
        }

        for (const key in found) {
            if (other[key] === undefined) {
                otherMissing[key] = "";
                touched = true;
            }
        }

        if (touched) {
            sortAndWrite(otherFileMissing, otherMissing);
        }
    });
}


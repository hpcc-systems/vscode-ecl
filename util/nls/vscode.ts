import * as fs from "fs";
import * as path from "path";
import * as child from "child_process";
import { sortAndWrite } from "./util";

const locales = ["es", "fr", "pt-br", "zh"]; // "bs", "es", "fr", "hr", "hu", "pt-br", "sr", "zh"
const prevWeeks = ["Last Week", "Two Weeks Ago", "Three Weeks Ago", "Four Weeks Ago", "Five Weeks Ago", "Six Weeks Ago", "Seven Weeks Ago"];
const tmpDir = "./tmp/";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const en = JSON.parse(fs.readFileSync("./package.nls.json", "utf-8"));

export function initLocales() {
    prevWeeks.forEach( (week) => {
        if (en[week] === undefined) {
            en[week] = week;
        }
    });
}

export function googleTrans() {
    runPythonScript("./util/googtrans.py")
    .then((output) => {
        console.log("Google translation complete");
    })
    .catch((error) => {
        console.error(`Error executing Python script: ${error.message}`);
    }); 
}

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

    for (const key in pkg.contributes.submenus) {
        const item = pkg.contributes.submenus[key];
        touched = fix(item, "label") || touched;
    }
    
    for (const key in pkg.contributes.views) {
        const items = pkg.contributes.views[key];
        for (const k in items) {
            const item = items[k];
            touched = fix(item, "name") || touched;
        }
    }

    for (const key in pkg.contributes.configuration.properties) {
        const item = pkg.contributes.configuration.properties[key];
        touched = fix(item, "description") || touched;
    }

    for (const key in pkg.contributes.notebooks) {
        const item = pkg.contributes.notebooks[key];
        touched = fix(item, "displayName") || touched;
    }

    for (const key in pkg.contributes.notebookRenderer) {
        const item = pkg.contributes.notebookRenderer[key];
        touched = fix(item, "displayName") || touched;
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
        sortAndWrite(tmpDir + "package.nls.missing.json", en);
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

async function runPythonScript(scriptPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const pythonProcess = child.spawn("python", [scriptPath]);

        let stdoutData = "";
        let stderrData = "";

        pythonProcess.stdout.on("data", (data) => {
            stdoutData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on("exit", (code) => {
            if (code === 0) {
                resolve(stdoutData.trim());
            } else {
                reject(new Error(`Python process exited with code ${code}. Error: ${stderrData.trim()}`));
            }
        });
    });
}

export function updateLocaleFiles() {
    initLocales();
    const found = {};

    traverseDir("./src", found);

    locales.forEach(l => {
        const otherFile = `./package.nls.${l}.json`;
        const otherFileMissing = `${tmpDir}package.nls.${l}.missing.json`;
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

function mergeLocal(origFile: string, missingFile: string): void {

    if (!fs.existsSync(path.join("./", origFile))) {
        console.log(`Original file not found: ${origFile}`);
        return;
    }
    
    if (!fs.existsSync(path.join(tmpDir, missingFile))) {
        console.log(`Translation file not found: ${missingFile}`);
        return;
    }

    let currentData: any;
    let newData: any;
    try {
        currentData = JSON.parse(fs.readFileSync(path.join("./", origFile), "utf-8"));
        newData = JSON.parse(fs.readFileSync(path.join(tmpDir, missingFile), "utf-8"));
    } catch (err) {
        console.error(`Error reading files: ${err}`);
        return;
    }

    for (const fieldName in newData) {
        if (!(fieldName in currentData)) {
            currentData[fieldName] = newData[fieldName];
        }
    }

    const mergedFile: string = path.join(tmpDir, origFile);
    sortAndWrite(mergedFile, currentData);
}

export function mergeLocales() {
    for (const fileName of fs.readdirSync(tmpDir)) {
        if (fileName.startsWith("package.nls.") && fileName.includes(".trans.")) {
            mergeLocal(fileName.replace(".trans.", "."), fileName);
        } else if (fileName == "package.nls.missing.json") {
            mergeLocal(fileName.replace(".missing.", "."), fileName);
        }
    }
}


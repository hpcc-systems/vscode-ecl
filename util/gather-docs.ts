import { readdir, stat } from "node:fs/promises";
import * as path from "node:path";
import { spawn } from "node:child_process";

async function convertDocBookToMarkdown(inputFile: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const pandoc = spawn("pandoc", ["-f", "docbook", "-t", "markdown", "-s", inputFile]);

        let output: string = "";
        let errorOutput = "";

        pandoc.stdout.on("data", (data) => {
            output += data.toString();
        });

        pandoc.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        pandoc.on("close", (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Pandoc process exited with code ${code}: ${errorOutput}`));
            }
        });
    });
}

async function urlExists(partialUrl: string): Promise<boolean> {
    try {
        const response = await fetch(`https://hpccsystems.com/wp-content/uploads/_documents/${partialUrl}`);
        if (response?.ok) {
            return true;
        }
    } catch (e) {
        console.error("Error checking URL:", e);
    }
    return false;
}

async function* chunkMarkdown(md: string, urlPrefix: string) {
    let url = "";
    let bookmark = "";
    let content = "";
    for (let line of md.split("\n")) {
        const urlStart = line.indexOf("{#");
        let nextUrl = "";
        if (urlStart >= 0) {
            const urlEnd = line.indexOf("}", urlStart);
            nextUrl = line.substring(urlStart + 2, urlEnd);
            line = line.substring(0, urlStart);
        }
        if (nextUrl) {
            if (await urlExists(`${urlPrefix}/${nextUrl}.html`)) {
                if (url && content) {
                    yield { url, bookmark, content };
                }
                url = `${urlPrefix}/${nextUrl}.html`;
                bookmark = "";
                content = "";
            } else if (url) {
                if (url && content) {
                    yield { url, bookmark, content };
                }
                bookmark = `#${nextUrl}`;
                content = "";
            } else {
            }
        }
        content += line + "\n";
    }
    if (url && content) {
        yield { url, bookmark, content };
    }
}

export async function* findXmlFiles(dir: string, urlPrefix: string) {

    try {
        const files = await readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const fileStat = await stat(filePath);

            if (fileStat.isDirectory()) {
                yield* findXmlFiles(filePath, urlPrefix);
            } else if (filePath.endsWith(".xml")) {
                yield* chunkMarkdown(await convertDocBookToMarkdown(filePath), urlPrefix);
            }
        }
    } catch (e) {
        console.error("Error reading directory:", e);
    }
}

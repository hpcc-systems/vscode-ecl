import path from "node:path";
import { writeFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Zstd } from "@hpcc-js/wasm-zstd";
import { findXmlFiles } from "./gather-docs";

const myYargs = yargs.default(hideBin(process.argv)) as yargs.Argv<{}>;
myYargs
    .usage("Usage: node ./dist-util/index-docs.mjs [options] path/to/hpcc-platfornm/docs")
    .demandCommand(1, 1)
    .example("node ./dist-util/index-docs.mjs --dry-run ~/HPCC-Platform/docs")
    .alias("d", "dry-run")
    .boolean("d")
    .describe("d", "Dry run (won't write any output files).")
    .help("h")
    .alias("h", "help")
    .epilog("https://github.com/hpcc-systems/vscode-ecl")
    ;

const argv = await myYargs.argv;

class OllamaEmbeddingsEx extends OllamaEmbeddings {

    constructor(fields?) {
        super(fields);
    }

    embedDocuments(documents: string[]): Promise<number[][]> {
        return super.embedDocuments(documents).then(embeddings => {
            return embeddings;
        });
    }

    embedQuery(document: string): Promise<number[]> {
        return super.embedQuery(document).then(embedding => {
            return embedding;
        });
    }
}

function serializeStore(store: MemoryVectorStore): string {
    const serializeData = {
        vectors: store.memoryVectors,
        vserion: 1,
        isMemoryVectorStore: true
    };
    return JSON.stringify(serializeData);
}

async function saveStore(store: MemoryVectorStore, path: string) {
    const zstd = await Zstd.load();
    const str = serializeStore(store);
    const encoder = new TextEncoder();
    const encodedString = encoder.encode(str);
    const compressed = zstd.compress(encodedString);
    return writeFile(path, compressed);
}

async function calcEmbeddings(vectorStore: MemoryVectorStore, dir: string, urlPrefix: string, dryRun: boolean) {
    const splitter = new RecursiveCharacterTextSplitter();
    for await (const file of findXmlFiles(path.resolve(dir), urlPrefix)) {
        console.log(`https://hpccsystems.com/wp-content/uploads/_documents/${file.url}${file.bookmark}`);
        const childDocs = await splitter.splitText(file.content);
        if (!dryRun) {
            await Promise.all(childDocs.map(childDoc => {
                console.log("Calculating embedding...", childDoc.length);
                return vectorStore.addDocuments([{
                    metadata: {
                        url: file.url,
                    },
                    pageContent: childDoc
                }]);
            }));
        }
    }
}

const documentationDirectories = [
    "EN_US/ECLProgrammersGuide/PRG_Mods",
    "EN_US/ECLLanguageReference/ECLR_mods",
    "EN_US/ECLStandardLibraryReference/SLR-Mods",
];

async function resolveDocsFolder(input: string): Promise<string> {
    let resolvedInput = input;
    if (resolvedInput[0] === "~") {
        resolvedInput = path.join(homedir(), resolvedInput.slice(1));
    }

    const candidates = [path.resolve(resolvedInput), path.resolve(resolvedInput, "docs")];
    for (const candidate of candidates) {
        try {
            await Promise.all(documentationDirectories.map(async relativePath => {
                const fileStat = await stat(path.join(candidate, relativePath));
                if (!fileStat.isDirectory()) {
                    throw new Error(`${path.join(candidate, relativePath)} is not a directory.`);
                }
            }));
            return candidate;
        } catch {
            // Try the next supported checkout layout.
        }
    }

    throw new Error(`Docs path does not contain the expected HPCC documentation directories: ${input}`);
}

try {
    const docsFolder = await resolveDocsFolder(argv._[0] as string);

    const ollamaEmbedding = new OllamaEmbeddingsEx({
        model: "ecl-nomic-embed-text",
        truncate: true
    });

    const vectorStore = new MemoryVectorStore(ollamaEmbedding);
    const dryRun = Boolean(argv["dry-run"]);
    await Promise.all([
        calcEmbeddings(vectorStore, `${docsFolder}/EN_US/ECLProgrammersGuide/PRG_Mods`, "ProgrammersGuide_EN_US", dryRun),
        calcEmbeddings(vectorStore, `${docsFolder}/EN_US/ECLLanguageReference/ECLR_mods`, "ECLR_EN_US", dryRun),
        calcEmbeddings(vectorStore, `${docsFolder}/EN_US/ECLStandardLibraryReference/SLR-Mods`, "SLR_EN_US", dryRun),
    ]);

    if (!dryRun) {
        await saveStore(vectorStore, "./util/docs.vecdb");
    }
} catch (e) {
    console.error("Error:", e.message, "\n");
    myYargs.showHelp();
    process.exit(1);
} finally {
    process.exit(0);
}


import path from "node:path";
import { writeFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import * as yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Zstd } from "@hpcc-js/wasm-zstd";
import { findXmlFiles } from "./gather-docs";

const myYargs = yargs.default(hideBin(process.argv)) as yargs.Argv<{}>;
myYargs
    .usage("Usage: node ./dist-util/index-docs.mjs [options] path/to/hpcc-platfornm/docs")
    .demandCommand(0, 1)
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

async function calcEmbeddings(vectorStore: MemoryVectorStore, dir: string, urlPrefix: string) {
    const splitter = new RecursiveCharacterTextSplitter();
    for await (const file of findXmlFiles(path.resolve(dir), urlPrefix)) {
        console.log(`https://hpccsystems.com/wp-content/uploads/_documents/${file.url}${file.bookmark}`);
        const childDocs = await splitter.splitText(file.content);
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

try {
    let docsFolder = argv._[0] as string;
    if (docsFolder[0] === "~") {
        docsFolder = path.join(homedir(), docsFolder.slice(1));
    }
    docsFolder = path.resolve(docsFolder);
    const fileStat = await stat(docsFolder);
    if (!fileStat.isDirectory()) {
        throw new Error("Docs path does not exist.");
    }

    const ollamaEmbedding = new OllamaEmbeddingsEx({
        model: "bge-base-en-v1.5-q4_k_m",
        truncate: true
    });

    const vectorStore = new MemoryVectorStore(ollamaEmbedding);
    await Promise.all([
        calcEmbeddings(vectorStore, `${docsFolder}/EN_US/ECLProgrammersGuide/PRG_Mods`, "ProgrammersGuide_EN_US"),
        calcEmbeddings(vectorStore, `${docsFolder}/EN_US/ECLLanguageReference/ECLR_mods`, "ECLR_EN_US"),
        calcEmbeddings(vectorStore, `${docsFolder}/EN_US/ECLStandardLibraryReference/SLR-Mods`, "SLR_EN_US"),
    ]);

    if (!argv["dry-run"]) {
        saveStore(vectorStore, "./util/docs.vecdb");
    }
} catch (e) {
    console.error("Error:", e.message, "\n");
    myYargs.showHelp();
    process.exit(1);
} finally {
    process.exit(0);
}


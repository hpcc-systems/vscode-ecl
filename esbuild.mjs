import { context } from "esbuild";
import process from "process";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: "esbuild-problem-matcher",

    setup(build) {
        build.onStart(() => {
            console.log("[watch] build started");
        });
        build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                console.error(`    ${location.file}:${location.line}:${location.column}:`);
            });
            console.log("[watch] build finished");
        });
    },
};

async function extension() {
    const ctx = await context({
        entryPoints: [
            "src/extension.ts",
            "src/debugger.ts"
        ],
        bundle: true,
        format: "cjs",
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: "node",
        outdir: "dist",
        external: ["vscode"],
        // logLevel: "silent",
        plugins: [
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
        ],
    });
    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

async function notebook() {
    const ctx = await context({
        entryPoints: [
            "src/eclwatch.tsx",
            "src/notebook/renderers/wuRenderer.tsx",
            "src/notebook/renderers/ojsRenderer.ts"
        ],
        bundle: true,
        format: "esm",
        minify: true,
        sourcemap: !production,
        sourcesContent: false,
        platform: "browser",
        outdir: "dist",
        external: ["vscode", "fs", "path", "os"],
        // logLevel: "silent",
        plugins: [
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
        ],
    });
    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

async function web_extension() {
    const ctx = await context({
        entryPoints: [
            "src/web-extension.ts"
        ],
        bundle: true,
        format: "esm",
        minify: production,
        sourcemap: !production,
        sourcesContent: false,
        platform: "browser",
        outfile: "dist-web/extension.js",
        external: ["vscode", "fs", "path", "os"],
        // logLevel: "silent",
        plugins: [
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
        ],
    });
    if (watch) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

Promise.all([extension(), notebook(), web_extension()])
    .then(() => {
    }).catch(e => {
        console.error(e);
        process.exit(1);
    });

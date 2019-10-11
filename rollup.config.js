import alias from "rollup-plugin-alias";
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from "rollup-plugin-postcss";

const pkg = require("./package.json");

const node_libs = [
    "buffer",
    "child_process",
    "crypto",
    "events",
    "fs",
    "http",
    "https",
    "net",
    "os",
    "path",
    "process",
    "stream",
    "timers",
    "url",
    "zlib"
];

export const isVSCode = (id) => id === "vscode";
export const isNode = (id) => node_libs.indexOf(id) >= 0;
export const isHpcc = (id) => id.indexOf("@hpcc-js") === 0;

export function external(id) {
    return isVSCode(id) || isNode(id);
}

const plugins = [
    alias({
    }),
    nodeResolve({
        preferBuiltins: true
    }),
    commonjs({
        namedExports: {
        }
    }),
    sourcemaps(),
    postcss({
        extensions: [".css"],
        minimize: true
    })
];

export default [{
    input: "lib-es6/extension",
    external: external,
    output: [{
        file: pkg.main,
        format: "commonjs",
        sourcemap: true,
        name: pkg.name
    }],
    plugins
}, {
    input: "lib-es6/debugger",
    external: external,
    output: [{
        file: "./dist/debugger.js",
        format: "commonjs",
        sourcemap: true,
        name: pkg.name
    }],
    plugins
}];

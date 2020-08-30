/* eslint-disable */

"use strict";

const path = require("path");
const webpack = require("webpack");

/**@type {import('webpack').Configuration}*/
const config = [{
    target: "node", // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

    entry: {
        extension: "./lib-es6/extension.js",
        debugger: "./lib-es6/debugger.js"
    },

    output: { // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "commonjs2",
        globalObject: "this",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    devtool: "source-map",

    externals: {
        vscode: "commonjs vscode" // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },

    resolve: {
    },

    plugins: []
}, {
    target: "web", // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

    entry: {
        eclwatch: "./lib-es6/eclwatch.js"
    },

    output: { // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd",
        globalObject: "this",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    devtool: "source-map",

    externals: {
        vscode: "commonjs vscode" // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    },

    resolve: {
    },

    plugins: []
}];

module.exports = config;
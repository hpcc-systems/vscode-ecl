import * as vscode from "vscode";
import { Antlr4Error, ErrorListener } from "../util/errorListener";
import antlr4 from "antlr4";

import KELLexer from "../grammar/kel/KELLexer";
import KELParser from "../grammar/kel/KELParser";
import { ECLLocation, KELImport, KELSymbol, KELVisitor } from "./visitor";

export interface Parsed {
    errors: Antlr4Error[];
    imports: KELImport[];
    symbols: KELSymbol[];
}

export const isBoolean = (str: string) => str === "boolean";
export const isString = (str: string) => str === "string";
export const isNumber = (str: string) => str === "number";

function embeddedECLLocations(tokens: antlr4.CommonTokenStream): ECLLocation[] {
    tokens.fill();
    const locations: ECLLocation[] = [];
    for (let i = 0; i < tokens.tokens.length; ++i) {
        if (tokens.tokens[i].type !== KELLexer.ECL && tokens.tokens[i].type !== KELLexer.FILTER) {
            continue;
        }
        let depth = 0;
        let start: number | undefined;
        for (let j = i + 1; j < tokens.tokens.length; ++j) {
            const token = tokens.tokens[j];
            if (token.type === KELLexer.LP) {
                if (depth === 0) {
                    start = token.stop + 1;
                }
                ++depth;
            } else if (token.type === KELLexer.RP && depth > 0) {
                --depth;
                if (depth === 0 && start !== undefined) {
                    locations.push({ start, stop: token.stop });
                    i = j;
                    break;
                }
            }
        }
    }
    return locations;
}

export function parse(doc: vscode.TextDocument): Parsed {
    const errorListener = new ErrorListener(doc);
    const retVal: Parsed = {
        errors: [],
        imports: [],
        symbols: []
    };
    const chars = new antlr4.InputStream(doc.getText());
    const lexer = new KELLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const opaqueECLLocations = embeddedECLLocations(tokens);
    const parser = new KELParser(tokens);
    parser.buildParseTrees = true;
    const errorListener2 = parser.getErrorListener();
    errorListener2.delegates[0] = errorListener;
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    try {
        const tree = parser.program();
        const visitor = new KELVisitor(opaqueECLLocations);
        visitor.visitProgram(tree);
        retVal.imports = visitor.imports;
        retVal.symbols = visitor.symbols;
        const kelConfig = vscode.workspace.getConfiguration("kel", doc.uri);
        retVal.errors = kelConfig.get("syntaxCheckFromGrammar")
            ? errorListener.errors.filter(error => !visitor.eclBodyContains(error.start, error.stop))
            : [];
    } catch (e) {
        console.log(e);
    }
    return retVal;
}

import * as vscode from "vscode";
import { Antlr4Error, ErrorListener } from "../util/errorListener";

import * as antlr4 from "antlr4";
import { KELLexer } from "../../src/grammar/kel/KELLexer";
import { KELParser } from "../../src/grammar/kel/KELParser";
// import { KELParserVisitor } from "../../src/grammar/kel/KELParserVisitor";

interface Parsed {
    errors: Antlr4Error[];
}

export const isBoolean = (str: string) => str === "boolean";
export const isString = (str: string) => str === "string";
export const isNumber = (str: string) => str === "number";
export function parse(doc: vscode.TextDocument): Parsed {
    const errorListener = new ErrorListener(doc);
    const retVal: Parsed = {
        errors: []
    };
    const chars = new antlr4.InputStream(doc.getText());
    const lexer = new KELLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new KELParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    try {
        //  TODO
        // const tree = parser.program();
        // const program = new KELParserVisitor();
        // antlr4.tree.ParseTreeWalker.DEFAULT.walk(program, tree);
    } catch (e) {
        console.log(e);
    }
    retVal.errors = errorListener.errors;
    return retVal;
}

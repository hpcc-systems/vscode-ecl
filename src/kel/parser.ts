import * as vscode from "vscode";
import { Antlr4Error, ErrorListener } from "../util/errorListener";
import antlr4 from "antlr4";

import KELLexer from "../grammar/kel/KELLexer";
import KELParser from "../grammar/kel/KELParser";
import { KELVisitor } from "./visitor";

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
    const errorListener2 = parser.getErrorListener();
    errorListener2.delegates[0] = errorListener;
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    try {
        const tree = parser.program();
        const visitor = new KELVisitor();
        visitor.visitProgram(tree);
        const kelConfig = vscode.workspace.getConfiguration("kel", doc.uri);
        retVal.errors = kelConfig.get("syntaxCheckFromGrammar") ? errorListener.errors : [];
    } catch (e) {
        console.log(e);
    }
    return retVal;
}

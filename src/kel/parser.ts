import * as vscode from "vscode";
import { Antlr4Error, ErrorListener } from "../util/errorListener";

import { CharStream, CommonTokenStream } from "antlr4";
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
    const chars = new CharStream(doc.getText());
    const lexer = new KELLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new KELParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    try {
        const tree = parser.program();
        const visitor = new KELVisitor();
        tree.accept(visitor);
        const kelConfig = vscode.workspace.getConfiguration("kel", doc.uri);
        retVal.errors = kelConfig.get("syntaxCheckFromGrammar") ? errorListener.errors.filter(row => !visitor.eclBodyContains(row.start, row.stop)) : [];
    } catch (e) {
        console.log(e);
    }
    return retVal;
}

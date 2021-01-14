import { Range, TextDocument } from "vscode";
import { error } from "antlr4";

export interface Antlr4Error {
    source: string;
    start: number;
    stop: number;
    range: Range;
    error: { message: string };
}

export class ErrorListener extends error.ErrorListener {

    errors: Antlr4Error[] = [];

    constructor(private _doc: TextDocument) {
        super();
    }

    syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
        this.errors.push({
            source: "parser",
            start: offendingSymbol.start,
            stop: offendingSymbol.stop,
            range: new Range(this._doc.positionAt(offendingSymbol.start), this._doc.positionAt(offendingSymbol.stop + 1)),
            error: {
                message: msg
            }
        });
    }
}

//  Ported from https://github.com/Microsoft/vscode-go/blob/trunk/src/diffUtils.ts

import * as jsDiff from "diff";
import { Position, Range, TextDocument, TextEdit, TextEditorEdit, Uri, workspace, WorkspaceEdit } from "vscode";

enum EditTypes { EDIT_DELETE, EDIT_INSERT, EDIT_REPLACE }

class Edit {
    action: number;
    start: Position;
    end: Position;
    text: string;

    constructor(action: number, start: Position) {
        this.action = action;
        this.start = start;
        this.end = start;
        this.text = "";
    }

    apply(): TextEdit {
        switch (this.action) {
            case EditTypes.EDIT_INSERT:
                return TextEdit.insert(this.start, this.text);
            case EditTypes.EDIT_DELETE:
                return TextEdit.delete(new Range(this.start, this.end));
            case EditTypes.EDIT_REPLACE:
            default:
                return TextEdit.replace(new Range(this.start, this.end), this.text);
        }
    }

    applyUsingTextEditorEdit(editBuilder: TextEditorEdit): void {
        switch (this.action) {
            case EditTypes.EDIT_INSERT:
                editBuilder.insert(this.start, this.text);
                break;

            case EditTypes.EDIT_DELETE:
                editBuilder.delete(new Range(this.start, this.end));
                break;

            case EditTypes.EDIT_REPLACE:
                editBuilder.replace(new Range(this.start, this.end), this.text);
                break;
        }
    }

    applyUsingWorkspaceEdit(workspaceEdit: WorkspaceEdit, fileUri: Uri): void {
        switch (this.action) {
            case EditTypes.EDIT_INSERT:
                workspaceEdit.insert(fileUri, this.start, this.text);
                break;

            case EditTypes.EDIT_DELETE:
                workspaceEdit.delete(fileUri, new Range(this.start, this.end));
                break;

            case EditTypes.EDIT_REPLACE:
                workspaceEdit.replace(fileUri, new Range(this.start, this.end), this.text);
                break;
        }
    }
}

function parseUniDiffs(diffOutput: jsDiff.ParsedDiff[]): Edit[] {
    const edits: Edit[] = [];
    diffOutput.forEach((uniDiff: jsDiff.ParsedDiff) => {
        let edit: Edit;
        uniDiff.hunks.forEach((hunk: jsDiff.Hunk) => {
            let startLine = hunk.oldStart;
            hunk.lines.forEach((line) => {
                switch (line.substr(0, 1)) {
                    case "-":
                        edit = new Edit(EditTypes.EDIT_DELETE, new Position(startLine - 1, 0));
                        edit.end = new Position(startLine, 0);
                        edits.push(edit);
                        startLine++;
                        break;
                    case "+":
                        edit = new Edit(EditTypes.EDIT_INSERT, new Position(startLine - 1, 0));
                        edit.text += line.substr(1) + "\n";
                        edits.push(edit);
                        break;
                    case " ":
                        startLine++;
                        break;
                }
            });
        });
    });
    return edits;
}

function compare(oldStr: string, newStr: string): Edit[] {
    if (process.platform === "win32") {
        oldStr = oldStr.split("\r\n").join("\n");
        newStr = newStr.split("\r\n").join("\n");
    }
    const unifiedDiffs: jsDiff.ParsedDiff = jsDiff.structuredPatch("", "", oldStr, newStr, "", "");
    return parseUniDiffs([unifiedDiffs]);
}

export function updateWorkspace(td: TextDocument, newText: string) {
    const oldText = td.getText();
    const edits = compare(oldText, newText);
    const we = new WorkspaceEdit();
    edits.forEach(edit => {
        edit.applyUsingWorkspaceEdit(we, td.uri);
    });
    workspace.applyEdit(we);
}

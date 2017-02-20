import vscode = require("vscode");

export class EclCodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): Thenable<vscode.Command[]> {
        return Promise.resolve([]);
    }
}

import * as vscode from "vscode";
import { ECL_MODE } from "./eclMode";

let statusBarEntry: vscode.StatusBarItem;

export function showHideStatus() {
    if (!statusBarEntry) {
        return;
    }
    if (!vscode.window.activeTextEditor) {
        statusBarEntry.hide();
        return;
    }
    if (vscode.languages.match(ECL_MODE, vscode.window.activeTextEditor.document)) {
        statusBarEntry.show();
        return;
    }
    statusBarEntry.hide();
}

export function hideEclStatus() {
    if (statusBarEntry) {
        statusBarEntry.dispose();
    }
}

export function showEclStatus(message: string, command: string, tooltip?: string) {
    statusBarEntry = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, Number.MIN_VALUE);
    statusBarEntry.text = message;
    statusBarEntry.command = command;
    statusBarEntry.color = "yellow";
    statusBarEntry.tooltip = tooltip;
    statusBarEntry.show();
}

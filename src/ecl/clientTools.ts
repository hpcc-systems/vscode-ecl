import { QuickPickItem, window, workspace } from "vscode";
import * as path from "path";
import { locateAllClientTools } from "@hpcc-js/comms";
import { eclStatusBar } from "./status";

export function showEclStatus(version: string, overriden: boolean, tooltip: string) {
    eclStatusBar.showClientTools(`${overriden ? "*" : ""}${version}`, tooltip);
}

interface SelectQP extends QuickPickItem {
    eclccPath?: string;
}

export function selectCTVersion() {
    const input = window.createQuickPick<SelectQP>();
    input.placeholder = "Select eclcc version";
    locateAllClientTools().then(clientTools => {
        input.items = [{ label: "Auto Detect", eclccPath: undefined }, ...clientTools.map(ct => {
            const version = ct.versionSync();
            return {
                label: version.toString(),
                eclccPath: ct.eclccPath
            };
        })];
        input.onDidChangeSelection(items => {
            const item = items[0];
            if (item) {
                const eclConfig = workspace.getConfiguration("ecl");
                eclConfig.update("eclccPath", item.eclccPath);
                showEclStatus(item.label, !!item.eclccPath, !!item.eclccPath ? item.eclccPath : "");
            }
            input.hide();
        });
        input.show();
    });
}

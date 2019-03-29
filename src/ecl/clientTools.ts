import { ClientTools, locateAllClientTools, locateClientTools as commsLocateClientTools } from "@hpcc-js/comms";
import { QuickPickItem, window, workspace } from "vscode";
import { eclStatusBar } from "../status";

function showEclStatus(version: string, overriden: boolean, tooltip: string) {
    eclStatusBar.showEclStatus(`${overriden ? "*" : ""}${version}`, tooltip);
}

export function locateClientTools(build?: string, cwd?: string, includeFolders?: string[], legacyMode?: boolean): Promise<ClientTools> {
    const eclConfig = workspace.getConfiguration("ecl");
    const eclccPath = eclConfig.get("eclccPath") as string;
    return commsLocateClientTools(eclccPath, build, cwd, includeFolders, legacyMode).then(clientTools => {
        let eclccPathOverriden = false;
        if (clientTools) {
            if (clientTools.eclccPath === eclccPath) {
                eclccPathOverriden = true;
            }
            clientTools.version().then(version => {
                showEclStatus(version.toString(), eclccPathOverriden, clientTools.eclccPath);
            });
        } else {
            showEclStatus("Unknown", false, "Unable to locate eclcc");
        }
        return clientTools;
    });
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

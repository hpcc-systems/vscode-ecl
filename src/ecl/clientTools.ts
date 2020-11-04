import { Event, EventEmitter, QuickPickItem, window, workspace } from "vscode";
import { ClientTools, locateAllClientTools } from "@hpcc-js/comms";
import { eclStatusBar } from "./status";
import localize from "../util/localize";

export function showEclStatus(version: string, overriden: boolean, tooltip: string) {
    eclStatusBar.showClientTools(`${overriden ? "*" : ""}${version}`, tooltip);
}

export async function switchClientTools(ct?: ClientTools) {
    const label = ct ? ct.versionSync().toString() : localize("Auto Detect");
    const eclccPath = ct?.eclccPath;
    const eclConfig = workspace.getConfiguration("ecl");
    await eclConfig.update("eclccPath", eclccPath);
    showEclStatus(label, !!eclccPath, !!eclccPath ? eclccPath : "");
    _onDidClientToolsChange.fire();
}

interface SelectQP extends QuickPickItem {
    ct?: ClientTools;
}

const _onDidClientToolsChange: EventEmitter<void> = new EventEmitter<void>();
export const onDidClientToolsChange: Event<void> = _onDidClientToolsChange.event;

export function selectCTVersion() {
    const input = window.createQuickPick<SelectQP>();
    input.placeholder = localize("Select eclcc version");
    locateAllClientTools().then(clientTools => {
        input.items = [{ label: localize("Auto Detect"), ct: undefined }, ...clientTools.map(ct => {
            const version = ct.versionSync();
            return {
                label: version.toString(),
                ct
            };
        })];
        input.onDidChangeSelection(async items => {
            const item = items[0];
            if (item) {
                switchClientTools(item.ct);
            }
            input.hide();
        });
        input.show();
    });
}

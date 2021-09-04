import "abortcontroller-polyfill/dist/polyfill-patch-fetch";

import * as vscode from "vscode";
import { activate as dashyActivate } from "./dashy/main";
import { activate as eclActivate } from "./ecl/main";
import { activate as kelActivate } from "./kel/main";
import { activate as notebookActivate } from "./notebook/main";

export function activate(ctx: vscode.ExtensionContext): void {
    eclActivate(ctx);
    notebookActivate(ctx);
    kelActivate(ctx);
    dashyActivate(ctx);
}

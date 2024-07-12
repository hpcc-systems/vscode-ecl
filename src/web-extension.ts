import { ExtensionContext } from "vscode";
import { initialize } from "./util/localize";

export function activate(ctx: ExtensionContext): void {
    initialize().then(() => {
        import("./ecl/main.js").then(({ activate }) => activate(ctx));
        import("./notebook/index.js").then(({ activate }) => activate(ctx));
    });
}

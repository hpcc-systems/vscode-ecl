import { ExtensionContext } from "vscode";
import { initialize } from "./util/localize";

export function activate(ctx: ExtensionContext): void {
    initialize().then(() => {
        import("./ecl/main").then(({ activate }) => activate(ctx));
        import("./notebook/main").then(({ activate }) => activate(ctx));
    });
}

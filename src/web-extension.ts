import { ExtensionContext } from "vscode";
import { initialize } from "./util/localize";

export async function activate(ctx: ExtensionContext): Promise<void> {
    await initialize();
    await Promise.all([
        import("./ecl/main.js").then(({ activate }) => activate(ctx)),
        import("./notebook/index.js").then(({ activate }) => activate(ctx))
    ]);
}

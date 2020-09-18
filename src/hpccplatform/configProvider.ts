import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
import { LaunchRequestArguments, LaunchConfig } from "./launchConfig";

const logger = scopedLogger("eclConfigProvide.ts");

export let eclConfigurationProvider: ECLConfigurationProvider;
export class ECLConfigurationProvider implements vscode.DebugConfigurationProvider {
    protected _ctx: vscode.ExtensionContext;

    constructor(ctx: vscode.ExtensionContext) {
        this._ctx = ctx;
        ctx.subscriptions.push(vscode.debug.registerDebugConfigurationProvider("ecl", this));
    }

    static attach(ctx: vscode.ExtensionContext): ECLConfigurationProvider {
        if (!eclConfigurationProvider) {
            eclConfigurationProvider = new ECLConfigurationProvider(ctx);
        }
        return eclConfigurationProvider;
    }

    async resolveDebugConfiguration?(folder: vscode.WorkspaceFolder | undefined, debugConfiguration: vscode.DebugConfiguration, token?: vscode.CancellationToken): Promise<vscode.DebugConfiguration> {
        const eclConfig = vscode.workspace.getConfiguration("ecl");
        debugConfiguration.debugLogging = eclConfig.get<boolean>("debugLogging");
        if (debugConfiguration.user && debugConfiguration.password) {
            return debugConfiguration;
        } else {
            const launchConfig = new LaunchConfig(debugConfiguration as unknown as LaunchRequestArguments);
            if (await launchConfig.checkCredentials()) {
                return debugConfiguration;
            }
        }
        throw new Error("Invalid user ID / password");
    }
}

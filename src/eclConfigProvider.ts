import { scopedLogger } from "@hpcc-js/util";
import * as vscode from "vscode";
import { LaunchConfig } from "./debugger/launchConfig";

const logger = scopedLogger("eclConfigProvide.ts");

export interface Credentials {
    user: string;
    password: string;
}

export let eclConfigurationProvider: ECLConfigurationProvider;
export class ECLConfigurationProvider implements vscode.DebugConfigurationProvider {
    protected _ctx: vscode.ExtensionContext;
    protected _credentials: { [configName: string]: Credentials } = {};
    protected _currentConfig: vscode.DebugConfiguration;

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

    credentials(debugConfiguration: vscode.DebugConfiguration): Credentials {
        let retVal = this._credentials[debugConfiguration.serverAddress];
        if (!retVal) {
            retVal = this._credentials[debugConfiguration.serverAddress] = {
                user: debugConfiguration.user,
                password: debugConfiguration.password
            };
        }
        return retVal;
    }

    async verifyUser(debugConfiguration: vscode.DebugConfiguration): Promise<boolean> {
        const launchConfig = new LaunchConfig(debugConfiguration);
        const credentials = this.credentials(debugConfiguration);
        try {
            await launchConfig.verifyUser(credentials.user, credentials.password);
            debugConfiguration.user = credentials.user;
            debugConfiguration.password = credentials.password;
            return true;
        } catch (e) {
            if (e.Exception && e.Exception.length !== undefined && !e.Exception.some(exp => exp.Code === 0)) {
                debugConfiguration.user = credentials.user;
                debugConfiguration.password = credentials.password;
                return true;
            }
            logger.info(`Verify User Failed (${debugConfiguration.name}):  ${credentials.user}@${debugConfiguration.serverAddress}:${debugConfiguration.port}`);
            return false;
        }
    }

    async promptUserID(debugConfiguration: vscode.DebugConfiguration) {
        const credentials = this.credentials(debugConfiguration);
        credentials.user = await vscode.window.showInputBox({
            prompt: `User ID (${debugConfiguration.name})`,
            password: false,
            value: credentials.user
        });
    }

    async promptPassword(debugConfiguration: vscode.DebugConfiguration): Promise<boolean> {
        const credentials = this.credentials(debugConfiguration);
        credentials.password = await vscode.window.showInputBox({
            prompt: `Password (${debugConfiguration.name})`,
            password: true,
            value: credentials.password
        });
        return false;
    }

    async checkCredentials(debugConfiguration: vscode.DebugConfiguration): Promise<boolean> {
        for (let i = 0; i < 3; ++i) {
            if (await this.verifyUser(debugConfiguration)) {
                return true;
            }
            await this.promptUserID(debugConfiguration);
            await this.promptPassword(debugConfiguration);
        }
        return false;
    }

    async resolveDebugConfiguration?(folder: vscode.WorkspaceFolder | undefined, debugConfiguration: vscode.DebugConfiguration, token?: vscode.CancellationToken): Promise<vscode.DebugConfiguration> {
        this._currentConfig = debugConfiguration;
        if (debugConfiguration.user && debugConfiguration.password) {
            return debugConfiguration;
        } else if (await this.checkCredentials(debugConfiguration)) {
            return debugConfiguration;
        }
        throw new Error("Invalid user ID / password");
    }
}

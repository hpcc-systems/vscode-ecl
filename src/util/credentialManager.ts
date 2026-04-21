import * as vscode from "vscode";
import { scopedLogger } from "@hpcc-js/util";
import { LaunchRequestArguments } from "../debugger/launchRequestArguments";
import { logEvent, logError } from "../telemetry";

const logger = scopedLogger("ecl:credentials");

export enum LaunchConfigState {
    Unknown,
    Unreachable,
    CredentialsRequired,
    Ok
}

export let credentialManager: CredentialManager;
const credentialManagerCache = new Map<string, Credentials>();

function getStorageKey(baseUrl: string, user: string): string {
    return `ecl.credentials.${baseUrl.replace(/\/$/, "")}.${user ?? ""}`;
}

function isEclConfigWithCredentials(config: LaunchRequestArguments): boolean {
    return config.type === "ecl" &&
        !!config.password &&
        !!config.user &&
        !!config.protocol &&
        !!config.serverAddress &&
        !!config.port;
}

export class Credentials {
    private context: vscode.ExtensionContext;
    readonly baseUrl: string;
    readonly user: string;
    private _password: string;
    private _verified: boolean;

    private constructor(context: vscode.ExtensionContext, baseUrl: string, user: string) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.user = user;
        this._password = "";
        this._verified = false;
    }

    static async attach(context: vscode.ExtensionContext, baseUrl: string, user: string): Promise<Credentials> {
        const storageKey = getStorageKey(baseUrl, user);
        let credentials = credentialManagerCache.get(storageKey);
        if (!credentials) {
            credentials = new Credentials(context, baseUrl, user);
            credentialManagerCache.set(storageKey, credentials);
        }
        try {
            const password = await context.secrets.get(storageKey);
            credentials._password = password ?? "";
        } catch (e) {
            logger.error(`Failed to get password for ${user}@${baseUrl}: ${e}`);
        }
        return credentials;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (value !== this._password) {
            this._password = value;
            try {
                this.context.secrets.store(this.getStorageKey(), value);
            } catch (e) {
                logger.error(`Failed to store password for ${this.user}@${this.baseUrl}: ${e}`);
                throw e;
            }
        }
    }

    get verified(): boolean {
        return this._verified;
    }

    set verified(value: boolean) {
        this._verified = value;
    }

    getStorageKey(): string {
        return getStorageKey(this.baseUrl, this.user);
    }

    delete(): Thenable<void> {
        this._password = "";
        this._verified = false;
        return this.context.secrets.delete(this.getStorageKey());
    }
}

export class CredentialManager {
    private context: vscode.ExtensionContext;

    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    static attach(ctx: vscode.ExtensionContext): CredentialManager {
        if (!credentialManager) {
            credentialManager = new CredentialManager(ctx);
        }
        return credentialManager;
    }

    async getCredentials(baseUrl: string, user: string): Promise<Credentials> {
        return Credentials.attach(this.context, baseUrl, user);
    }

    async listStoredCredentials(): Promise<string[]> {
        return this.context.secrets.keys();
    }

    async deleteAllCredentials(): Promise<void> {
        const cacheEntries = Array.from(credentialManagerCache.values());
        await Promise.all(cacheEntries.map(item => item.delete()));
        credentialManagerCache.clear();

        const allKeys = await this.listStoredCredentials();
        await Promise.all(allKeys.map(key => this.context.secrets.delete(key)));
        logEvent("credentials.deleteAll", {}, { count: allKeys.length });
    }

    async migrateLaunchConfigIfNeeded(config: LaunchRequestArguments): Promise<void> {
        if (!isEclConfigWithCredentials(config)) {
            return;
        }

        const baseUrl = `${config.protocol}://${config.serverAddress}:${config.port}`;
        const storageKey = getStorageKey(baseUrl, config.user);

        try {
            await this.context.secrets.store(storageKey, config.password);
            const storedPassword = await this.context.secrets.get(storageKey);
            if (storedPassword !== config.password) {
                throw new Error("Failed to verify stored password");
            }
            logger.debug(`Migrated credentials for ${config.user}@${baseUrl} to secure storage`);
            logEvent("credentials.migrated");

            credentialManagerCache.delete(storageKey);
            const credentials = await this.getCredentials(baseUrl, config.user);
            credentials.verified = true;
            await this.removePasswordFromLaunchConfig(config);
        } catch (error) {
            logger.error(`Failed to migrate credentials for ${config.user}@${baseUrl}: ${error}`);
            logError("credentials.migrate.error", error);
            throw error;
        }
    }

    private async removePasswordFromLaunchConfig(config: LaunchRequestArguments): Promise<void> {
        const workspacefolders = vscode.workspace.workspaceFolders || [];

        for (const folder of workspacefolders) {
            const launchConfig = vscode.workspace.getConfiguration("launch", folder.uri);
            const configurations = launchConfig.get<LaunchRequestArguments[]>("configurations") || [];

            const configIndex = configurations.findIndex(c =>
                c.name === config.name && c.type === "ecl" && c.password
            );

            if (configIndex !== -1) {
                delete configurations[configIndex].password;
                await launchConfig.update("configurations", configurations, vscode.ConfigurationTarget.WorkspaceFolder);
                return;
            }
        }

        const globalLaunchConfig = vscode.workspace.getConfiguration("launch", null);
        const globalConfigurations = globalLaunchConfig.get<LaunchRequestArguments[]>("configurations") || [];

        const configIndex = globalConfigurations.findIndex(c =>
            c.name === config.name && c.type === "ecl" && c.password
        );

        if (configIndex !== -1) {
            delete globalConfigurations[configIndex].password;
            await globalLaunchConfig.update("configurations", globalConfigurations, vscode.ConfigurationTarget.Global);
        }
    }
}
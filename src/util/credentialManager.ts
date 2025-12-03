import * as vscode from "vscode";
import { scopedLogger } from "@hpcc-js/util";
import { LaunchRequestArguments } from "../debugger/launchRequestArguments";

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
        const cached = credentialManagerCache.get(storageKey);
        if (cached) {
            return cached;
        }
        const credentials = new Credentials(context, baseUrl, user);
        credentialManagerCache.set(storageKey, credentials);
        try {
            const password = await context.secrets.get(storageKey);
            credentials._password = password;
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
    }

    private async hasStoredCredentials(baseUrl: string, user: string): Promise<boolean> {
        const storageKey = getStorageKey(baseUrl, user);
        const password = await this.context.secrets.get(storageKey);
        return !!password;
    }

    private async storeCredentials(baseUrl: string, user: string, password: string): Promise<void> {
        const storageKey = getStorageKey(baseUrl, user);
        await this.context.secrets.store(storageKey, password);
    }

    private async migrateConfigIfNeeded(config: LaunchRequestArguments, launchConfig: vscode.WorkspaceConfiguration, configurations: LaunchRequestArguments[]): Promise<void> {
        if (!isEclConfigWithCredentials(config)) {
            return;
        }

        const storageKey = getStorageKey(`${config.protocol}://${config.serverAddress}:${config.port}`, config.user);

        try {
            await this.storeCredentials(storageKey, config.user, config.password);
            const storedPassword = await this.context.secrets.get(storageKey);
            if (storedPassword !== config.password) {
                throw new Error("Failed to verify stored password");
            }

            logger.debug(`Migrated credentials for ${config.user}@${storageKey} to secure storage`);
            delete config.password;
            await launchConfig.update("configurations", configurations, vscode.ConfigurationTarget.WorkspaceFolder);
        } catch (error) {
            logger.error(`Failed to migrate credentials for ${config.user}@${storageKey}: ${error}`);
            throw error;
        }
    }

    async migrateExistingCredentials(): Promise<void> {
        const workspacefolders = vscode.workspace.workspaceFolders || [];

        for (const folder of workspacefolders) {
            try {
                const launchConfig = vscode.workspace.getConfiguration("launch", folder.uri);
                const configurations = launchConfig.get<LaunchRequestArguments[]>("configurations") || [];

                await Promise.all(configurations.map(config => this.migrateConfigIfNeeded(config, launchConfig, configurations)));
            } catch (error: unknown) {
                logger.warning(`Failed to migrate credentials from workspace folder ${folder.name}: ${error}`);
            }
        }

        try {
            const globalLaunchConfig = vscode.workspace.getConfiguration("launch", null);
            const globalConfigurations = globalLaunchConfig.inspect("configurations");

            const allConfigs = [
                ...((globalConfigurations?.globalValue as LaunchRequestArguments[]) || []),
                ...((globalConfigurations?.workspaceValue as LaunchRequestArguments[]) || []),
                ...((globalConfigurations?.workspaceFolderValue as LaunchRequestArguments[]) || [])
            ];

            await Promise.all(allConfigs.map(config => this.migrateConfigIfNeeded(config, globalLaunchConfig, allConfigs)));
        } catch (error: unknown) {
            logger.warning(`Failed to migrate global credentials: ${error}`);
        }
    }
}
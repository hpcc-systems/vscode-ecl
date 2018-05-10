import { Workunit, WUQuery, WUUpdate } from "@hpcc-js/comms";
import { setTimeout } from "timers";
import { DebugProtocol } from "vscode-debugprotocol";

// This interface should always match the schema found in `package.json`.
export type LaunchMode = "submit" | "compile" | "debug";
export type LaunchProtocol = "http" | "https";
export type LaunchLegacyMode = "true" | "false" | "";

export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    mode?: LaunchMode;
    program: string;
    workspace: string;
    protocol: LaunchProtocol;
    serverAddress: string;
    port: number;
    abortSubmitOnError?: boolean;
    rejectUnauthorized?: boolean;
    targetCluster: string;
    eclccPath?: string;
    eclccArgs?: string[];
    includeFolders?: string;
    legacyMode?: LaunchLegacyMode;
    resultLimit?: number;
    user?: string;
    password?: string;
}

export class LaunchConfig {
    _config: LaunchRequestArguments;
    constructor(args: any) {
        this._config = {
            ...args,
            protocol: args.protocol || "http",
            abortSubmitOnError: args.abortSubmitOnError !== undefined ? args.abortSubmitOnError : true,
            rejectUnauthorized: args.rejectUnauthorized || false,
            eclccPath: args.eclccPath ? args.eclccPath : "",
            eclccArgs: args.eclccArgs ? args.eclccArgs : [],
            includeFolders: args.includeFolders ? args.includeFolders : "",
            legacyMode: args.legacyMode || "",
            resultLimit: args.resultLimit || 100,
            user: args.user || "",
            password: args.password || ""
        };
    }

    action(): WUUpdate.Action {
        switch (this._config.mode) {
            case "compile":
                return WUUpdate.Action.Compile;
            case "debug":
                return WUUpdate.Action.Debug;
            case "submit":
            default:
                return WUUpdate.Action.Run;
        }
    }

    legacyMode(): boolean | undefined {
        switch (this._config.legacyMode) {
            case "true":
                return true;
            case "false":
                return false;
            case "":
            default:
                return undefined;
        }
    }

    includeFolders(): string[] {
        return this._config.includeFolders!.split(",");
    }

    ping(timeout: number = 5000): Promise<boolean> {
        const timeoutPrommise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("Ping timeout");
            }, timeout);
        });
        const queryPromise = Workunit.query({
            baseUrl: this.espUrl(),
            userID: this._config.user,
            password: this._config.password,
            rejectUnauthorized: this._config.rejectUnauthorized
        }, { Count: 1 });

        return Promise.race([timeoutPrommise, queryPromise])
            .then(r => {
                return true;
            }).catch(e => {
                return false;
            });
    }

    createWorkunit() {
        return Workunit.create({
            baseUrl: this.espUrl(),
            userID: this._config.user,
            password: this._config.password,
            rejectUnauthorized: this._config.rejectUnauthorized
        });
    }

    query(opts: WUQuery.Request): Promise<Workunit[]> {
        return Workunit.query({
            baseUrl: this.espUrl(),
            userID: this._config.user,
            password: this._config.password,
            rejectUnauthorized: this._config.rejectUnauthorized
        }, opts);
    }

    espUrl() {
        return `${this._config.protocol}://${this._config.serverAddress}:${this._config.port}`;
    }

    wuDetailsUrl(wuid: string) {
        return `${this.espUrl()}/?Widget=WUDetailsWidget&Wuid=${wuid}`;
    }
}

import * as vscode from "vscode";
import { locateClientTools, AccountService, Activity, Workunit, WUQuery, WUUpdate, Topology, TargetCluster, EclccErrors, IOptions } from "@hpcc-js/comms";
import { scopedLogger } from "@hpcc-js/util";
import { LaunchConfigState, LaunchMode, LaunchRequestArguments } from "../debugger/launchRequestArguments";
import { eclConfigurationProvider } from "./configProvider";

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const logger = scopedLogger("launchConfig.ts");

function xmlFile(programPath: string): Promise<{ err: EclccErrors, content: string }> {
    return new Promise((resolve, reject) => {
        fs.readFile(programPath, "utf8", function (err, content) {
            resolve({ err: new EclccErrors("", []), content });
        });
    });
}

export {
    LaunchRequestArguments
};

export function espUrl(launchRequestArgs: LaunchRequestArguments) {
    return `${launchRequestArgs.protocol}://${launchRequestArgs.serverAddress}:${launchRequestArgs.port}`;
}

export function wuDetailsUrl(launchRequestArgs: LaunchRequestArguments, wuid: string) {
    return `${espUrl(launchRequestArgs)}/?Widget=WUDetailsWidget&Wuid=${wuid}`;
}

export function wuResultUrl(launchRequestArgs: LaunchRequestArguments, wuid: string, sequence: number) {
    return `${espUrl(launchRequestArgs)}/?Widget=ResultWidget&Wuid=${wuid}&Sequence=${sequence}`;
}

export function action(mode: LaunchMode) {
    switch (mode) {
        case "compile":
        case "publish":
            return WUUpdate.Action.Compile;
        case "debug":
            return WUUpdate.Action.Debug;
        case "submit":
        default:
            return WUUpdate.Action.Run;
    }
}

export interface Credentials {
    user: string;
    password: string;
    verified: boolean;
}

const credentials: { [serverAddress: string]: Credentials } = {};

const configPrefix = "${config:ecl.";

type ValueOf<T> = T[keyof T];

export class LaunchConfig {

    private readonly _config: LaunchRequestArguments;

    get name() {
        return this.config("name");
    }

    get action(): WUUpdate.Action {
        switch (this.config("mode")) {
            case "compile":
            case "publish":
                return WUUpdate.Action.Compile;
            case "debug":
                return WUUpdate.Action.Debug;
            case "submit":
            default:
                return WUUpdate.Action.Run;
        }
    }

    get isPublish() {
        return this.config("mode") === "publish";
    }

    get eclccPath() {
        return this.config("eclccPath");
    }

    get includeFolders() {
        const retVal = this.config("includeFolders");
        if (typeof retVal === "string") {
            return retVal.split(",");
        }
        return retVal;
    }

    get legacyMode() {
        switch (this.config("legacyMode")) {
            case "true":
                return true;
            case "false":
                return false;
            case "":
            default:
                return undefined;
        }
    }

    get abortSubmitOnError() {
        return this.config("abortSubmitOnError");
    }

    get targetCluster() {
        return this.config("targetCluster");
    }

    get resultLimit() {
        return this.config("resultLimit");
    }

    get protocol() {
        return this.config("protocol");
    }

    get serverAddress() {
        return this.config("serverAddress");
    }

    get port() {
        return this.config("port");
    }

    get rejectUnauthorized() {
        return this.config("rejectUnauthorized");
    }

    get timeoutSecs() {
        return this.config("timeoutSecs");
    }

    get espUrl() {
        return `${this.protocol}://${this.serverAddress}:${this.port}`;
    }

    config<T extends keyof LaunchRequestArguments>(key: T) {
        let retVal = this._config[key];
        if (typeof retVal === "string" && retVal.indexOf(configPrefix) === 0) {
            const configKey = retVal.substring(configPrefix.length, retVal.length - 1);
            const eclConfig = vscode.workspace.getConfiguration("ecl");
            retVal = eclConfig.get(configKey);
        }
        return retVal;
    }

    constructor(args: LaunchRequestArguments) {
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
            timeoutSecs: args.timeoutSecs || 60,
            user: args.user || "",
            password: args.password || ""
        };
    }

    //  Credentials  ---
    private credentials(): Credentials {
        let retVal = credentials[this.serverAddress];
        if (!retVal) {
            retVal = credentials[this.serverAddress] = {
                user: this._config.user,
                password: this._config.password,
                verified: false
            };
        }
        return retVal;
    }

    private verifyUser(): Promise<boolean> {
        const credentials = this.credentials();
        if (credentials.verified) {
            return Promise.resolve(true);
        }
        const acService = new AccountService(this.opts(credentials));
        return acService.VerifyUser({
            application: "vscode-ecl",
            version: ""
        }).then(response => {
            credentials.verified = true;
            return true;
        }).catch(e => {
            return false;
        });
    }

    private ping(timeout: number = 5000): Promise<LaunchConfigState> {
        const timeoutPrommise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("timeout");
            }, timeout);
        });
        const queryPromise = this.verifyUser();
        return Promise.race([timeoutPrommise, queryPromise])
            .then(r => {
                return LaunchConfigState.Ok;
            }).catch(e => {
                return e === "timeout" ? LaunchConfigState.Unreachable : LaunchConfigState.Credentials;
            });
    }

    private async promptUserID() {
        const credentials = this.credentials();
        credentials.user = await vscode.window.showInputBox({
            prompt: `User ID (${this.name})`,
            password: false,
            value: credentials.user
        }) || "";
    }

    private async promptPassword(): Promise<boolean> {
        const credentials = this.credentials();
        credentials.password = await vscode.window.showInputBox({
            prompt: `Password (${this.name})`,
            password: true,
            value: credentials.password
        }) || "";
        return false;
    }

    async checkCredentials(): Promise<Credentials> {
        switch (await this.ping()) {
            case LaunchConfigState.Ok:
                return this.credentials();
            case LaunchConfigState.Credentials:
                for (let i = 0; i < 3; ++i) {
                    await this.promptUserID();
                    await this.promptPassword();
                    if (await this.verifyUser()) {
                        return this.credentials();
                    }
                }
                throw new Error("Invalid Credentials.");
            case LaunchConfigState.Unknown:
            case LaunchConfigState.Unreachable:
            default:
                throw new Error("Connection failed.");
        }
    }

    //  Misc  ---
    opts(credentials: Credentials): IOptions {
        return {
            baseUrl: this.espUrl,
            userID: credentials.user,
            password: credentials.password,
            rejectUnauthorized: this.rejectUnauthorized,
            timeoutSecs: this.timeoutSecs
        };
    }

    wuDetailsUrl(wuid: string) {
        return `${this.espUrl}/?Widget=WUDetailsWidget&Wuid=${wuid}`;
    }

    wuResultsUrl(wuid: string, sequence: number) {
        return `${this.espUrl}/?Widget=ResultWidget&Wuid=${wuid}&Sequence=${sequence}`;
    }

    private _buildPromise;
    fetchBuild(): Promise<string> {
        if (!this._buildPromise) {
            this._buildPromise = this.checkCredentials().then(credentials => {
                const activity = Activity.attach(this.opts(credentials));
                return activity.refresh().then(activity => {
                    return activity.Build;
                });
            });
        }
        return this._buildPromise;
    }

    targetClusters(): Promise<TargetCluster[]> {
        return this.checkCredentials().then(credentials => {
            const topology = new Topology(this.opts(credentials));
            return topology.fetchTargetClusters();
        });
    }

    wuQuery(request: WUQuery.Request): Promise<Workunit[]> {
        return this.checkCredentials().then(credentials => {
            return Workunit.query(this.opts(credentials), request);
        });
    }

    //  Workunit  ---
    async localResolveDebugConfiguration(filePath: string): Promise<LaunchRequestArguments> {
        const uri = vscode.Uri.file(filePath);
        const folder = vscode.workspace.getWorkspaceFolder(uri);
        const configPrefix = "${config:ecl.";
        return eclConfigurationProvider.resolveDebugConfiguration(folder, this._config as unknown as vscode.DebugConfiguration).then(debugConfiguration => {
            for (const key in debugConfiguration) {
                let value: any = debugConfiguration[key];
                switch (value) {
                    case "${workspaceRoot}":
                        debugConfiguration[key] = folder.uri.fsPath;
                        break;
                    case "${file}":
                        debugConfiguration[key] = filePath;
                        break;
                    default:
                        if (typeof value === "string" && value.indexOf(configPrefix) === 0) {
                            const configKey = value.substring(configPrefix.length, value.length - 1);
                            const eclConfig = vscode.workspace.getConfiguration("ecl");
                            debugConfiguration[key] = eclConfig.get(configKey);
                        }
                }
                value = debugConfiguration[key];
                if (Array.isArray(value)) {
                    debugConfiguration[key] = value.join(",");
                }
            }
            return debugConfiguration as unknown as LaunchRequestArguments;
        });
    }

    private createWorkunit() {
        return this.checkCredentials().then(credentials => {
            return Workunit.create(this.opts(credentials));
        });
    }

    async submit(filePath: string, targetCluster: string, mode: LaunchMode) {
        // const args = await this.localResolveDebugConfiguration(filePath);
        // logger.debug("launchRequest:  " + JSON.stringify(args));

        const uri = vscode.Uri.file(filePath);
        const workspace = vscode.workspace.getWorkspaceFolder(uri);

        logger.info(`Fetch build version.${os.EOL}`);
        const pathParts = path.parse(filePath);
        let failedWU: Workunit;
        return this.fetchBuild().then(build => {
            logger.info(`Locating Client Tools.${os.EOL}`);
            return locateClientTools(this.eclccPath, build, workspace.uri.fsPath, this.includeFolders, this.legacyMode);
        }).then((clientTools) => {
            logger.info(`Client Tools:  ${clientTools.eclccPath}.${os.EOL}`);
            logger.info(`Generating archive.${os.EOL}`);
            if (pathParts.ext.toLowerCase() === ".xml") {
                return xmlFile(filePath);
            } else {
                return clientTools.createArchive(filePath);
            }
        }).then(archive => {
            if (this.abortSubmitOnError && archive.err.hasError()) {
                throw new Error(`ECL Syntax Error(s):\n  ${archive.err.errors().map(e => e.msg).join("\n  ")}`);
            }
            logger.info(`Archive Size: ${archive.content.length}.${os.EOL}`);
            return archive;
        }).then(archive => {
            logger.info(`Creating workunit.${os.EOL}`);
            return this.createWorkunit().then(wu => {
                failedWU = wu;
                return [wu, archive] as [Workunit, any];
            });
        }).then(([wu, archive]) => {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise<Workunit>(async (resolve, reject) => {
                const attempts = 3;
                let lastError;
                for (let retry = 1; retry <= attempts; ++retry) {
                    logger.info(`Updating workunit (${retry} of ${attempts}).${os.EOL}`);
                    await wu.update({
                        Jobname: pathParts.name,
                        QueryText: archive.content,
                        ApplicationValues: {
                            ApplicationValue: [{
                                Application: "vscode-ecl",
                                Name: "filePath",
                                Value: filePath
                            }]
                        }
                    }).then(wu => {
                        retry = attempts + 1;
                        resolve(wu);
                    }).catch(e => {
                        lastError = e || lastError;
                    });
                }
                reject(lastError);
            });
        }).then((workunit) => {
            logger.info(`Submitting workunit:  ${workunit.Wuid}.${os.EOL}`);
            return workunit.submit(targetCluster, action(mode), this.resultLimit);
        }).then((workunit) => {
            logger.info(`Submitted:  ${this.wuDetailsUrl(workunit.Wuid)}.${os.EOL}`);
            failedWU = undefined;
            return workunit;
        }).catch((e) => {
            logger.info(`Launch failed - ${e}.${os.EOL}`);
            logger.debug("InitializeEvent");
            if (failedWU) {
                failedWU.setToFailed();
            }
            throw e;
        });
    }
}

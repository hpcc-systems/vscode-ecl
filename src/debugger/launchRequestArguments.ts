import { DebugProtocol } from "vscode-debugprotocol";

export type LaunchProtocol = "http" | "https";
export type LaunchMode = "submit" | "compile" | "publish" | "debug";

export enum LaunchConfigState {
    Unknown,
    Unreachable,
    Credentials,
    Ok
}

// This interface should always match the schema found in `package.json`.
export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    //  Implicit
    name: string;
    type: "ecl";

    //  Required
    protocol: LaunchProtocol;
    serverAddress: string;
    port: number;
    targetCluster: string;

    //  Optional
    abortSubmitOnError?: boolean;
    rejectUnauthorized?: boolean;
    eclccPath?: string;
    eclccArgs?: string[];
    eclccSyntaxArgs?: string[];
    eclccLogFile?: string
    resultLimit?: number;
    timeoutSecs?: number;
    user?: string;
    password?: string;
}

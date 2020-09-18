import { DebugProtocol } from "vscode-debugprotocol";

export type LaunchMode = "submit" | "compile" | "publish" | "debug";
export type LaunchProtocol = "http" | "https";
export type LaunchLegacyMode = "true" | "false" | "";

export enum LaunchConfigState {
    Unknown,
    Unreachable,
    Credentials,
    Ok
}

// This interface should always match the schema found in `package.json`.
export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    name: string;
    type: "ecl";
    mode?: LaunchMode;
    program: string;
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
    timeoutSecs?: number;
    user?: string;
    password?: string;
}

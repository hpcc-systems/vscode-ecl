export interface State {
    protocol: string;
    serverAddress: string;
    port: string;
    path: string;
    user: string;
    password: string;
    rejectUnauthorized: boolean;
    wuid: string;
    result?: number;
}

export interface VSCodeAPI {
    postMessage: <T extends Message>(msg: T) => void;
    setState: (newState: State) => void;
    getState: () => State;
}

declare const acquireVsCodeApi: () => VSCodeAPI;

export const vscode = acquireVsCodeApi();

export interface Message {
    callbackID?: string;
}

export interface LoadedMessage extends Message {
    command: "loaded";
}

export interface ProxySendMessage extends Message {
    command: "proxySend";
    id: number;
    canAbort: boolean;
    params: {
        opts: any;
        action: any;
        request: any;
        responseType: any;
        header: any;
    }
}

export interface ProxyCancelMessage extends Message {
    command: "proxyCancel";
    id: number;
}

export type Messages = LoadedMessage | ProxySendMessage | ProxyCancelMessage;

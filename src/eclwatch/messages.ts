import type { IOptions } from "@hpcc-js/comms";

export interface State extends IOptions {
    wuid: string;
    resultName?: string;
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

export interface NavigateMessage extends Message {
    command: "navigate";
    data: State;
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

export interface ProxyResponseMessage extends Message {
    command: "proxyResponse";
    id: number;
    response: any;
}

export interface ProxyCancelMessage extends Message {
    command: "proxyCancel";
    id: number;
}

export type Messages = NavigateMessage | LoadedMessage | ProxySendMessage | ProxyResponseMessage | ProxyCancelMessage;

import type { IOptions, ResponseType } from "@hpcc-js/comms";

export interface State extends IOptions {
    wuid: string;
    resultName?: string;
}

export interface VSCodeAPI {
    postMessage: <T extends Message>(msg: T) => void;
    setState: (newState: State) => void;
    getState: () => State | undefined;
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
        opts: IOptions;
        action: string;
        request: Record<string, unknown>;
        responseType: ResponseType;
        header?: unknown;
    }
}

export interface ProxyResponseSuccessMessage extends Message {
    command: "proxyResponse";
    id: number;
    response: unknown;
}

export interface ProxyResponseErrorMessage extends Message {
    command: "proxyResponse";
    id: number;
    error: string;
}

export type ProxyResponseMessage = ProxyResponseSuccessMessage | ProxyResponseErrorMessage;

export interface ProxyCancelMessage extends Message {
    command: "proxyCancel";
    id: number;
}

export type Messages = NavigateMessage | LoadedMessage | ProxySendMessage | ProxyResponseMessage | ProxyCancelMessage;

export function isMessage(value: unknown): value is Messages {
    if (!value || typeof value !== "object") {
        return false;
    }
    const message = value as Record<string, unknown>;
    switch (message.command) {
        case "loaded":
            return true;
        case "navigate": {
            const data = message.data as Record<string, unknown> | undefined;
            return !!data && typeof data.baseUrl === "string" && typeof data.wuid === "string";
        }
        case "proxyCancel":
            return typeof message.id === "number";
        case "proxyResponse":
            return typeof message.id === "number" &&
                (typeof message.error === "string" || Object.prototype.hasOwnProperty.call(message, "response"));
        case "proxySend": {
            const params = message.params as Record<string, unknown> | undefined;
            const opts = params?.opts as Record<string, unknown> | undefined;
            return typeof message.id === "number" && typeof message.canAbort === "boolean" && !!params && !!opts &&
                typeof opts.baseUrl === "string" && typeof params.action === "string" &&
                !!params.request && typeof params.request === "object" &&
                (params.responseType === "json" || params.responseType === "text" || params.responseType === "arraybuffer");
        }
        default:
            return false;
    }
}

import React from "react";
import { useOnEvent, useEventCallback } from "@fluentui/react-hooks";
import { LoadedMessage, ProxyCancelMessage, ProxySendMessage, State, vscode } from "./messages";
import { hookSend } from "@hpcc-js/comms/dist/browser/index.js";

interface executor<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

const proxyPromises: { [id: number]: executor<any> } = {};
let proxyID = 0;

const isTestPage = document.location.protocol === "file:";

hookSend((opts, action, request, responseType, header) => {
    const id = ++proxyID;
    let canAbort = false;
    if (request.abortSignal_) {
        canAbort = true;
        request.abortSignal_.onabort = function () {
            vscode.postMessage<ProxyCancelMessage>({
                command: "proxyCancel",
                id
            });
        };
        delete request.abortSignal_;
    }

    vscode.postMessage<ProxySendMessage>({
        command: "proxySend",
        id,
        canAbort,
        params: {
            opts,
            action,
            request,
            responseType,
            header
        }
    });

    return new Promise((resolve, reject) => {
        proxyPromises[proxyID] = { resolve, reject };
    });
});

export function useMessageReceiver() {
    const [state, setState] = React.useState<State>();

    const cb = useEventCallback((event: MessageEvent) => {
        const message = event.data; // The JSON data our extension sent
        switch (message.command) {
            case "navigate":
                setState(message.data as State);
                break;
            case "proxyResponse":
                if (proxyPromises[message.id]) {
                    proxyPromises[message.id].resolve(message.response);
                    delete proxyPromises[message.id];
                }
                break;
        }
    });
    useOnEvent(window, "message", cb);

    React.useEffect(() => {
        vscode.postMessage<LoadedMessage>({
            command: "loaded"
        });
        if (isTestPage) {
            setTimeout(() => {
                setState({
                    baseUrl: "http://localhost:8010",
                    userID: "gosmith",
                    password: "",
                    wuid: "W20240814-084327"
                });
            }, 1000);
        }
    }, []);

    return state;
}


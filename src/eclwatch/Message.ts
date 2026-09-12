import React from "react";
import { useOnEvent, useEventCallback } from "@fluentui/react-hooks";
import { isMessage, LoadedMessage, ProxyCancelMessage, ProxySendMessage, State, vscode } from "./messages";
import { hookSend } from "@hpcc-js/comms";

interface Executor<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
    cleanup: () => void;
}

const proxyPromises = new Map<number, Executor<unknown>>();
let proxyID = 0;

const isTestPage = document.location.protocol === "file:" && !(window as Window & { __ECL_WEBVIEW_TEST__?: boolean }).__ECL_WEBVIEW_TEST__;

hookSend((opts, action, request, responseType, header) => {
    const id = ++proxyID;
    const abortSignal = request?.abortSignal_ as AbortSignal | undefined;
    const proxyRequest = { ...request };
    delete proxyRequest.abortSignal_;

    return new Promise((resolve, reject) => {
        const handleAbort = () => {
            vscode.postMessage<ProxyCancelMessage>({
                command: "proxyCancel",
                id
            });
            proxyPromises.delete(id);
            reject(new DOMException("The request was aborted", "AbortError"));
        };
        const cleanup = () => abortSignal?.removeEventListener("abort", handleAbort);
        proxyPromises.set(id, { resolve, reject, cleanup });
        if (abortSignal?.aborted) {
            handleAbort();
            return;
        }
        abortSignal?.addEventListener("abort", handleAbort, { once: true });

        vscode.postMessage<ProxySendMessage>({
            command: "proxySend",
            id,
            canAbort: !!abortSignal,
            params: {
                opts,
                action,
                request: proxyRequest,
                responseType,
                header
            }
        });
    });
});

export function useMessageReceiver() {
    const [state, setState] = React.useState<State>();

    const cb = useEventCallback((event: MessageEvent) => {
        if (!isMessage(event.data)) {
            return;
        }
        const message = event.data;
        switch (message.command) {
            case "navigate":
                setState(message.data);
                break;
            case "proxyResponse": {
                const executor = proxyPromises.get(message.id);
                if (executor) {
                    executor.cleanup();
                    proxyPromises.delete(message.id);
                    if ("error" in message) {
                        executor.reject(new Error(message.error));
                    } else {
                        executor.resolve(message.response);
                    }
                }
                break;
            }
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


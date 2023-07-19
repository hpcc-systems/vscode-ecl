import * as React from "react";
import * as ReactDOM from "react-dom";
import { WUDetails } from "./eclwatch/WUDetails";
import { ThemeProvider } from "./eclwatch/themeGenerator";
import { LoadedMessage, ProxyCancelMessage, ProxySendMessage, State, vscode } from "./eclwatch/messages";
import { hookSend } from "@hpcc-js/comms";

const bodyStyles = window.getComputedStyle(document.body);

const backColor = bodyStyles.getPropertyValue("--vscode-editor-background") || "white";
const foreColour = bodyStyles.getPropertyValue("--vscode-input-foreground") || "black";

const placeholder = document.getElementById("placeholder");

const themeProvider = new ThemeProvider(foreColour, backColor);
themeProvider.loadThemeForColor(bodyStyles.getPropertyValue("--vscode-progressBar-background") || "navy");

interface executor<T> {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

const proxyPromises: { [id: number]: executor<any> } = {};
let proxyID = 0;

const origSend = hookSend((opts, action, request, responseType, header) => {
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

window.addEventListener("message", function (event) {
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
        case "navigate":
            render(message.data as State);
            break;
        case "proxyResponse":
            if (proxyPromises[message.id]) {
                proxyPromises[message.id].resolve(message.response);
                delete proxyPromises[message.id];
            }
            break;
    }
});

function render(state: State) {
    if (state) {
        vscode.setState(state);
        ReactDOM.render(<WUDetails
            opts={state}
            wuid={state.wuid}
            sequence={state.result}
        />, placeholder);
    }
}

function rerender() {
    render(vscode.getState());
}

//  Local debugging without VS Code
if (document.location.protocol === "file:") {
    render({
        baseUrl: "https://play.hpccsystems.com:18010",
        userID: "gosmith",
        password: "",
        wuid: "W20210304-144316"
    });
}

window.addEventListener("resize", () => {
    rerender();
});

rerender();

vscode.postMessage<LoadedMessage>({
    command: "loaded"
});

import * as React from "react";
import * as ReactDOM from "react-dom";
import { WUDetails } from "./eclwatch/WUDetails";
import { ThemeProvider } from "./eclwatch/themeGenerator";

const bodyStyles = window.getComputedStyle(document.body);

const backColor = bodyStyles.getPropertyValue("--vscode-editor-background") || "white";
const foreColour = bodyStyles.getPropertyValue("--vscode-input-foreground") || "black";

const placeholder = document.getElementById("placeholder");

const themeProvider = new ThemeProvider(foreColour, backColor);
themeProvider.loadThemeForColor(bodyStyles.getPropertyValue("--vscode-progressBar-background") || "navy");

interface State {
    protocol: string;
    serverAddress: string;
    port: string;
    user: string;
    password: string;
    wuid: string;
    result?: number;
}

interface VSCodeAPI {
    postMessage: <T extends Message>(msg: T) => void;
    setState: (newState: State) => void;
    getState: () => State;
}

declare const acquireVsCodeApi: () => VSCodeAPI;

const vscode = acquireVsCodeApi();

interface Message {
    callbackID?: string;
}

interface LoadedMessage extends Message {
    command: "loaded";
}

export type Messages = LoadedMessage;

window.addEventListener("message", function (event) {
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
        case "navigate":
            render(message.data as State);
            break;
    }
});

function render(state: State) {
    if (state) {
        vscode.setState(state);
        ReactDOM.render(<WUDetails
            baseUrl={`${state.protocol}://${state.serverAddress}:${state.port}`}
            wuid={state.wuid}
            user={state.user}
            password={state.password}
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
        protocol: "https",
        serverAddress: "play.hpccsystems.com",
        port: "18010",
        user: "gosmith",
        password: "",
        wuid: "W20200917-150837"
    });
}

window.addEventListener("resize", () => {
    rerender();
});

rerender();

vscode.postMessage<LoadedMessage>({
    command: "loaded"
});

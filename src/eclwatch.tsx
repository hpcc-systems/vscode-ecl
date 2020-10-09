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

interface VSCodeAPI {
    postMessage: <T extends Message>(msg: T) => void;
    setState: (newState) => void;
    getState: () => any;
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
            render(message.data.protocol, message.data.serverAddress, message.data.port, message.data.user, message.data.password, message.data.wuid, message.data.result);
            break;
    }
});

vscode.postMessage<LoadedMessage>({
    command: "loaded"
});

let prevProtocol;
let prevServerAddress;
let prevPort;
let prevUser;
let prevPassword;
let prevWuid;
let prevResult;
function render(protocol, serverAddress, port, user, password, wuid, result?) {
    prevProtocol = protocol;
    prevServerAddress = serverAddress;
    prevPort = port;
    prevUser = user;
    prevPassword = password;
    prevWuid = wuid;
    prevResult = result;
    ReactDOM.render(<WUDetails
        baseUrl={`${protocol}://${serverAddress}:${port}`}
        wuid={wuid}
        user={user}
        password={password}
        sequence={result}
    />, placeholder);

}

//  Local debugging without VS Code
if (document.location.protocol === "file:") {
    render("https", "play.hpccsystems.com", "18010", "gosmith", "", "W20200917-150837");
}

window.addEventListener("resize", () => {
    if (prevProtocol) {
        render(prevProtocol, prevServerAddress, prevPort, prevUser, prevPassword, prevWuid, prevResult);
    }
});

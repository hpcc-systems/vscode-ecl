import type { ActivationFunction } from "vscode-notebook-renderer";
import { OJSRuntime } from "@hpcc-js/observable-md";
import { OJSOutput } from "./notebook/controller";

export const activate: ActivationFunction = context => {

    return {
        renderOutputItem(_data, element) {
            const data: OJSOutput = _data.json();
            const runtime = new OJSRuntime(element, data.eclResults);
            runtime.evaluate("", data.code, data.folder);
        }
    };
};

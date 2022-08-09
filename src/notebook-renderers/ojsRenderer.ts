import type { ActivationFunction, RendererContext } from "vscode-notebook-renderer";
import { OJSRuntime } from "@hpcc-js/observable-md";
import { IOptions, Workunit } from "@hpcc-js/comms";
import { OJSOutput } from "../notebook/controller";

export const activate: ActivationFunction = context => {

    const ojsRenderer = new OJSRenderer(context);

    return {
        renderOutputItem(data, element) {
            return ojsRenderer.renderOutputItem(data, element);
        },

        disposeOutputItem(id) {
            return ojsRenderer.disposeOutputItem(id);
        }
    };
};

class OJSRenderer {

    _element: any;
    _data: OJSOutput;
    _configuration: any;

    constructor(protected context: RendererContext<any>) {
        context.onDidReceiveMessage(msg => this.onDidReceiveMessage(msg));
    }

    disposeOutputItem(id) {
        if (this._element) {
        }
    }

    onDidReceiveMessage(msg: any) {
        switch (msg.type) {
            case "fetchConfigsResponse":
                this.render(msg.configurations);
                break;
        }
    }

    renderOutputItem(data, element) {
        this._data = data.json();
        this._element = element;
        // this.context.postMessage({ command: "fetchConfigs", names: this._data.eclResults.map(eclResult => eclResult.configuration) });
        let ojsResults = {};
        this._data.eclResults.forEach(eclResult => {
            ojsResults = { ...ojsResults, ...eclResult.results };
        });
        const runtime = new OJSRuntime(this._element, ojsResults);
        runtime.evaluate("", this._data.code, this._data.folder);
    }

    async render(configs: { [name: string]: IOptions }) {
        const resultPromises = this._data.eclResults.map(eclResult => {
            const wu = Workunit.attach(configs[eclResult.configuration], eclResult.wuid);
            return wu.watchUntilComplete().then(wu => {
                return wu.fetchResults();
            });
        });

        const ojsResults = {};
        await Promise.all(resultPromises).then(allResults => {
            allResults.forEach((results) => {
                results.forEach(result => {
                    const name = result.Name.split(" ").join("_");
                    ojsResults[name] = () => result.fetchRows().then(rows => {
                        if (rows.length === 1 && rows[0][name]) {
                            return rows[0][name];
                        }
                        return rows;
                    });
                });
            });
        });

        const data: OJSOutput = this._data;
        const runtime = new OJSRuntime(this._element, ojsResults);
        runtime.evaluate("", data.code, data.folder);
    }
}

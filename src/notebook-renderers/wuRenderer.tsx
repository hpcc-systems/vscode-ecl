import type { ActivationFunction, RendererContext } from "vscode-notebook-renderer";
import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { IOptions, Workunit } from "@hpcc-js/comms";
import type { WUOutput } from "../notebook/controller/controller";
import { WUOutputSummary, WUOutputTables } from "./WUOutputTable";

export const activate: ActivationFunction = context => {

    const wuRenderer = new WURenderer(context);

    return {
        renderOutputItem(data, element) {
            return wuRenderer.renderOutputItem(data, element);
        },

        disposeOutputItem(id) {
            return wuRenderer.disposeOutputItem(id);
        }
    };
};

class WURenderer {

    _element: any;
    _data: WUOutput;
    _configuration: any;

    constructor(protected context: RendererContext<any>) {
        context.onDidReceiveMessage(msg => this.onDidReceiveMessage(msg));
    }

    disposeOutputItem(id) {
        if (this._element) {
            unmountComponentAtNode(this._element);
        }
    }

    onDidReceiveMessage(msg: any) {
        switch (msg.type) {
            case "fetchConfigResponse":
                this.render(msg.configuration);
                break;
        }
    }

    renderOutputItem(data, element) {
        this._data = data.json();
        this._element = element;
        if (this._data.results) {
            render(<WUOutputTables {...this._data} />, this._element);
        } else {
            this.context.postMessage({ command: "fetchConfig", name: this._data.configuration });
        }
    }

    render(config: IOptions) {
        const wu = Workunit.attach(config, this._data.wuid);

        wu.watchUntilComplete((changes) => {
            render(<div>{this._data.wuid}:  {wu.State}</div>, this._element);
        });
        wu.watchUntilComplete().then(wu => {
            wu.fetchResults().then(results => {
                render(<>
                    <div>{this._data.wuid}:  {wu.State}</div>
                    <div>Results:  {results.map(r => `${r.Name.split(" ").join("_")} (${r.Value})`).join(", ")}</div>
                </>, this._element);
            }).catch(e => {
                render(<>
                    <div>{JSON.stringify(e)}</div>
                    <div>{JSON.stringify(this._data)}</div>
                    <div>{JSON.stringify(config)}</div>
                </>, this._element);
            });
        });
    }
}

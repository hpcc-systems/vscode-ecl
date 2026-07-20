import type { ActivationFunction, RendererContext } from "vscode-notebook-renderer";
import type { WUOutput } from "../controller/serializer-types";

import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { IOptions, Workunit } from "@hpcc-js/comms";
import { WUOutputTables } from "./WUOutputTable";

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

    protected context: RendererContext<any>;
    _element: HTMLElement | undefined;
    _root: Root | undefined;
    _data: WUOutput | undefined;
    _configuration: any;

    constructor(context: RendererContext<any>) {
        this.context = context;
        if (this.context.onDidReceiveMessage) {
            this.context.onDidReceiveMessage(msg => this.onDidReceiveMessage(msg));
        }
    }

    disposeOutputItem(id?: string) {
        if (this._root) {
            this._root.unmount();
            this._root = undefined;
        }
    }

    renderComponent(component: React.ReactNode) {
        if (!this._element) {
            return;
        }
        if (!this._root) {
            this._root = createRoot(this._element);
        }
        this._root.render(component);
    }

    onDidReceiveMessage(msg: any) {
        switch (msg.type) {
            case "fetchConfigResponse":
                this.render(msg.configuration);
                break;
        }
    }

    renderOutputItem(data: { json(): WUOutput }, element: HTMLElement) {
        this._data = data.json();
        this._element = element;

        if (!this._data) {
            return;
        }

        const outputData = this._data;
        if (outputData.results) {
            this.renderComponent(<WUOutputTables {...outputData} />);
        } else if (this.context.postMessage) {
            this.context.postMessage({ command: "fetchConfig", name: outputData.configuration });
        }
    }

    render(config: IOptions) {
        if (!this._data) {
            return;
        }

        const outputData = this._data;
        const wu = Workunit.attach(config, outputData.wuid);

        wu.watchUntilComplete(() => {
            this.renderComponent(<div>{outputData.wuid}:  {wu.State}</div>);
        });
        wu.watchUntilComplete().then(wu => {
            wu.fetchResults().then(results => {
                this.renderComponent(<>
                    <div>{outputData.wuid}:  {wu.State}</div>
                    <div>Results:  {results.map(r => `${r.Name.split(" ").join("_")} (${r.Value})`).join(", ")}</div>
                </>);
            }).catch(e => {
                this.renderComponent(<>
                    <div>{JSON.stringify(e)}</div>
                    <div>{JSON.stringify(outputData)}</div>
                    <div>{JSON.stringify(config)}</div>
                </>);
            });
        });
    }
}

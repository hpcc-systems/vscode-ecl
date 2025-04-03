import * as React from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import { Widget } from "@hpcc-js/common";

export interface VisualizationProps {
    widget: Widget;
    debounce?: boolean;
}

let g_id = 0;
export const VisualizationComponent: React.FunctionComponent<VisualizationProps> = ({
    widget,
    debounce = true
}) => {

    const [divID] = React.useState("viz-component-" + ++g_id);
    const { ref, width, height } = useResizeObserver<HTMLDivElement>();

    React.useEffect(() => {
        widget
            .target(divID)
            .render()
            ;
        return () => {
            widget.target(null);
        };
    }, [divID, widget]);

    if (widget.target()) {
        widget.resize({ width: width ?? 1, height: height ?? 1 });
        if (debounce) {
            widget.lazyRender();
        } else {
            widget.render();
        }
    }

    return <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
        <div id={divID} style={{ position: "absolute" }}>
        </div>
    </div>;
};

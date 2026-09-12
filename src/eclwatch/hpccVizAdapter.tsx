import * as React from "react";
import { useResizeObserver } from "use-resize-observer";
import { Widget } from "@hpcc-js/common";

export interface VisualizationProps {
    widget: Widget;
    debounce?: boolean;
}

export const VisualizationComponent: React.FunctionComponent<VisualizationProps> = ({
    widget,
    debounce = true
}) => {

    const targetRef = React.useRef<HTMLDivElement>(null);
    const { ref, width, height } = useResizeObserver<HTMLDivElement>();

    React.useEffect(() => {
        widget.target(targetRef.current);
        return () => {
            widget.target(null);
        };
    }, [widget]);

    React.useEffect(() => {
        if (!widget.target()) {
            return;
        }
        widget.resize({ width: width ?? 1, height: height ?? 1 });
        if (debounce) {
            widget.lazyRender();
        } else {
            widget.render();
        }
    });

    return <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
        <div ref={targetRef} style={{ position: "absolute", inset: 0 }} />
    </div>;
};

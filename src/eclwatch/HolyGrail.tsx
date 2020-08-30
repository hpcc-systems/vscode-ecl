import * as React from "react";
import useResizeObserver from "use-resize-observer/polyfilled";

export interface HolyGrailProps {
    header?: any;
    left?: any;
    main?: any;
    right?: any;
    footer?: any;
}

export const HolyGrail: React.FunctionComponent<HolyGrailProps> = ({
    header,
    left,
    main,
    right,
    footer
}) => {

    return <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", overflow: "hidden" }}>
        <header style={{ flex: "0 0" }}>{header}</header>
        <div style={{ flex: "1 1", display: "flex" }} >
            <div style={{ flex: "0 2" }}>{left}</div>
            <div style={{ flex: "1 1 auto" }}>{main}</div>
            <div style={{ flex: "0 2" }}>{right}</div>
        </div>
        <footer style={{ flex: "0 0" }}>{footer}</footer>
    </div >;
};

interface WithSizingProps {
}

export const withSizing = <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithSizingProps> => ({
    ...props
}: WithSizingProps) => {
    const { ref, width, height } = useResizeObserver<HTMLDivElement>();
    return <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
        <div style={{ position: "absolute", width, height }}>
            <Component {...props as P} />
        </div>
    </div>;
};

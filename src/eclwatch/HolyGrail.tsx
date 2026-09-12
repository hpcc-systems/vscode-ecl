import * as React from "react";
import { useResizeObserver } from "use-resize-observer";

export interface HolyGrailProps {
    header?: React.ReactNode;
    left?: React.ReactNode;
    main?: React.ReactNode;
    right?: React.ReactNode;
    footer?: React.ReactNode;
}

export const HolyGrail: React.FunctionComponent<HolyGrailProps> = ({
    header,
    left,
    main,
    right,
    footer
}) => {

    return <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", overflow: "hidden" }}>
        <header style={{ flex: "0 0 auto" }}>{header}</header>
        <div style={{ flex: "1 1 auto", display: "flex", minHeight: 0 }}>
            <div style={{ flex: "0 0 auto" }}>{left}</div>
            <main style={{ flex: "1 1 auto", minWidth: 0 }}>{main}</main>
            <div style={{ flex: "0 0 auto" }}>{right}</div>
        </div>
        <footer style={{ flex: "0 0 auto" }}>{footer}</footer>
    </div>;
};

export const withSizing = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => (props: P) => {
    const { ref, width, height } = useResizeObserver<HTMLDivElement>();
    return <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }}>
        <div style={{ position: "absolute", width, height }}>
            <Component {...props} />
        </div>
    </div>;
};

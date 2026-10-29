import React from "react";
import { FluentProvider } from "@fluentui/react-components";
import { initTheme } from "./themeGenerator";
import { WUDetails } from "./WUDetails";
import { LogicalFileResult } from "./WUResult";
import { useMessageReceiver } from "./Message";

const theme = initTheme();

export const Frame: React.FunctionComponent = () => {

    const state = useMessageReceiver();

    return <FluentProvider theme={theme} style={{ height: "100%" }}>
        {
            state ?
                state.logicalFile ?
                    <LogicalFileResult key={`lf-${state.nodeGroup}-${state.logicalFile}`} opts={state} logicalFile={state.logicalFile} nodeGroup={state.nodeGroup} /> :
                    <WUDetails key={`${state.wuid}-${state.resultName}`} opts={state} wuid={state.wuid} initialName={state.resultName ?? ""} /> :
                <div>...loading...</div>
        }
    </FluentProvider>;
};

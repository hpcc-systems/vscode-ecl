import React from "react";
import { initializeIcons, ThemeProvider } from "@fluentui/react";
import { initTheme } from "./themeGenerator";
import { WUDetails } from "./WUDetails";
import { useMessageReceiver } from "./Message";

initializeIcons();
initTheme();

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FrameProps {
}

export const Frame: React.FunctionComponent<FrameProps> = () => {

    const state = useMessageReceiver();

    return <ThemeProvider style={{ height: "100%" }}>
        {
            state ?
                <WUDetails key={`${state.wuid}-${state.resultName}`} opts={state} wuid={state.wuid} initialName={state.resultName ?? ""}></WUDetails> :
                <div>...loading...</div>
        }
    </ThemeProvider >;
};

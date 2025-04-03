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
    const [name, setName] = React.useState<string>(state?.resultName ?? "");

    React.useEffect(() => {
        setName(state?.resultName ?? "");
    }, [state?.wuid, state?.resultName]);

    return <ThemeProvider style={{ height: "100%" }}>
        {
            state ?
                <WUDetails opts={state} wuid={state.wuid} name={name} setName={setName}></WUDetails> :
                <div>...loading...</div>
        }
    </ThemeProvider >;
};

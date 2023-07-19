import * as React from "react";
import { Pivot, PivotItem, IPivotStyles, Spinner, initializeIcons, MessageBar, MessageBarType, IStyleFunctionOrObject, IPivotStyleProps } from "@fluentui/react";
import { Workunit, WUInfo, Result, IOptions } from "@hpcc-js/comms";
import { WUIssues, WUResult } from "./WUResult";
import { HolyGrail } from "./HolyGrail";

initializeIcons();

const bodyStyles = window.getComputedStyle(document.body);

const pivotStyles: IStyleFunctionOrObject<IPivotStyleProps, IPivotStyles> = {
    link: {
        fontSize: bodyStyles.getPropertyValue("--vscode-font-size"),
        lineHeight: 32,
        height: 32
    },
    linkIsSelected: {
        fontSize: bodyStyles.getPropertyValue("--vscode-font-size"),
        lineHeight: 32,
        height: 32
    },
};

const labelStyles: IStyleFunctionOrObject<IPivotStyleProps, IPivotStyles> = {
    root: { marginTop: 10 },
};

const getTabId = (itemKey: string) => {
    return itemKey;
};

export interface WUDetailsProps {
    opts: IOptions;
    wuid: string;
    sequence?: number;
}

export const WUDetails: React.FunctionComponent<WUDetailsProps> = ({
    opts,
    wuid,
    sequence,
}) => {

    const pivotRef = React.useRef<HTMLDivElement>(null);

    const [selectedKey, setSelectedKey] = React.useState(undefined);
    const handleLinkClick = (item: PivotItem) => {
        setSelectedKey(item.props.itemKey!);
    };

    const [spinnerMessage, setSpinnerMessage] = React.useState("Loading...");
    const [complete, setComplete] = React.useState(false);
    const [exceptions, setExceptions] = React.useState<WUInfo.ECLException[]>([]);
    const [results, setResults] = React.useState<Result[]>([]);

    React.useEffect(() => {
        let canceled = false;

        function update(complete: boolean, exceptions: WUInfo.ECLException[], results: Result[]) {
            if (!canceled) {
                setComplete(complete);
                setExceptions([...exceptions]);
                setResults([...results]);
            }
        }

        function refresh(wu: Workunit) {
            setSpinnerMessage(wu.State);
            Promise.all([wu.fetchECLExceptions(), wu.fetchResults()]).then(([exceptions, results]) => {
                update(wu.isComplete(), exceptions, results);
            });
        }

        if (wuid) {
            setSpinnerMessage("Loading...");
            update(false, [], []);
            const wu = Workunit.attach(opts, wuid);
            wu.refresh().then(() => {
                if (!canceled) {
                    if (wu.isComplete()) {
                        refresh(wu);
                    } else {
                        let prevStateID;
                        wu.watchUntilComplete(() => {
                            if (prevStateID !== wu.StateID) {
                                prevStateID = wu.StateID;
                                refresh(wu);
                            }
                        });
                    }
                }
            }).catch(e => {
                setSpinnerMessage(e.message);
                update(true, [], []);
            });
        } else {
            setSpinnerMessage("");
            update(true, [], []);
        }

        return () => {
            canceled = true;
        };
    }, [opts.baseUrl, wuid]);

    React.useEffect(() => {
        setSelectedKey(sequence === undefined ? "" + 0 : "" + sequence);
    }, [opts.baseUrl, wuid, sequence]);

    const hasIssues = exceptions.length > 0;
    const hasResults = results.length > 0;

    let selected = selectedKey;
    if (hasIssues && !hasResults) {
        selected = "issues";
    } else if (selected === undefined) {
        if (hasResults) {
            selected = "" + 0;
        } else if (hasIssues) {
            selected = "issues";
        }
    }

    return (!hasIssues && !hasResults) ?
        complete ?
            <MessageBar messageBarType={MessageBarType.info} isMultiline={false}      >
                {spinnerMessage} - 0 Issues, 0 Results.
            </MessageBar> :
            <Spinner label={spinnerMessage} /> :
        <HolyGrail
            header={
                <div ref={pivotRef}>
                    {
                        exceptions.length > 0 || results.length > 0 ?
                            <Pivot overflowBehavior="menu" styles={pivotStyles} selectedKey={selected} onLinkClick={handleLinkClick} headersOnly={true} >
                                {[
                                    ...(exceptions.length ? [<PivotItem key={"issues"} itemKey={"issues"} headerText={"Issues"} />] : []),
                                    ...results.map(r => <PivotItem key={`${r.Wuid}::${r.Sequence}::${r.Value}`} itemKey={"" + r.Sequence} headerText={`${r.Name}${r.Value.indexOf("undefined") < 0 ? `:  ${r.Value}` : ""}`} />)
                                ]}
                            </Pivot>
                            : undefined
                    }
                </div>
            }
            main={selected === "issues" ?
                <WUIssues exceptions={exceptions} />
                : hasResults ?
                    <WUResult opts={opts} wuid={wuid} sequence={parseInt(selectedKey)} />
                    : undefined
            }
        />;
};

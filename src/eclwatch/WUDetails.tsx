import * as React from "react";
import { Pivot, PivotItem, IPivotStyles, Spinner, MessageBar, MessageBarType, IStyleFunctionOrObject, IPivotStyleProps, Stack } from "@fluentui/react";
import { Workunit, WsWorkunits, Result, IOptions } from "@hpcc-js/comms/dist/browser/index.js";
import { WUIssues, WUResult } from "./WUResult";
import { HolyGrail } from "./HolyGrail";

const __VSCODE_ISSUES = "__vscode_issues";

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

export interface WUDetailsProps {
    opts: IOptions;
    wuid: string;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
}

export const WUDetails: React.FunctionComponent<WUDetailsProps> = ({
    opts,
    wuid,
    name,
    setName
}) => {

    const pivotRef = React.useRef<HTMLDivElement>(null);

    const [selectedValue, setSelectedValue] = React.useState<string | undefined>();
    const [spinnerMessage, setSpinnerMessage] = React.useState("Loading...");
    const [complete, setComplete] = React.useState(false);
    const [exceptions, setExceptions] = React.useState<WsWorkunits.ECLException[]>([]);
    const [results, setResults] = React.useState<Result[]>([]);

    React.useEffect(() => {
        let canceled = false;

        function update(complete: boolean, exceptions: WsWorkunits.ECLException[], results: Result[]) {
            if (!canceled) {
                setComplete(complete);
                setExceptions([...exceptions]);
                setResults([...results]);
                if (!name) {
                    setName(exceptions.length ? __VSCODE_ISSUES : results.length ? results[0].Name : "");
                }
            }
        }

        function refresh(wu: Workunit) {
            if (!canceled) {
                setSpinnerMessage(wu.State);
                Promise.all([wu.fetchECLExceptions(), wu.fetchResults()]).then(([exceptions, results]) => {
                    update(wu.isComplete(), exceptions, results);
                });
            }
        }

        if (wuid) {
            setSpinnerMessage("Loading...");
            update(false, [], []);
            const wu = Workunit.attach(opts, wuid);
            wu.refresh().then(() => {
                if (wu.isComplete()) {
                    refresh(wu);
                } else if (!canceled) {
                    wu.watchUntilComplete(changes => {
                        refresh(wu);
                    });
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
    }, [name, opts, setName, wuid]);

    const handleLinkClick = React.useCallback((item?: PivotItem) => {
        setName(item?.props.itemKey ?? "");
        setSelectedValue(item?.props["data-result"]?.Value);
    }, [setName]);

    const hasIssues = exceptions.length > 0;
    const hasResults = results.length > 0;

    let selected = name;
    if (hasIssues && !hasResults) {
        selected = __VSCODE_ISSUES;
    } else if (selected === undefined) {
        if (hasResults) {
            selected = "" + 0;
        } else if (hasIssues) {
            selected = __VSCODE_ISSUES;
        }
    }

    const pivots = React.useMemo(() => {
        return [
            ...exceptions.length ? [<PivotItem key={__VSCODE_ISSUES} itemKey={__VSCODE_ISSUES} headerText={"Issues"} />] : [],
            ...results.map((r, idx) => {
                if (r.Name === name && r.Value !== selectedValue) {
                    setSelectedValue(r.Value);
                }
                return <PivotItem key={`${r.Wuid}::${r.Sequence}::${r.Value}`} data-result={r} itemKey={r.Name} headerText={`${r.Name}${r.Value.indexOf("undefined") < 0 ? `:  ${r.Value}` : ""}`} />;
            })
        ];
    }, [exceptions.length, name, results, selectedValue]);

    return <HolyGrail
        header={
            <div ref={pivotRef}>
                {
                    exceptions.length > 0 || results.length > 0 ?
                        <Pivot overflowBehavior="menu" styles={pivotStyles} selectedKey={selected} onLinkClick={handleLinkClick} headersOnly={true} >
                            {pivots}
                        </Pivot>
                        : undefined
                }
            </div>
        }
        main={
            (!hasIssues && !hasResults) ?
                complete ?
                    <MessageBar messageBarType={MessageBarType.info} isMultiline={false}>
                        {spinnerMessage} - 0 Issues, 0 Results.
                    </MessageBar> :
                    <Stack verticalAlign="center" horizontalAlign="center" styles={{ root: { height: "100%" } }}>
                        <Spinner label={spinnerMessage} />
                    </Stack> :
                selected === __VSCODE_ISSUES ?
                    <WUIssues exceptions={exceptions} /> :
                    hasResults ?
                        <WUResult opts={opts} wuid={wuid} name={name} value={selectedValue ?? ""} /> :
                        undefined
        }
    />;
};

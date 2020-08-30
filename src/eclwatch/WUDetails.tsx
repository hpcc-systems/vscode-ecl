import * as React from "react";
import { Workunit, WUInfo, Result } from "@hpcc-js/comms";
import { Pivot, PivotItem, IPivotStyles, Spinner, ILabelStyles, IStyleSet, initializeIcons } from "@fluentui/react";
import { WUIssues, WUResult } from "./WUResult";
import { HolyGrail } from "./HolyGrail";

initializeIcons();

const bodyStyles = window.getComputedStyle(document.body);

const pivotStyles: Partial<IStyleSet<IPivotStyles>> = {
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

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};

const getTabId = (itemKey: string) => {
    return itemKey;
};

export interface WUDetailsProps {
    baseUrl: string;
    user: string;
    password: string;
    wuid: string;
    sequence?: number;
}

export const WUDetails: React.FunctionComponent<WUDetailsProps> = ({
    baseUrl,
    user,
    password,
    wuid,
    sequence
}) => {

    const pivotRef = React.useRef<HTMLDivElement>(null);

    const [selectedKey, setSelectedKey] = React.useState(undefined);
    const handleLinkClick = (item: PivotItem) => {
        setSelectedKey(item.props.itemKey!);
    };

    const [busy, setBusy] = React.useState("Loading...");
    const [exceptions, setExceptions] = React.useState<WUInfo.ECLException[]>([]);
    const [results, setResults] = React.useState<Result[]>([]);

    const refresh = (wu: Workunit) => {
        setBusy(wu.State);
        Promise.all([wu.fetchECLExceptions(), wu.fetchResults()]).then(([exceptions, results]) => {
            setExceptions([...exceptions]);
            setResults([...results]);
        });
    };

    React.useEffect(() => {
        if (wuid) {
            setExceptions([]);
            setResults([]);
            const wu = Workunit.attach({ baseUrl, userID: user, password }, wuid);
            wu.refresh().then(() => {
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
            }).catch(e => {
                setBusy(e.message);
                setExceptions([]);
                setResults([]);
            });
        } else {
            setBusy("");
            setExceptions([]);
            setResults([]);
        }
    }, [baseUrl, wuid]);

    React.useEffect(() => {
        setSelectedKey(sequence === undefined ? "" + 0 : "" + sequence);
    }, [baseUrl, wuid, sequence]);

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

    return (!hasIssues && !hasResults) ? <Spinner label={busy} /> :
        <HolyGrail
            header={
                <div ref={pivotRef}>
                    {
                        exceptions.length > 0 || results.length > 0 ?
                            <Pivot styles={pivotStyles} selectedKey={selected} onLinkClick={handleLinkClick} headersOnly={true}>
                                {[
                                    ...(exceptions.length ? [<PivotItem key={"issues"} itemKey={"issues"} headerText={"Issues"} />] : []),
                                    ...results.map(r => <PivotItem key={`${r.Wuid}:: ${r.Sequence}`} itemKey={"" + r.Sequence} headerText={`${r.Name}:  ${r.Value}`} />)
                                ]}
                            </Pivot>
                            : undefined
                    }
                </div>
            }
            main={selected === "issues" ?
                <WUIssues exceptions={exceptions} />
                : hasResults ?
                    <WUResult baseUrl={baseUrl} user={user} password={password} wuid={wuid} sequence={parseInt(selectedKey)} />
                    : undefined
            }
        />;
};

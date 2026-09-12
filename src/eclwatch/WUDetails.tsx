import * as React from "react";
import { Button, MessageBar, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Spinner, Tab, TabList, type SelectTabData, type SelectTabEvent } from "@fluentui/react-components";
import { MoreHorizontalRegular } from "@fluentui/react-icons";
import { Workunit, type WsWorkunits, type Result, type IOptions } from "@hpcc-js/comms";
import { WUIssues, WUResult } from "./WUResult";
import { HolyGrail } from "./HolyGrail";

const __VSCODE_ISSUES = "__vscode_issues";

//  Reserved width for the overflow "more" button when reflowing tabs.
const OVERFLOW_MENU_WIDTH = 32;

interface ResultTab {
    key: string;
    label: string;
}

//  Fluent's Overflow/OverflowItem primitives don't reliably detect overflow for this tab
//  list in this build, so visible/hidden tabs are computed manually from measured widths.
function useResponsiveTabs(tabs: ResultTab[], selected: string) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const itemRefs = React.useRef(new Map<string, HTMLElement>());
    const [visibleKeys, setVisibleKeys] = React.useState<string[]>(() => tabs.map(tab => tab.key));

    const recalc = React.useCallback(() => {
        const container = containerRef.current;
        if (!container || tabs.length === 0) {
            setVisibleKeys(tabs.map(tab => tab.key));
            return;
        }

        const widthOf = (key: string) => itemRefs.current.get(key)?.getBoundingClientRect().width ?? 0;
        const available = container.clientWidth;
        const total = tabs.reduce((sum, tab) => sum + widthOf(tab.key), 0);
        if (total <= available) {
            setVisibleKeys(tabs.map(tab => tab.key));
            return;
        }

        const budget = available - OVERFLOW_MENU_WIDTH;
        const visible: string[] = [];
        let used = 0;
        for (const tab of tabs) {
            const width = widthOf(tab.key);
            if (used + width > budget) {
                break;
            }
            used += width;
            visible.push(tab.key);
        }
        if (!visible.includes(selected)) {
            const selectedWidth = widthOf(selected);
            while (visible.length && used + selectedWidth > budget) {
                const evicted = visible.pop();
                used -= evicted ? widthOf(evicted) : 0;
            }
            visible.push(selected);
        }
        setVisibleKeys(visible);
    }, [tabs, selected]);

    React.useLayoutEffect(() => {
        recalc();
    }, [recalc]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver(() => recalc());
        observer.observe(container);
        return () => observer.disconnect();
    }, [recalc]);

    const setItemRef = React.useCallback((key: string) => (el: HTMLElement | null) => {
        if (el) {
            itemRefs.current.set(key, el);
        } else {
            itemRefs.current.delete(key);
        }
    }, []);

    return { containerRef, setItemRef, visibleKeys };
}

interface OverflowTabMenuProps {
    tabs: ResultTab[];
    onSelect: (tab: ResultTab) => void;
}

const OverflowTabMenu: React.FunctionComponent<OverflowTabMenuProps> = ({ tabs, onSelect }) => {
    if (tabs.length === 0) {
        return null;
    }

    return <Menu>
        <MenuTrigger disableButtonEnhancement>
            <Button
                appearance="transparent"
                icon={<MoreHorizontalRegular />}
                aria-label={`${tabs.length} more results`}
            />
        </MenuTrigger>
        <MenuPopover>
            <MenuList>
                {tabs.map(tab => <MenuItem key={tab.key} onClick={() => onSelect(tab)}>{tab.label}</MenuItem>)}
            </MenuList>
        </MenuPopover>
    </Menu>;
};

export interface WUDetailsProps {
    opts: IOptions;
    wuid: string;
    initialName: string;
}

export const WUDetails: React.FunctionComponent<WUDetailsProps> = ({
    opts,
    wuid,
    initialName
}) => {

    const [name, setName] = React.useState(initialName);
    const [spinnerMessage, setSpinnerMessage] = React.useState("Loading...");
    const [complete, setComplete] = React.useState(false);
    const [exceptions, setExceptions] = React.useState<WsWorkunits.ECLException[]>([]);
    const [results, setResults] = React.useState<Result[]>([]);

    React.useEffect(() => {
        let canceled = false;
        let pollHandle: ReturnType<typeof setTimeout> | undefined;

        function update(isComplete: boolean, nextExceptions: WsWorkunits.ECLException[], nextResults: Result[]) {
            if (!canceled) {
                setComplete(isComplete);
                setExceptions([...nextExceptions]);
                setResults([...nextResults]);
            }
        }

        async function refresh(wu: Workunit) {
            if (!canceled) {
                setSpinnerMessage(wu.State);
                try {
                    const [exceptions, results] = await Promise.all([wu.fetchECLExceptions(), wu.fetchResults()]);
                    update(wu.isComplete(), exceptions, results);
                } catch (error) {
                    if (!canceled) {
                        setSpinnerMessage(error instanceof Error ? error.message : String(error));
                        update(true, [], []);
                    }
                }
            }
        }

        //  Workunit.watch() only reacts to local state changes and does not itself poll the
        //  server (its own internal monitor only ticks every 30s), so state/results appearing
        //  while the WU runs would otherwise go unnoticed for a long time.  Poll explicitly instead.
        function pollWhileRunning(wu: Workunit) {
            if (canceled || wu.isComplete()) {
                return;
            }
            pollHandle = setTimeout(async () => {
                if (canceled) {
                    return;
                }
                try {
                    await wu.refresh();
                } catch (error) {
                    //  Ignore transient refresh errors and keep polling.
                }
                await refresh(wu);
                pollWhileRunning(wu);
            }, 5000);
        }

        if (wuid) {
            const wu = Workunit.attach(opts, wuid);
            wu.refresh().then(async () => {
                await refresh(wu);
                pollWhileRunning(wu);
            }).catch((error: unknown) => {
                if (!canceled) {
                    setSpinnerMessage(error instanceof Error ? error.message : String(error));
                    update(true, [], []);
                }
            });
        }

        return () => {
            canceled = true;
            if (pollHandle) {
                clearTimeout(pollHandle);
            }
        };
    }, [opts, wuid]);

    const handleTabSelect = React.useCallback((_event: SelectTabEvent, data: SelectTabData) => {
        setName(String(data.value));
    }, []);

    const handleOverflowSelect = React.useCallback((tab: ResultTab) => {
        setName(tab.key);
    }, []);

    const hasIssues = exceptions.length > 0;
    const hasResults = results.length > 0;

    const selected = hasIssues && !hasResults ? __VSCODE_ISSUES :
        name === __VSCODE_ISSUES && hasIssues ? name :
            results.some(result => result.Name === name) ? name :
                hasIssues ? __VSCODE_ISSUES : results[0]?.Name ?? "";
    const selectedResult = results.find(result => result.Name === selected);

    const tabs = React.useMemo(() => {
        return [
            ...exceptions.length ? [{ key: __VSCODE_ISSUES, label: "Issues" }] : [],
            ...results.map(result => ({
                key: result.Name,
                label: `${result.Name}${result.Value.indexOf("undefined") < 0 ? `:  ${result.Value}` : ""}`
            }))
        ];
    }, [exceptions.length, results]);

    const { containerRef, setItemRef, visibleKeys } = useResponsiveTabs(tabs, selected);
    const hiddenTabs = React.useMemo(() => tabs.filter(tab => !visibleKeys.includes(tab.key)), [tabs, visibleKeys]);

    return <HolyGrail
        header={
            (exceptions.length > 0 || results.length > 0) ?
                <div ref={containerRef} style={{ display: "flex", alignItems: "center", width: "100%", minWidth: 0, overflow: "hidden" }}>
                    <TabList selectedValue={selected} onTabSelect={handleTabSelect} size="small" style={{ display: "flex", minWidth: 0 }}>
                        {tabs.map(tab => {
                            const hidden = !visibleKeys.includes(tab.key);
                            return <div
                                key={tab.key}
                                ref={setItemRef(tab.key)}
                                style={hidden ? { visibility: "hidden", position: "absolute", pointerEvents: "none" } : undefined}
                            >
                                <Tab value={tab.key}>{tab.label}</Tab>
                            </div>;
                        })}
                    </TabList>
                    <OverflowTabMenu tabs={hiddenTabs} onSelect={handleOverflowSelect} />
                </div>
                : undefined
        }
        main={
            (!hasIssues && !hasResults) ?
                complete ?
                    <MessageBar intent="info">
                        {spinnerMessage} - 0 Issues, 0 Results.
                    </MessageBar> :
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Spinner label={spinnerMessage} />
                    </div> :
                selected === __VSCODE_ISSUES ?
                    <WUIssues exceptions={exceptions} /> :
                    hasResults ?
                        <WUResult key={selected} opts={opts} wuid={wuid} name={selectedResult?.Name ?? ""} value={selectedResult?.Value ?? ""} /> :
                        undefined
        }
    />;
};

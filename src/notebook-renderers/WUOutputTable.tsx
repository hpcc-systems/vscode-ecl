
import * as React from "react";
import { Pivot, PivotItem, IPivotStyles, IStyleSet, DetailsList, IColumn, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";
import { useConst } from "@fluentui/react-hooks";
import { ThemeProvider } from "../eclwatch/themeGenerator";
import { WUOutput } from "../notebook/controller";

const bodyStyles = window.getComputedStyle(document.body);

const backColor = bodyStyles.getPropertyValue("--vscode-editor-background") || "white";
const foreColour = bodyStyles.getPropertyValue("--vscode-input-foreground") || "black";

const themeProvider = new ThemeProvider(foreColour, backColor);
themeProvider.loadThemeForColor(bodyStyles.getPropertyValue("--vscode-progressBar-background") || "navy");

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

export const WUOutputSummary: React.FunctionComponent<WUOutput> = (output: WUOutput) => {
    return <>
        <div>{output.wuid}</div>
        <div>Results:  {Object.keys(output.results).map(key => `${key} ${Array.isArray(output.results[key]) ? `(${(output.results[key] as any).length} Rows)` : `[${output.results[key]}]`}`).join(", ")}</div>
    </>;
};

interface WUOutputTableProps {
    result: object;
}

export const WUOutputTable: React.FunctionComponent<WUOutputTableProps> = ({
    result
}) => {
    if (!Array.isArray(result)) {
        return <div>{result}</div>;
    }

    const columns = useConst(Object.keys(result[0]).map((col, index) => {
        return {
            key: col,
            name: col,
            fieldName: col,
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            isSorted: false,
            isSortedDescending: false,
            onColumnClick: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
                console.log(`clicked ${column.fieldName}`);
            }
        };
    }));

    return <DetailsList
        compact={true}
        items={result}
        columns={columns}
        selectionMode={SelectionMode.none}
        setKey="set"
        styles={{ root: { height: "200px", minHeight: "200px", maxHeight: "640px" } }}
        layoutMode={DetailsListLayoutMode.justified}
    />;
};

export const WUOutputTables: React.FunctionComponent<WUOutput> = (output: WUOutput) => {

    const keys = Object.keys(output.results);
    const headers = keys.map(key => `${key}: ${Array.isArray(output.results[key]) ? `[${(output.results[key] as any).length} rows]` : output.results[key]}`);

    return <Pivot overflowBehavior="menu" styles={pivotStyles} >
        {
            keys.map((key, idx) => <PivotItem key={key} itemKey={key} headerText={`${headers[idx]}`} >
                <WUOutputTable result={output.results[key]} />
            </PivotItem>)
        }
    </Pivot>;
};

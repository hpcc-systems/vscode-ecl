
import * as React from "react";
import { Pivot, PivotItem, IPivotStyles, DetailsList, IColumn, DetailsListLayoutMode, SelectionMode, IStyleFunctionOrObject, IPivotStyleProps } from "@fluentui/react";
import { useConst } from "@fluentui/react-hooks";
import { WUOutput } from "../controller/serializer-types";

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

export const WUOutputSummary: React.FunctionComponent<WUOutput> = (output: WUOutput) => {
    return <>
        <div>{output.wuid}</div>
        <div>Results:  {Object.keys(output.results).map(key => `${key} ${Array.isArray(output.results[key]) ? `(${(output.results[key] as any).length} Rows)` : `[${output.results[key]}]`}`).join(", ")}</div>
    </>;
};

interface WUOutputTableProps {
    result: object[] | object;
}

export const WUOutputTable: React.FunctionComponent<WUOutputTableProps> = ({
    result
}) => {
    const columns = useConst(() => {
        if (Array.isArray(result) && result.length > 0 && typeof result[0] === "object" && result[0] !== null) {
            return Object.keys(result[0] as object).map(col => {
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
            });
        }
        return [];
    });

    if (!Array.isArray(result)) {
        return <div>{JSON.stringify(result, null, 2)}</div>;
    }

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

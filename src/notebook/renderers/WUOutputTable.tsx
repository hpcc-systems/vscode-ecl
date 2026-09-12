
import * as React from "react";
import { DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Tab, TabList, createTableColumn, type TableColumnDefinition } from "@fluentui/react-components";
import { useConst } from "@fluentui/react-hooks";
import { WUOutput } from "../controller/serializer-types";

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
    const columns = useConst((): TableColumnDefinition<object>[] => {
        if (Array.isArray(result) && result.length > 0 && typeof result[0] === "object" && result[0] !== null) {
            return Object.keys(result[0] as object).map(col => {
                return createTableColumn<object>({
                    columnId: col,
                    renderHeaderCell: () => col,
                    renderCell: row => String((row as Record<string, unknown>)[col] ?? "")
                });
            });
        }
        return [];
    });

    if (!Array.isArray(result)) {
        return <div>{JSON.stringify(result, null, 2)}</div>;
    }

    return <DataGrid items={result} columns={columns} sortable resizableColumns style={{ height: "200px", minHeight: "200px", maxHeight: "640px" }}>
        <DataGridHeader>
            <DataGridRow>
                {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
            </DataGridRow>
        </DataGridHeader>
        <DataGridBody<object>>
            {({ item, rowId }) => <DataGridRow<object> key={rowId}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>}
        </DataGridBody>
    </DataGrid>;
};

export const WUOutputTables: React.FunctionComponent<WUOutput> = (output: WUOutput) => {

    const keys = Object.keys(output.results);
    const headers = keys.map(key => `${key}: ${Array.isArray(output.results[key]) ? `[${(output.results[key] as any).length} rows]` : output.results[key]}`);

    const [selected, setSelected] = React.useState(keys[0] ?? "");
    return <>
        <TabList selectedValue={selected} onTabSelect={(_, data) => setSelected(String(data.value))}>
            {keys.map((key, idx) => <Tab key={key} value={key}>{headers[idx]}</Tab>)}
        </TabList>
        {selected ? <WUOutputTable result={output.results[selected]} /> : undefined}
    </>;
};

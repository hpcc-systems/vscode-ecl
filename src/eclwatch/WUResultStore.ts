import { Result, XSDSchema, XSDXMLNode } from "@hpcc-js/comms";
import { ColumnType, Deferred, domConstruct, QueryResults, RowFormatter } from "@hpcc-js/dgrid";

type DataRow = Record<string, unknown>;
type FormattedRow = DataRow & {
    __hpcc_id: number;
    __hpcc_orig: DataRow;
};
type RangeResponse = { totalLength: number, data: FormattedRow[] };

export function createEmptyStore() {
    const deferred = new Deferred();
    const results = new QueryResults(deferred.then(response => response.data), {
        totalLength: deferred.then(response => response.totalLength)
    });
    deferred.resolve({ data: [], totalLength: 0 });
    return {
        fetchRange: () => results
    };
}

function entitiesEncode(str: string): string {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function isDataRow(value: unknown): value is DataRow {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export class Store {
    protected wuResult: Result;
    protected schema: XSDSchema;
    protected _columns: ColumnType[];
    protected _cache: Record<string, Promise<RangeResponse>> = {};
    private rowFormatter: RowFormatter;

    constructor(wuResult: Result, schema: XSDSchema, renderHtml: boolean) {
        this.wuResult = wuResult;
        this.schema = schema;
        this._columns = this.schema2Columns(this.schema.root);
        this.rowFormatter = new RowFormatter(this._columns, renderHtml);
    }

    columns() {
        return this._columns;
    }

    schema2Columns(parentNode: XSDXMLNode, prefix: string = ""): ColumnType[] {
        if (!parentNode) return [];
        return parentNode.children().filter(node => node.name.indexOf("__hidden", node.name.length - "__hidden".length) === -1).map((node, idx) => {
            const label = node.name;
            const keyed = node.attrs["hpcc:keyed"];
            const column: ColumnType = {
                field: prefix + label,
                leafID: label,
                idx,
                label: label + (keyed ? " (i)" : ""),
                className: "resultGridCell",
                hidden: false,
                sortable: false,
                width: keyed ? 16 : 0,
                isSet: node.isSet
            };
            const children = this.schema2Columns(node, prefix + label + "_");
            if (children.length) {
                column.width += 10 + children.reduce((prev: number, childNode: ColumnType) => {
                    return prev + childNode.width!;
                }, 0);
                column.children = children;
            } else {
                column.width += node.charWidth() * 9;
                column.renderCell = (_row, cell: unknown, cellElement) => {
                    cellElement.innerHTML = typeof cell === "string" ?
                        cell.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").trim() :
                        entitiesEncode(cell as string ?? "");
                };
            }
            return column;
        });
    }

    isChildDataset(cell: unknown): cell is DataRow {
        if (!isDataRow(cell)) {
            return false;
        }
        const keys = Object.keys(cell);
        return keys.length === 1 && Array.isArray(cell[keys[0]]);
    }

    rowToTable(cell: unknown, _row: unknown, node: HTMLElement): void {
        if (this.isChildDataset(cell)) {  //  Don't display "Row" as a header  ---
            for (const value of Object.values(cell)) {
                this.rowToTable(value, _row, node);
            }
            return;
        }

        const table = domConstruct.create("table", { border: 1, cellspacing: 0, width: "100%" }, node);
        if (isDataRow(cell)) {
            const entries = Object.entries(cell);
            const headerRow = domConstruct.create("tr", null, table);
            for (const [key] of entries) {
                const header = domConstruct.create("th", null, headerRow);
                header.textContent = key;
            }
            const valueRow = domConstruct.create("tr", null, table);
            for (const [, value] of entries) {
                const dataCell = domConstruct.create("td", null, valueRow);
                if (isDataRow(value) || Array.isArray(value)) {
                    this.rowToTable(value, _row, dataCell);
                } else {
                    dataCell.textContent = value === undefined || value === null ? "" : String(value);
                }
            }
        } else if (Array.isArray(cell)) {
            cell.forEach((item, index) => {
                if (isDataRow(item)) {
                    const entries = Object.entries(item);
                    if (index === 0) {
                        const headerRow = domConstruct.create("tr", null, table);
                        for (const [key] of entries) {
                            const header = domConstruct.create("th", null, headerRow);
                            header.textContent = key;
                        }
                    }
                    const valueRow = domConstruct.create("tr", null, table);
                    for (const [, value] of entries) {
                        const dataCell = domConstruct.create("td", null, valueRow);
                        if (isDataRow(value) || Array.isArray(value)) {
                            this.rowToTable(value, item, dataCell);
                        } else {
                            dataCell.textContent = value === undefined || value === null ? "" : String(value);
                        }
                    }
                } else if (Array.isArray(item)) {
                    const valueRow = domConstruct.create("tr", null, table);
                    const dataCell = domConstruct.create("td", null, valueRow);
                    this.rowToTable(item, _row, dataCell);
                } else {
                    const valueRow = domConstruct.create("tr", null, table);
                    const dataCell = domConstruct.create("td", null, valueRow);
                    dataCell.textContent = item === undefined || item === null ? "" : String(item);
                }
            });
        }
    }

    getIdentity(row: FormattedRow): number {
        return row.__hpcc_id;
    }

    _request(start: number, end: number): Promise<RangeResponse> {
        if (!this.wuResult) return Promise.resolve({ totalLength: 0, data: [] });
        const cacheKey = `${start}->${end}`;
        if (this._cache[cacheKey]) return this._cache[cacheKey];
        const request = this.wuResult.fetchRows(start, end - start).then((rows: DataRow[]) => {
            return {
                totalLength: this.wuResult.Total,
                data: rows.map((row, idx) => {
                    const formattedRow = this.rowFormatter.format(row) as FormattedRow;
                    formattedRow.__hpcc_id = start + idx;
                    formattedRow.__hpcc_orig = row;
                    return formattedRow;
                })
            };
        }).catch((error: unknown) => {
            delete this._cache[cacheKey];
            throw error;
        });
        this._cache[cacheKey] = request;
        return request;
    }

    fetchRange(options: { start: number, end: number }): Promise<FormattedRow[]> {
        const retVal = new Deferred();
        this._request(options.start, options.end)
            .then(response => retVal.resolve(response))
            .catch(error => retVal.reject(error));
        return new QueryResults(retVal.then(response => response.data), {
            totalLength: retVal.then(response => response.totalLength)
        });
    }
}

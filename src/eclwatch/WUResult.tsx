import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { useConst } from "@fluentui/react-hooks";
import { Result, type XSDXMLNode, type IOptions, type WsWorkunits } from "@hpcc-js/comms";
import { Common, Table } from "@hpcc-js/dgrid";
import { hashSum } from "@hpcc-js/util";
import { Button, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogOpenChangeData, DialogOpenChangeEvent, DialogSurface, DialogTitle, Field, FluentProvider, Menu, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger, ProgressBar, SpinButton } from "@fluentui/react-components";
import copy from "copy-to-clipboard";
import { VisualizationComponent } from "./hpccVizAdapter";
import { initTheme } from "./themeGenerator";
import { createEmptyStore, Store } from "./WUResultStore";

import "./WUResult.css";

function typeTPL(type: string, isSet: boolean) {
    const prefix = isSet ? "SET OF " : "";
    switch (type) {
        case "xs:boolean":
            return prefix + "BOOLEAN";
        case "xs:integer":
            return prefix + "INTEGER";
        case "xs:nonNegativeInteger":
            return prefix + "UNSIGNED INTEGER";
        case "xs:real":
            return prefix + "REAL";
        case "xs:string":
            return prefix + "VARSTRING";
        case "xs:hexBinary":
            return prefix + "DATA";
        default:
            return prefix + type.toUpperCase();
    }
}

function valueTPL(value: unknown): string | number {
    switch (typeof value) {
        case "string":
            return `'${value.split("'").join("\\'").trimEnd()}'`;
        case "number":
            return value;
        case "boolean":
            return value === true ? "TRUE" : "FALSE";
        case "bigint":
            return String(value);
        case "object":
            if (value === null) {
                return "''";
            }
            if (Array.isArray(value)) {
                return `[${value.map(valueTPL).join(", ")}]`;
            }
            return rowTPL(value as GenericRow);
        default:
            return "''";
    }
}

type GenericRow = Record<string, unknown>;

interface GridRow {
    data?: GenericRow & {
        __hpcc_orig?: GenericRow;
    };
}

function createReactHost(): { root: Root, dispose: () => void } {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const root = createRoot(element);
    let disposed = false;
    return {
        root,
        dispose: () => {
            if (!disposed) {
                disposed = true;
                root.unmount();
                element.remove();
            }
        }
    };
}

function reportCopyError(error: unknown): void {
    if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Failed to copy ECL result", error);
    }
}

function rowTPL(row: GenericRow) {
    return `{${Object.values(row).map(field => {
        if (field && typeof field === "object" && "Item" in field && Array.isArray(field.Item)) {
            return `[${field.Item.map(valueTPL).join(", ")}]`;
        }
        return valueTPL(field);
    }).join(", ")}}`;
}

function rowsTPL(row: GenericRow[], prefix = "    ") {
    return row.map(r => `${prefix}${rowTPL(r)}`).join(",\n");
}

function copyRowsTPL(fields: XSDXMLNode[], row: GenericRow[]) {
    return `
r := RECORD
${fields.map(f => `    ${typeTPL(f.type, f.isSet)} ${f.name};`).join("\n")}
END;

d := DATASET([
${rowsTPL(row)}
], r);
`;
}

function copyColumnTPL(col: number, dedup: boolean, fields: XSDXMLNode[], row: GenericRow[]) {
    const name = fields[col].name;
    let set: (string | number)[];
    if (dedup) {
        const dedupMap: Record<string, true> = {};
        row.map(r => valueTPL(r[name])).forEach(value => { dedupMap[String(value)] = true; });
        set = Object.keys(dedupMap);
    } else {
        set = row.map(r => valueTPL(r[name]));
    }
    return `
SET OF ${typeTPL(fields[col].type, false)} ${name} := [${set.join(",")}];
`;
}

interface ContextualMenuBasicExampleProps {
    target: MouseEvent;
    menuItems: MenuItemDefinition[];
    onDismiss: () => void;
}

const ContextMenu: React.FunctionComponent<ContextualMenuBasicExampleProps> = ({
    target,
    menuItems,
    onDismiss,
}) => {
    return <Menu open onOpenChange={(_, data) => { if (!data.open) onDismiss(); }}>
        <MenuTrigger disableButtonEnhancement>
            <span style={{ position: "fixed", left: target.clientX, top: target.clientY, width: 1, height: 1 }} />
        </MenuTrigger>
        <MenuPopover>
            <MenuList>
                {menuItems.map(item => item.itemType === "divider" ?
                    <MenuDivider key={item.key} /> :
                    <MenuItem key={item.key} onClick={item.onClick}>{item.text}</MenuItem>)}
            </MenuList>
        </MenuPopover>
    </Menu>;
};

interface MenuItemDefinition {
    key: string;
    text?: string;
    onClick?: () => void;
    itemType?: "divider";
}

interface DownloadDialogProps {
    totalRows: number;
    column: boolean;
    onClose: (rowsToDownload: number, dedup: boolean) => void;
}

const DownloadDialog: React.FunctionComponent<DownloadDialogProps> = ({
    totalRows,
    column = false,
    onClose,
}) => {
    const handleOk = () => {
        onClose(downloadTotal, dedup);
    };
    const handleCancel = () => {
        onClose(0, dedup);
    };

    const [downloadTotal, setDownloadTotal] = React.useState(totalRows);
    const onDownloadTotalValidate = (value: string) => {
        let v: number = parseInt(value);
        if (isNaN(v)) {
            v = totalRows;
        } else if (v < 0) {
            v = 0;
        } else if (v > totalRows) {
            v = totalRows;
        }
        setDownloadTotal(v);
        return String(v);
    };

    const [dedup, setDedup] = React.useState(true);
    const onDedup = (_event: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean | "mixed" }) => {
        setDedup(data.checked === true);
    };

    return <Dialog open onOpenChange={(_event: DialogOpenChangeEvent, data: DialogOpenChangeData) => { if (!data.open) handleCancel(); }}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Download Results</DialogTitle>
                <DialogContent>
                    <p>{`Confirm total number of rows to download (max ${totalRows} rows).`}</p>
                    <Field label="Download:">
                        <SpinButton
                            defaultValue={totalRows}
                            min={0}
                            max={totalRows}
                            step={1}
                            incrementButton={{ "aria-label": "Increase value by 1" }}
                            decrementButton={{ "aria-label": "Decrease value by 1" }}
                            onChange={(_, data) => onDownloadTotalValidate(data.displayValue ?? String(data.value ?? totalRows))}
                        />
                    </Field>
                    {column ? <Checkbox label="De-duplicate" defaultChecked onChange={onDedup} /> : undefined}
                </DialogContent>
                <DialogActions>
                    <Button appearance="primary" onClick={handleOk}>Ok</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>;
};

interface DownloadProgressProps {
    totalRows: number;
    onCancel: () => void;
}

export const DownloadProgress: React.FunctionComponent<DownloadProgressProps> = ({
    totalRows,
    onCancel
}) => {

    const handleCancel = () => {
        onCancel();
    };

    return <Dialog open onOpenChange={(_event: DialogOpenChangeEvent, data: DialogOpenChangeData) => { if (!data.open) handleCancel(); }}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>Download Results</DialogTitle>
                <DialogContent>
                    <ProgressBar aria-label="Downloading" />
                    <div>{`${totalRows} rows`}</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>;
};

export class WUResultTable extends Common {
    private _result: Result | undefined;
    private _contextMenuRoot?: Root;
    private _contextMenuHost?: HTMLElement;

    constructor() {
        super();
        this.renderHtml(false)
            .pagination(true)
            .pageSize(50)
            ;
    }

    calcResult(): Result | null {
        if (this.wuid() && this.resultName()) {
            return Result.attach(this.opts(), this.wuid(), this.resultName());
        } else if (this.wuid() && this.sequence() !== undefined) {
            return Result.attach(this.opts(), this.wuid(), this.sequence());
        } else if (this.logicalFile()) {
            return Result.attachLogicalFile(this.opts(), this.cluster(), this.logicalFile());
        }
        return null;
    }

    fetch(row: number, count: number): Promise<GenericRow[]> {
        const result = this._result;
        if (!result) {
            return Promise.reject(new Error("No result available"));
        }
        const abortController = new AbortController();
        const host = createReactHost();
        host.root.render(<FluentProvider theme={initTheme()}>
            <DownloadProgress
                totalRows={result.Total}
                onCancel={() => abortController.abort()}
            />
        </FluentProvider>);
        return result.fetchRows(row, count, false, {}, abortController.signal)
            .finally(host.dispose);
    }

    confirmDownload(column: boolean = false): Promise<{ downloadTotal: number, dedup: boolean }> {
        const result = this._result;
        if (!result) {
            return Promise.reject(new Error("No result available"));
        }
        if (!column && result.Total <= 1000) return Promise.resolve({ downloadTotal: result.Total, dedup: false });
        const host = createReactHost();
        return new Promise(resolve => {
            host.root.render(<FluentProvider theme={initTheme()}>
                <DownloadDialog
                    totalRows={result.Total}
                    column={column}
                    onClose={(downloadTotal, dedup) => {
                        resolve({ downloadTotal, dedup });
                        queueMicrotask(host.dispose);
                    }}
                />
            </FluentProvider>);
        });
    }

    copyRow(row: GridRow): void {
        const originalRow = row.data?.__hpcc_orig;
        if (this._result && originalRow) {
            copy(copyRowsTPL(this._result.fields(), [originalRow]));
        }
    }

    async copyColumn(col: { column: { idx: number } }): Promise<void> {
        try {
            if (this._result) {
                const idx = col.column.idx;
                const { downloadTotal, dedup } = await this.confirmDownload(true);
                if (downloadTotal > 0) {
                    const rows = await this.fetch(0, downloadTotal);
                    copy(copyColumnTPL(idx, dedup, this._result.fields(), rows));
                }
            }
        } catch (error) {
            reportCopyError(error);
        }
    }

    async copyAll(): Promise<void> {
        try {
            if (this._result) {
                const { downloadTotal } = await this.confirmDownload();
                if (downloadTotal > 0) {
                    const rows = await this.fetch(0, downloadTotal);
                    copy(copyRowsTPL(this._result.fields(), rows));
                }
            }
        } catch (error) {
            reportCopyError(error);
        }
    }

    private closeContextMenu(expectedRoot = this._contextMenuRoot): void {
        if (expectedRoot !== this._contextMenuRoot) {
            return;
        }
        const root = this._contextMenuRoot;
        const host = this._contextMenuHost;
        this._contextMenuRoot = undefined;
        this._contextMenuHost = undefined;
        root?.unmount();
        host?.remove();
    }

    private showContextMenu(target: MouseEvent, menuItems: MenuItemDefinition[]): void {
        this.closeContextMenu();
        this._contextMenuHost = document.createElement("div");
        document.body.appendChild(this._contextMenuHost);
        this._contextMenuRoot = createRoot(this._contextMenuHost);
        const root = this._contextMenuRoot;
        root.render(
            <FluentProvider theme={initTheme()}>
                <ContextMenu
                    target={target}
                    menuItems={menuItems}
                    onDismiss={() => queueMicrotask(() => this.closeContextMenu(root))}
                />
            </FluentProvider>
        );
    }

    protected _prevHash?: string;
    private _prevGrid: any;
    update(domNode: HTMLElement, element: any) {
        super.update(domNode, element);
        const hash = hashSum({
            opts: hashSum(this.opts()),
            wuid: this.wuid(),
            resultName: this.resultName(),
            resultValue: this.resultValue(),
            sequence: this.sequence(),
            logicalFile: this.logicalFile()
        });
        if (this._prevHash !== hash) {
            this._prevHash = hash;
            this._result = this.calcResult();
            this._dgrid?.set("columns", []);
            this._dgrid?.set("collection", createEmptyStore());
            if (this._result) {
                const result = this._result;
                result.fetchXMLSchema()
                    .then((schema: any) => {
                        if (this._result === result) {
                            const store = new Store(result, schema, this.renderHtml());
                            this._dgrid?.set("columns", store.columns());
                            this._dgrid?.set("collection", store);
                        }
                    }).catch((error: unknown) => {
                        this._prevHash = undefined;
                        console.error("Failed to load result schema", error);
                    })
                    ;
            }
        }
        if (this._prevGrid !== this._dgrid) {
            this._prevGrid = this._dgrid;
            this._dgrid.on(".dgrid-header .dgrid-cell:contextmenu", (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                const cell = this._dgrid.cell(e);
                this.showContextMenu(e,
                    cell.column.isSet ? [
                        {
                            key: "copyAllAsECL",
                            text: "Copy All as ECL",
                            onClick: () => this.copyAll()
                        }
                    ] : [
                        {
                            key: "copyColumnAsECL",
                            text: "Copy Column as ECL SET",
                            onClick: () => {
                                void this.copyColumn(cell);
                            }
                        },
                        {
                            key: "div1",
                            itemType: "divider",
                        },
                        {
                            key: "copyAllAsECL",
                            text: "Copy All as ECL",
                            onClick: () => void this.copyAll()
                        }
                    ]
                );
            });

            this._dgrid.on(".dgrid-content .dgrid-cell:contextmenu", (e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                const row = this._dgrid.row(e);
                this.showContextMenu(e, [
                    {
                        key: "copyRowAsECL",
                        text: "Copy Row as ECL",
                        onClick: () => this.copyRow(row)
                    },
                    {
                        key: "div1",
                        itemType: "divider",
                    },
                    {
                        key: "copyAllAsECL",
                        text: "Copy All as ECL",
                        onClick: () => void this.copyAll()
                    }
                ]
                );
            });

        }
    }

    exit(domNode: HTMLElement, element: unknown): void {
        this.closeContextMenu();
        super.exit(domNode, element);
    }

    click(_row: unknown, _col: unknown, _sel: unknown, _more: unknown): void {
    }
}
WUResultTable.prototype._class += " eclwatch_WUResultTable";

export interface WUResultTable {
    opts(): IOptions;
    opts(_: IOptions): this;
    wuid(): string;
    wuid(_: string): this;
    resultName(): string;
    resultName(_: string): this;
    resultValue(): string;
    resultValue(_: string): this;
    sequence(): number;
    sequence(_: number): this;
    cluster(): string;
    cluster(_: string): this;
    logicalFile(): string;
    logicalFile(_: string): this;
}
WUResultTable.prototype.publish("opts", null, "object", "Options");
WUResultTable.prototype.publish("wuid", null, "string", "Workunit ID");
WUResultTable.prototype.publish("resultName", null, "string", "Result Name");
WUResultTable.prototype.publish("resultValue", null, "string", "Result Value");
WUResultTable.prototype.publish("sequence", null, "number", "Sequence");
WUResultTable.prototype.publish("cluster", null, "string", "Cluster");
WUResultTable.prototype.publish("logicalFile", null, "string", "Logical File");

interface WUResultProps {
    opts: IOptions;
    wuid: string;
    name: string;
    value: string;
}

export const WUResult: React.FunctionComponent<WUResultProps> = ({
    opts,
    wuid,
    name,
    value
}) => {

    const table = useConst(() => new WUResultTable());

    React.useEffect(() => {
        if (table) {
            table
                .opts(opts)
                .wuid(wuid)
                .resultName(name)
                .resultValue(value)
                ;
        }
    }, [table, opts, wuid, name, value]);

    return <VisualizationComponent widget={table} debounce={true}>
    </VisualizationComponent>;
};

interface WUIssues {
    exceptions: WsWorkunits.ECLException[];
}

export const WUIssues: React.FunctionComponent<WUIssues> = ({
    exceptions
}) => {

    const table = useConst(() => new Table());

    React.useEffect(() => {

        table
            .columns(["Severity", "Source", "Code", "Message", "Col", "Line", "File Name"])
            .data(exceptions.map(e => [e.Severity, e.Source, e.Code, e.Message, e.Column, e.LineNo, e.FileName]))
            ;
    }, [exceptions, table]);

    return <VisualizationComponent widget={table} debounce={false} >
    </VisualizationComponent>;
};

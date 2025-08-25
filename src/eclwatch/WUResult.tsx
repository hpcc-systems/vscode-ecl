import * as React from "react";
import * as ReactDOM from "react-dom";
import { useConst } from "@fluentui/react-hooks";
import { Result } from "@hpcc-js/comms";
import type { XSDXMLNode, IOptions, WsWorkunits } from "@hpcc-js/comms";
import { Common, Table } from "@hpcc-js/dgrid";
import { hashSum } from "@hpcc-js/util";
import { Stack, Checkbox, ContextualMenu, ContextualMenuItemType, DefaultButton, Dialog, DialogFooter, DialogType, IContextualMenuItem, PrimaryButton, ProgressIndicator, SpinButton } from "@fluentui/react";
import copy from "copy-to-clipboard";
import { VisualizationComponent } from "./hpccVizAdapter";
import { Store } from "./WUResultStore";

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

function valueTPL(value: string | number | boolean) {
    switch (typeof value) {
        case "string":
            return `'${value.split("'").join("\\'").trimRight()}'`;
        case "number":
            return value;
        case "boolean":
            return value === true ? "TRUE" : "FALSE";
    }
}

function rowTPL(row: object) {
    return `{${Object.values(row).map(field => {
        if (field.Item) {
            return `[${field.Item.map(valueTPL).join(", ")}]`;
        }
        return valueTPL(field);
    }).join(", ")}}`;
}

function rowsTPL(row: object[], prefix = "    ") {
    return row.map(row => `${prefix}${rowTPL(row)}`).join(",\n");
}

function copyRowsTPL(fields: XSDXMLNode[], row: object[]) {
    return `
r := RECORD
${fields.map(f => `    ${typeTPL(f.type, f.isSet)} ${f.name};`).join("\n")}
END;

d := DATASET([
${rowsTPL(row)}
], r);
`;
}

function copyColumnTPL(col: number, dedup: boolean, fields: XSDXMLNode[], row: object[]) {
    const name = fields[col].name;
    let set;
    if (dedup) {
        const dedupMap = {};
        row.map(r => valueTPL(r[name])).forEach(n => dedupMap[n] = true);
        set = Object.keys(dedupMap);
    } else {
        set = row.map(r => valueTPL(r[name]));
    }
    return `
SET OF ${typeTPL(fields[col].type, false)} ${name} := [${set.join(",")}];
`;
}

interface ContextualMenuBasicExampleProps {
    target: any;
    menuItems: IContextualMenuItem[];
}

const ContextMenu: React.FunctionComponent<ContextualMenuBasicExampleProps> = ({
    target,
    menuItems,
}) => {
    const [showContextualMenu, setShowContextualMenu] = React.useState(true);
    const onHideContextualMenu = React.useCallback(() => setShowContextualMenu(false), []);

    return <ContextualMenu
        items={menuItems}
        hidden={!showContextualMenu}
        target={target}
        onItemClick={onHideContextualMenu}
        onDismiss={onHideContextualMenu}
    />;
};

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
    const dialogContentProps = {
        type: DialogType.largeHeader,
        title: "Download Results",
        subText: `Confirm total number of rows to download (max ${totalRows} rows).`,
    };
    const stackTokens = { childrenGap: 10 };

    const [hideDialog, setHideDialog] = React.useState(false);
    const handleOk = () => {
        setHideDialog(true);
        onClose(downloadTotal, dedup);
    };
    const handleCancel = () => {
        setHideDialog(true);
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
    const onDedup = (ev?: React.FormEvent<HTMLElement>, isChecked?: boolean) => {
    };

    return <Dialog
        hidden={hideDialog}
        onDismiss={handleCancel}
        dialogContentProps={dialogContentProps}
    >
        <Stack tokens={stackTokens}>
            <SpinButton
                defaultValue={`${totalRows}`}
                label={"Download:"}
                min={0}
                max={totalRows}
                step={1}
                incrementButtonAriaLabel={"Increase value by 1"}
                decrementButtonAriaLabel={"Decrease value by 1"}
                onValidate={onDownloadTotalValidate}
            />
            {column ?
                <Checkbox label="De-duplicate" boxSide="end" defaultChecked onChange={onDedup} /> :
                undefined}
        </Stack>
        <DialogFooter>
            <PrimaryButton onClick={handleOk} text="Ok" />
            <DefaultButton onClick={handleCancel} text="Cancel" />
        </DialogFooter>
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

    const dialogContentProps = {
        type: DialogType.normal,
        title: "Download Results",
    };

    const [hideDialog, setHideDialog] = React.useState(false);
    const handleCancel = () => {
        setHideDialog(true);
        onCancel();
    };

    return <Dialog
        hidden={hideDialog}
        dialogContentProps={dialogContentProps}
    >
        <ProgressIndicator label="Downloading..." description={`${totalRows} rows`} />
        <DialogFooter>
            <PrimaryButton onClick={handleCancel} text="Cancel" />
        </DialogFooter>
    </Dialog>;
};

export class WUResultTable extends Common {
    private _result: Result | undefined;

    constructor() {
        super();
        this.renderHtml(false);
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

    fetch(row, count): Promise<object[]> {
        const abortController = new AbortController();

        return new Promise((resolve, reject) => {
            if (!this._result) {
                reject(new Error("No result available"));
            }
            const element = document.createElement("div");
            ReactDOM.render(<DownloadProgress
                totalRows={this._result!.Total}
                onCancel={() => {
                    abortController.abort();
                    reject(new Error("Download cancelled"));
                }}
            />, element);
            this._result!.fetchRows(row, count, false, {}, abortController.signal).then((rows) => {
                ReactDOM.unmountComponentAtNode(element);
                resolve(rows);
            });
        });
    }

    confirmDownload(column: boolean = false): Promise<{ downloadTotal: number, dedup: boolean }> {
        if (!column && this._result && this._result.Total <= 1000) return Promise.resolve({ downloadTotal: this._result.Total, dedup: false });
        return new Promise((resolve, reject) => {
            if (!this._result) {
                reject(new Error("No result available"));
            }
            const element = document.createElement("div");
            ReactDOM.render(<DownloadDialog
                totalRows={this._result!.Total}
                column={column}
                onClose={(downloadTotal, dedup) => resolve({ downloadTotal, dedup })}
            />, element);
        });
    }

    copyRow(row) {
        if (this._result) {
            this.fetch(row, 1).then(rows => {
                copy(copyRowsTPL(this._result!.fields(), rows));
            });
        }
    }

    async copyColumn(col) {
        if (this._result) {
            const idx = col.column.idx;
            const { downloadTotal, dedup } = await this.confirmDownload(true);
            if (downloadTotal > 0) {
                this.fetch(0, downloadTotal).then(rows => {
                    copy(copyColumnTPL(idx, dedup, this._result!.fields(), rows));
                });
            }
        }
    }

    async copyAll() {
        if (this._result) {
            const { downloadTotal } = await this.confirmDownload();
            if (downloadTotal > 0) {
                this.fetch(0, downloadTotal).then(rows => {
                    copy(copyRowsTPL(this._result!.fields(), rows));
                });
            }
        }
    }

    protected _prevHash?: string;
    private _prevGrid;
    update(domNode, element) {
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
            if (this._result) {
                this._result.fetchXMLSchema()
                    .then(schema => {
                        const store = new Store(this._result!, schema!, this.renderHtml());
                        this._dgrid?.set("columns", store.columns());
                        this._dgrid?.set("collection", store);
                    }).catch(e => {
                        this._prevHash = undefined;
                    })
                    ;
            }
        }
        if (this._prevGrid !== this._dgrid) {
            this._prevGrid = this._dgrid;
            this._dgrid.on(".dgrid-header .dgrid-cell:contextmenu", (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                const cell = this._dgrid.cell(e);
                const pDiv = document.createElement("div");
                (e.target as HTMLElement).appendChild(pDiv);
                ReactDOM.render(
                    <ContextMenu target={e} menuItems={
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
                                    this.copyColumn(cell);
                                }
                            },
                            {
                                key: "div1",
                                itemType: ContextualMenuItemType.Divider,
                            },
                            {
                                key: "copyAllAsECL",
                                text: "Copy All as ECL",
                                onClick: () => this.copyAll()
                            }
                        ]} />,
                    pDiv
                );
            });

            this._dgrid.on(".dgrid-content .dgrid-cell:contextmenu", (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                const row = this._dgrid.row(e);
                const pDiv = document.createElement("div");
                (e.target as HTMLElement).appendChild(pDiv);
                ReactDOM.render(
                    <ContextMenu target={e} menuItems={[
                        {
                            key: "copyRowAsECL",
                            text: "Copy Row as ECL",
                            onClick: () => this.copyRow(row)
                        },
                        {
                            key: "div1",
                            itemType: ContextualMenuItemType.Divider,
                        },
                        {
                            key: "copyAllAsECL",
                            text: "Copy All as ECL",
                            onClick: () => this.copyAll()
                        }
                    ]} />,
                    pDiv
                );
            });

        }
    }

    click(row, col, sel) {
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

    const table = React.useRef(
        new Table()
    ).current;

    table
        .columns(["Severity", "Source", "Code", "Message", "Col", "Line", "File Name"])
        .data(exceptions.map(e => [e.Severity, e.Source, e.Code, e.Message, e.Column, e.LineNo, e.FileName]))
        ;

    return <VisualizationComponent widget={table} debounce={false} >
    </VisualizationComponent>;
};

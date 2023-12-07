import * as path from "path";
import * as vscode from "vscode";
import { Workunit, Result } from "@hpcc-js/comms";
import { eclStatusBar } from "./status";
import ExcelJS from "exceljs";
import { createArrayCsvWriter } from "csv-writer";
import localize from "../util/localize";

export enum SaveFileType { UNKNOWN, CSV, WORKBOOK }
export enum SaveType { UNKNOWN, WORKUNIT, RESULT }

export let saveData: SaveData;
export class SaveData {
    private _wu: Workunit;
    private _saveType: SaveType;
    private _type: SaveFileType;
    private _filePath: string;
    private _resultCount: number;
    private _numResults: number;
    private _workbook: any;
    private _sheet: ExcelJS.WorksheetView;
    private _csvWriter: any;
    private _createCsvWriter: any;
    private _dataRows: string[][];

    private _maxRows = 50000;

    constructor(wu: Workunit) {
        this._wu = wu;
    }

    async askFileSave(resultName: string="") {
        this._type = SaveFileType.UNKNOWN;
        const filePath = this._saveType == SaveType.RESULT ? this.filePathResult(this._wu.Wuid, resultName) : this._wu.Wuid;
        const filts = {};
        filts[localize("CSV Files")] = ["csv"];
        filts[localize("Excel Workbooks")] = ["xlsx"];

        const excelType = localize("Excel Workbooks");
        const options: vscode.OpenDialogOptions = {
            defaultUri: vscode.Uri.file(filePath),
            canSelectMany: false,
            openLabel: localize("Open"),
            filters: filts
        };

       await vscode.window.showSaveDialog(options).then(fileInfos => {
            this._filePath = fileInfos.fsPath;
            if (fileInfos.fsPath.endsWith(".csv")) {
                this._type = SaveFileType.CSV;
            } else {
                this._type = SaveFileType.WORKBOOK;
            }
        });
    }
    
    async saveWUAs(wu: Workunit) {
        this._saveType = SaveType.WORKUNIT;
        this._wu = wu;
        await this.askFileSave();
        if (this._type != SaveFileType.UNKNOWN) {
            this.saveDataFile();
        }
    }

    async saveResultAs(result: Result) {
        this._saveType = SaveType.RESULT;
        await this.askFileSave(result.Name);
        if (this._type != SaveFileType.UNKNOWN) {
            this.saveResultFile(result);
        }        
    }

    async saveResultFile(result: Result) {
        const s = result.Sequence;
        const results = await this._wu.fetchResults();
        this._numResults = results.length;
        this._resultCount = 0;

        const res = results[s];
        const rowCount = res.Total;
        const userLimit = await this.promptUserMaxRows(rowCount);
        if (userLimit) {
            if (this._type == SaveFileType.WORKBOOK)
                this._workbook = new ExcelJS.Workbook();
            this.blockSave(res, userLimit);  
        }     
    }
        
    async saveDataFile() {
        const results = await this._wu.fetchResults();
        this._numResults = results.length;
        this._resultCount = 0;

        const userLimit = await this.askRowCount(results);
        if (userLimit) {
            if (this._type == SaveFileType.WORKBOOK)
                this._workbook = new ExcelJS.Workbook();
            for (const result of results) {
                await this.blockSave(result, userLimit);
            }            
        } 
    }
        
    async blockSave(result, maxRows) {
        const pieceSize = 5000;
        const totalRows = result.Total > maxRows ? maxRows : result.Total;
        const numPieces = Math.floor(totalRows / pieceSize);
        const pieces = numPieces == 0 ? 1 : numPieces;
        let i = 0;
        let number = 0;
        let displayNum = 0;

        if (this._type == SaveFileType.CSV) {
            this._createCsvWriter = createArrayCsvWriter;
            eclStatusBar.showClientTools(`${result.Name} saving`, localize("CSV File"));
            this._dataRows = [];            
        } else {
            this._sheet = this._workbook.addWorksheet(result.Name);
        }

        for (let s = 0; i < pieces; s += pieceSize, i++) {
            number = totalRows < pieceSize ? totalRows : pieceSize;
            displayNum = s + pieceSize > totalRows ? totalRows : s + pieceSize;
            eclStatusBar.showClientTools(`${result.Name} (${displayNum} of ${totalRows})...`, `${localize("Saving data to")} ${this._filePath}`);
            await this.fetchRows(result, s, number);
        }

        if (this._type == SaveFileType.CSV) {
            this._csvWriter
                .writeRecords(this._dataRows)
                .then(() => console.log(localize("CSV file successfully written")))
                .catch((err) => console.error(localize("Error writing CSV file:"), err));
            eclStatusBar.showClientTools(`${result.Name} ${localize("saved")}`, "CSV File");

        } else if (this._saveType == SaveType.RESULT || ++this._resultCount == this._numResults) {
            eclStatusBar.showClientTools(`${result.Name} ${localize("saving")}`, localize("Excel File"));
            await this.writeExcelFile(this._workbook, this._filePath);
            eclStatusBar.showClientTools(`${result.Name} ${localize("saved")}`, localize("Excel File"));
        }
    }

    async fetchRows(result, start: number, number: number) {
        if (this._type == SaveFileType.CSV)
            await this.fetchCSVRows(result, start, number);
        else
            await this.fetchExcelRows(this._sheet, result, start, number);
    }

    async fetchCSVRows(result, start: number, number: number) {
        await result.fetchRows(start, number).then(rows => {
            if (start == 0) {
                const header = [];
                for (const row of rows) {
                    for (const key in row) {
                        header.push(key);
                    }
                    break;
                }
                const filePath = this._saveType == SaveType.RESULT ? this._filePath : this.filePathResult(this._filePath, result.Name, ".csv");
                    
                this._csvWriter = this._createCsvWriter({
                    path: filePath,
                    header
                });
            }

            for (const row of rows) {
                const rowStr = [];
                for (const key in row) {
                    rowStr.push(row[key]);
                }
                this._dataRows.push(rowStr);
            }
        });
    }

    async fetchExcelRows(sheet, result, start: number, number: number) {
        await result.fetchRows(start, number).then(rows => {
            let firstrow = 1;
            const columns = [];
            rows.forEach(function (row) {
                if (firstrow) {
                    for (const key in row) {
                        const col = {};
                        col["header"] = key;
                        col["key"] = key;
                        columns.push(col);
                    }
                    sheet.columns = columns;
                    firstrow = 0;
                }
                sheet.addRow(row);
            });
        });
    }
    
    async askRowCount(results): Promise<number> {
        let maxRowsFound = 0;

        for (const result of results) {
            if (result.Total > maxRowsFound)
            maxRowsFound = result.Total;
        }
        let userLimit = -1;
        if (maxRowsFound > this._maxRows) {
            userLimit = await this.promptUserMaxRows(maxRowsFound);
        } else {
            userLimit = this._maxRows;
        }
        return userLimit;
    }

    async promptUserMaxRows(rowCount: number): Promise<number> {
        let userLimit = -1;
        while (userLimit == -1 || userLimit > this._maxRows) {
            userLimit = await this.promptMaxRows(rowCount);
        }
        return userLimit;
    }

    async promptMaxRows(maxRowsFound: number): Promise<number> {
        if (maxRowsFound <= this._maxRows)
            return maxRowsFound;
        let prompt = localize("MMM rows found. Please choose NNN or less");
        prompt = prompt.replace("MMM", maxRowsFound.toString());
        prompt = prompt.replace("NNN", this._maxRows.toString());
        const rows = await vscode.window.showInputBox({
            title: localize("Max number of rows to save"),
            prompt: prompt,
            password: false,
            value: this._maxRows.toString()
        }) || "";
        return rows.length == 0 ? 0 : Number(rows);
    }

    filePathResult(filePath: string, resultName: string, ext: string=""): string {
        let newFilePath = this._saveType == SaveType.RESULT ? filePath : path.join(path.parse(filePath).dir, path.parse(filePath).name);

        if (resultName) {
            resultName = resultName.replaceAll(" ", "-");
            newFilePath += "_" + resultName;
        }

        if (ext)
            newFilePath += ext;
        return newFilePath;
    }

    async writeExcelFile(workbook, filename: string) {
        await workbook.xlsx.writeFile(filename);
    }
}
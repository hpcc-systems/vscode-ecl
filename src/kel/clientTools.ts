import { ClientTools, Errors, Version } from "@hpcc-js/comms";
import { scopedLogger } from "@hpcc-js/util";
import { QuickPickItem, Uri, window, workspace } from "vscode";
import { kelStatusBar } from "./status";
import * as cp from "child_process";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as AdmZip from "adm-zip";

const logger = scopedLogger("kel/clientTools.ts");

class KelccErrors extends Errors {

    constructor(stdErr: string, checked: string[]) {
        super(checked);
        if (stdErr && stdErr.length) {
            for (const errLine of stdErr.split(os.EOL)) {
                // Windows Only  ---
                logger.debug("errLine:  " + errLine);
                let match = /((?:[a-zA-Z]:)?(?:\\[a-z  A-Z0-9_.-]+)+\.[a-zA-Z0-9]+):(\d+),(\d+):(.*) ([A-Z]\d+) - (.*)$/.exec(errLine);
                if (match) {
                    const [, filePath, row, _col, severity, code, _msg] = match;
                    const line: number = +row;
                    const col: number = +_col;
                    const msg = code + ":  " + _msg;
                    this.errWarn.push({ filePath, line, col, msg, severity });
                    continue;
                }
                match = /(error|warning|info): (.*)/i.exec(errLine);
                if (match) {
                    const [, severity, msg] = match;
                    this.errWarn.push({ filePath: "", line: 0, col: 0, msg, severity });
                    continue;
                }
                match = /\d error(s?), \d warning(s?)/.exec(errLine);
                if (match) {
                    continue;
                }
                logger.warning(`parseECLErrors:  Unable to parse "${errLine}"`);
                this.errOther.push(errLine);
            }
        }
        this._checked = checked;
    }
}

interface KelResponse {
    stdout: string;
    errors: KelccErrors;
}

class KELClientTools extends ClientTools {

    readonly kelPath: string;

    constructor(path: string, cwd?: string, includeFolders?: string[], legacyMode?: boolean, args?: string[], version?: Version) {
        super(path, cwd, includeFolders, legacyMode, args, version);
        this.kelPath = path;
    }

    fileFolder(uri: Uri): string {
        const filePath = uri.fsPath;
        return path.dirname(filePath);
    }

    genFolder(uri: Uri): string {
        const filePath = uri.fsPath;
        const kelConfig = workspace.getConfiguration("kel");
        if (kelConfig.get<string>("generateLocation") === "Child Folder") {
            const ext = path.extname(filePath);
            const folder = path.basename(filePath, ext);
            return path.join(this.fileFolder(uri), folder);
        }
        return path.join(path.dirname(filePath));
    }

    workspaceFolder(uri: Uri): string {
        return workspace.getWorkspaceFolder(uri).uri.fsPath;
    }

    extractLibs(uri: Uri) {
        const zip = new AdmZip(path.join(this.binPath, "KEL.zip"));
        const workspaceFolder = this.workspaceFolder(uri);
        zip.extractAllTo(workspaceFolder);
    }

    _fullVersion: Version;
    version(): Promise<Version> {
        if (this._fullVersion) {
            return Promise.resolve(this._fullVersion);
        }
        return this.spawnJava("", ["--version"]).then(response => {
            this._fullVersion = new Version(response.stdout);
            return this._fullVersion;
        });
    }

    versionSync(): Version {
        return this._fullVersion;
    }

    checkSyntax(filePath: string, args?: string[]): Promise<KelResponse> {
        const uri = Uri.file(filePath);
        const kelFolder = path.dirname(filePath);
        return this.spawnKel(kelFolder, workspace.getWorkspaceFolder(uri).uri.fsPath, uri.fsPath, this.args([
            "--syntaxcheck"
        ]));
    }

    generate(uri: Uri): Promise<KelResponse> {
        this.extractLibs(uri);
        const filePath = uri.fsPath;
        const fileFolder = path.dirname(filePath);
        const outFolder = this.genFolder(uri);
        return this.spawnKel(fileFolder, workspace.getWorkspaceFolder(uri).uri.fsPath, uri.fsPath, this.args([
            "--pack", "dir",
            "-o", outFolder
        ]));
    }

    private spawnKel(cwd: string, inFolder: string, inFile: string, args: string[]): Promise<KelResponse> {
        return this.spawnJava(cwd, ["-i", inFolder, inFile, ...args]);
    }

    private spawnJava(cwd: string, args: string[]): Promise<KelResponse> {
        const kelConfig = workspace.getConfiguration("kel");
        const javaArgs = kelConfig.get<string[]>("javaArgs");
        return this.spawnProc("java", cwd, this.args([
            ...javaArgs,
            "-jar", path.join(this.binPath, "KEL.jar"),
            ...args
        ]), "kel", `Cannot find ${this.kelPath}`).then(response => {
            const checked: string[] = [];
            logger.info(response.stdout);
            return {
                stdout: response.stdout,
                errors: new KelccErrors(response.stderr, checked)
            };
        });
    }

    private spawnProc(cmd: string, cwd: string, args: string[], _toolName: string, _notFoundError?: string): Promise<{ stdout: string, stderr: string }> {
        logger.debug(`cd "${cwd}"`);
        logger.debug(`${cmd} ${args.map(arg => `"${arg}"`).join(" ")}`);
        return new Promise<{ stdout: string, stderr: string }>((resolve, _reject) => {
            const child = cp.spawn(cmd, args, { cwd });
            let stdOut = "";
            let stdErr = "";
            child.stdout.on("data", (data) => {
                stdOut += data.toString();
            });
            child.stderr.on("data", (data) => {
                stdErr += data.toString();
            });
            child.on("error", e => {
                window.showErrorMessage(e.message);
            });
            child.on("close", (_code, _signal) => {
                resolve({
                    stdout: stdOut.trim(),
                    stderr: stdErr.trim()
                });
            });
        });
    }
}

function locateClientToolsInFolder(rootFolder: string, clientTools: KELClientTools[]) {
    if (rootFolder) {
        const hpccSystemsFolder = path.join(rootFolder, "HPCCSystems");
        if (fs.existsSync(hpccSystemsFolder) && fs.statSync(hpccSystemsFolder).isDirectory()) {
            if (os.type() !== "Windows_NT") {
                const kelPath = path.join(hpccSystemsFolder, "KEL", "KEL.jar");
                if (fs.existsSync(kelPath)) {
                    clientTools.push(new KELClientTools(kelPath));
                }
            }
            fs.readdirSync(hpccSystemsFolder).forEach((versionFolder) => {
                const kelPath = path.join(hpccSystemsFolder, versionFolder, "KEL", "KEL.jar");
                if (fs.existsSync(kelPath)) {
                    const name = path.basename(versionFolder);
                    const version = new Version(name);
                    if (version.exists()) {
                        clientTools.push(new KELClientTools(kelPath, undefined, undefined, undefined, undefined, version));
                    }
                }
            });
        }
    }
}

let allClientToolsCache: Promise<KELClientTools[]>;
function locateAllClientTools() {
    if (allClientToolsCache) return allClientToolsCache;
    const clientTools: KELClientTools[] = [];
    switch (os.type()) {
        case "Windows_NT":
            const rootFolder86 = process.env["ProgramFiles(x86)"] || "";
            if (rootFolder86) {
                locateClientToolsInFolder(rootFolder86, clientTools);
            }
            const rootFolder = process.env["ProgramFiles"] || "";
            if (rootFolder) {
                locateClientToolsInFolder(rootFolder, clientTools);
            }
            if (!rootFolder86 && !rootFolder) {
                locateClientToolsInFolder("c:\\Program Files (x86)", clientTools);
            }
            break;
        case "Linux":
        case "Darwin":
            locateClientToolsInFolder("/opt", clientTools);
            break;
        default:
            break;
    }

    allClientToolsCache = Promise.all(clientTools.map(ct => ct.version())).then(() => {
        clientTools.sort((l: ClientTools, r: ClientTools) => {
            return r.versionSync().compare(l.versionSync());
        });
        return clientTools;
    });
    return allClientToolsCache;
}

function showKelStatus(version: string, overriden: boolean, tooltip: string) {
    kelStatusBar.showKelStatus(`${overriden ? "*" : ""}${version}`, tooltip);
}

export function locateClientTools(): Promise<KELClientTools | undefined> {
    const kelConfig = workspace.getConfiguration("kel");
    const kelPath = kelConfig.get<string>("kelPath");
    if (kelPath) {
        return Promise.resolve(new KELClientTools(kelPath));
    } else {
        return locateAllClientTools().then(clientToolsArr => {
            if (clientToolsArr.length > 0) {
                const clientTools = clientToolsArr[0];
                let kelPathOverriden = false;
                if (clientTools) {
                    if (clientTools.kelPath === kelPath) {
                        kelPathOverriden = true;
                    }
                    clientTools.version().then(version => {
                        showKelStatus(`KEL_${version.major}.${version.minor}.${version.patch}`, kelPathOverriden, clientTools.kelPath);
                    });
                } else {
                    showKelStatus("Unknown", false, "Unable to locate eclcc");
                }
                return clientTools;
            }
        });
    }
}

interface SelectQP extends QuickPickItem {
    kelPath?: string;
}

export function selectCTVersion() {
    const input = window.createQuickPick<SelectQP>();
    input.placeholder = "Select eclcc version";
    locateAllClientTools().then(clientTools => {
        input.items = [{ label: "Auto Detect", kelPath: undefined }, ...clientTools.map(ct => {
            const version = ct.versionSync();
            return {
                label: `KEL_${version.major}.${version.minor}.${version.patch}${version.postfix ? "-" + version.postfix : ""}`,
                kelPath: ct.kelPath
            };
        })];
        input.onDidChangeSelection(items => {
            const item = items[0];
            if (item) {
                const eclConfig = workspace.getConfiguration("kel");
                eclConfig.update("kelPath", item.kelPath);
                showKelStatus(item.label, !!item.kelPath, !!item.kelPath ? item.kelPath : "");
            }
            input.hide();
        });
        input.show();
    });
}

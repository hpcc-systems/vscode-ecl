import { ClientTools, Errors, Version } from "@hpcc-js/comms";
import { scopedLogger } from "@hpcc-js/util";
import { Event, EventEmitter, QuickPickItem, Uri, window, workspace } from "vscode";
import { kelStatusBar } from "./status";
import * as cp from "child_process";
import * as path from "path";
import * as os from "os";
import AdmZip from "adm-zip";
import localize from "../util/localize";
import { exists, isDirectory, isTypeDirectory, readDirectory } from "../util/fs";

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
                // Generic form, e.g. "<none>:0,0:error K50001 - Unable to find version ..."
                match = /^(.+?):(\d+),(\d+):(error|warning|info)\s+([A-Z]\d+)\s*-\s*(.*)$/i.exec(errLine);
                if (match) {
                    const [, filePath, row, _col, severity, code, _msg] = match;
                    const line: number = +row;
                    const col: number = +_col;
                    const msg = code + ":  " + _msg;
                    this.errWarn.push({ filePath: filePath === "<none>" ? "" : filePath, line, col, msg, severity });
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

export type KelProcessOutputHandler = (stream: "stdout" | "stderr", text: string) => void;

export class KELClientTools extends ClientTools {

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
        const kelConfig = workspace.getConfiguration("kel", null);
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

    async extractLibs(uri: Uri): Promise<void> {
        const zipPath = path.join(this.binPath, "KEL.zip");
        const workspaceFolder = this.workspaceFolder(uri);
        logger.debug(`extract-libs: ${zipPath} -> ${workspaceFolder}`);
        if (!await exists(zipPath)) {
            logger.warning(`extract-libs-skipped: archive-not-found=${zipPath}, tool=${this.kelPath}`);
            return;
        }
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(workspaceFolder);
        logger.debug("extract-libs-complete");
    }

    _fullVersion: Version;
    version(): Promise<Version> {
        if (this._fullVersion) {
            return Promise.resolve(this._fullVersion);
        }
        logger.debug(`version-request: ${this.kelPath}`);
        return this.spawnJava("", ["--version"]).then(response => {
            this._fullVersion = new Version(response.stdout);
            logger.debug(`version-response: ${this._fullVersion.toString()}`);
            return this._fullVersion;
        });
    }

    versionSync(): Version {
        return this._fullVersion;
    }

    checkSyntax(filePath: string, args?: string[], onOutput?: KelProcessOutputHandler): Promise<KelResponse> {
        const uri = Uri.file(filePath);
        const kelFolder = path.dirname(filePath);
        logger.debug(`check-syntax: file=${filePath}, cwd=${kelFolder}`);
        return this.spawnKel(kelFolder, workspace.getWorkspaceFolder(uri).uri.fsPath, uri.fsPath, this.args([
            "--syntaxcheck"
        ]), onOutput);
    }

    async generate(uri: Uri, onOutput?: KelProcessOutputHandler): Promise<KelResponse> {
        logger.debug(`generate: file=${uri.fsPath}, tool=${this.kelPath}, bin=${this.binPath}`);
        await this.extractLibs(uri);
        const filePath = uri.fsPath;
        const fileFolder = path.dirname(filePath);
        const outFolder = this.genFolder(uri);
        logger.debug(`generate-paths: cwd=${fileFolder}, output=${outFolder}`);
        return this.spawnKel(fileFolder, workspace.getWorkspaceFolder(uri).uri.fsPath, uri.fsPath, this.args([
            "--pack", "dir",
            "-o", outFolder
        ]), onOutput);
    }

    private spawnKel(cwd: string, inFolder: string, inFile: string, args: string[], onOutput?: KelProcessOutputHandler): Promise<KelResponse> {
        return this.spawnJava(cwd, ["-i", inFolder, inFile, ...args], onOutput);
    }

    private spawnJava(cwd: string, args: string[], onOutput?: KelProcessOutputHandler): Promise<KelResponse> {
        const kelConfig = workspace.getConfiguration("kel", null);
        const javaArgs = kelConfig.get<string[]>("javaArgs");
        return this.spawnProc("java", cwd, this.args([
            ...javaArgs,
            "-jar", this.kelPath,
            ...args
        ]), "kel", `Cannot find ${this.kelPath}`, onOutput).then(response => {
            const checked: string[] = [];
            logger.info(`process-complete: tool=${this.kelPath}, stdout=${response.stdout.length} chars, stderr=${response.stderr.length} chars`);
            return {
                stdout: response.stdout,
                errors: new KelccErrors(response.stderr, checked)
            };
        });
    }

    private spawnProc(cmd: string, cwd: string, args: string[], _toolName: string, _notFoundError?: string, onOutput?: KelProcessOutputHandler): Promise<{ stdout: string, stderr: string }> {
        logger.debug(`cd "${cwd}"`);
        logger.info(`process-command: ${cmd} ${args.map(arg => `"${arg}"`).join(" ")}`);
        return new Promise<{ stdout: string, stderr: string }>((resolve, _reject) => {
            const child = cp.spawn(cmd, args, { cwd });
            let stdOut = "";
            let stdErr = "";
            child.stdout.on("data", (data) => {
                const text = data.toString();
                stdOut += text;
                const trimmedText = text.trim();
                if (trimmedText) {
                    logger.info(`process-stdout: ${trimmedText}`);
                    onOutput?.("stdout", trimmedText);
                }
            });
            child.stderr.on("data", (data) => {
                const text = data.toString();
                stdErr += text;
                const trimmedText = text.trim();
                if (trimmedText) {
                    logger.warning(`process-stderr: ${trimmedText}`);
                    onOutput?.("stderr", trimmedText);
                }
            });
            child.on("error", e => {
                logger.error(`process-error: ${cmd} ${e.message}`);
                window.showErrorMessage(e.message);
            });
            child.on("close", (code, signal) => {
                logger.debug(`process-close: code=${code}, signal=${signal || "none"}`);
                resolve({
                    stdout: stdOut.trim(),
                    stderr: stdErr.trim()
                });
            });
        });
    }
}

async function addClientTools(kelPath: string, clientTools: KELClientTools[], version?: Version) {
    if (await exists(kelPath) && !clientTools.some(ct => ct.kelPath === kelPath)) {
        clientTools.push(new KELClientTools(kelPath, undefined, undefined, undefined, undefined, version));
    }
}

async function locateClientToolsInFolder(rootFolder: string, clientTools: KELClientTools[]) {
    if (rootFolder) {
        const hpccSystemsFolder = path.join(rootFolder, "HPCCSystems");
        if (await exists(hpccSystemsFolder) && await isDirectory(hpccSystemsFolder)) {
            await addClientTools(path.join(hpccSystemsFolder, "KEL", "KEL.jar"), clientTools);
            for (const [versionFolder] of await readDirectory(hpccSystemsFolder)) {
                const kelPath = path.join(hpccSystemsFolder, versionFolder, "KEL", "KEL.jar");
                if (await exists(kelPath)) {
                    const name = path.basename(versionFolder);
                    const version = new Version(name);
                    if (version.exists()) {
                        await addClientTools(kelPath, clientTools, version);
                    }
                }
            }
        }
    }
}

export async function locateDevelopmentLauncherClientTools(clientTools: KELClientTools[]) {
    const kelTopFolders = new Set<string>();
    for (const folder of workspace.workspaceFolders || []) {
        const workspacePath = folder.uri.fsPath;
        const parentFolder = path.dirname(workspacePath);
        kelTopFolders.add(path.join(parentFolder, "Tardis", "kel-top"));
        kelTopFolders.add(path.join(parentFolder, "kel-top"));
    }
    kelTopFolders.add(path.join(os.homedir(), "git", "Tardis", "kel-top"));
    kelTopFolders.add(path.join(os.homedir(), "Tardis", "kel-top"));

    for (const kelTopFolder of kelTopFolders) {
        const launcherTargetFolder = path.join(kelTopFolder, "tools", "launcher", "target");
        if (!await exists(launcherTargetFolder) || !await isDirectory(launcherTargetFolder)) {
            continue;
        }
        for (const [fileName, type] of await readDirectory(launcherTargetFolder)) {
            if (isTypeDirectory(type) || fileName.startsWith("original-")) {
                continue;
            }
            const match = /^kel-launcher-(.+)\.jar$/i.exec(fileName);
            if (match) {
                await addClientTools(path.join(launcherTargetFolder, fileName), clientTools, new Version(match[1]));
            }
        }
    }
}

async function locateMavenClientTools(clientTools: KELClientTools[]) {
    const kelRepository = path.join(os.homedir(), ".m2", "repository", "com", "relx", "rba", "tardis", "kel");
    if (!await exists(kelRepository) || !await isDirectory(kelRepository)) {
        return;
    }
    for (const [versionFolder, type] of await readDirectory(kelRepository)) {
        if (!isTypeDirectory(type)) {
            continue;
        }
        const artifactFolder = path.join(kelRepository, versionFolder);
        const kelCliPath = path.join(artifactFolder, `kel-${versionFolder}-jar-with-dependencies.jar`);
        if (await exists(kelCliPath)) {
            const version = new Version(versionFolder);
            if (version.exists()) {
                const siblingKelPath = path.join(artifactFolder, "KEL.jar");
                const kelPath = await exists(siblingKelPath) ? siblingKelPath : kelCliPath;
                logger.debug(`locate-maven-tool: cli=${kelCliPath}, tool=${kelPath}`);
                await addClientTools(kelPath, clientTools, version);
            }
        }
    }
}

let allClientToolsCache: Promise<KELClientTools[]>;
export function clearAllClientToolsCache() {
    allClientToolsCache = undefined;
}

export async function locateAllClientTools(): Promise<KELClientTools[]> {
    if (allClientToolsCache) return allClientToolsCache;
    const clientTools: KELClientTools[] = [];
    switch (os.type()) {
        case "Windows_NT":
            const rootFolder86 = process.env["ProgramFiles(x86)"] || "";
            if (rootFolder86) {
                await locateClientToolsInFolder(rootFolder86, clientTools);
            }
            const rootFolder = process.env["ProgramFiles"] || "";
            if (rootFolder) {
                await locateClientToolsInFolder(rootFolder, clientTools);
            }
            if (!rootFolder86 && !rootFolder) {
                await locateClientToolsInFolder("c:\\Program Files (x86)", clientTools);
            }
            await locateMavenClientTools(clientTools);
            break;
        case "Linux":
        case "Darwin":
            await locateClientToolsInFolder("/opt", clientTools);
            await locateMavenClientTools(clientTools);
            await locateDevelopmentLauncherClientTools(clientTools);
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

export async function locateClientTools(): Promise<KELClientTools | undefined> {
    const kelConfig = workspace.getConfiguration("kel", null);
    const kelPath = kelConfig.get<string>("kelPath");
    if (kelPath && await exists(kelPath)) {
        return new KELClientTools(kelPath);
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
                    showKelStatus(localize("Unknown"), false, localize("Unable to locate eclcc"));
                }
                return clientTools;
            }
        });
    }
}

interface SelectQP extends QuickPickItem {
    ct?: KELClientTools;
}

const _onDidClientToolsChange: EventEmitter<void> = new EventEmitter<void>();
export const onDidClientToolsChange: Event<void> = _onDidClientToolsChange.event;

export async function switchClientTools(ct?: KELClientTools) {
    const kelPath = ct?.kelPath;
    const version = ct ? ct.versionSync() : undefined;
    const label = version ? `KEL_${version.major}.${version.minor}.${version.patch}${version.postfix ? "-" + version.postfix : ""}` : localize("Auto Detect");
    const kelConfig = workspace.getConfiguration("kel", null);
    await kelConfig.update("kelPath", kelPath);
    showKelStatus(label, !!kelPath, kelPath ? kelPath : "");
    _onDidClientToolsChange.fire();
}

export function selectCTVersion() {
    const input = window.createQuickPick<SelectQP>();
    input.placeholder = localize("Select KEL version");
    locateAllClientTools().then(clientTools => {
        input.items = [{ label: localize("Auto Detect"), ct: undefined }, ...clientTools.map(ct => {
            const version = ct.versionSync();
            return {
                label: `KEL_${version.major}.${version.minor}.${version.patch}${version.postfix ? "-" + version.postfix : ""}`,
                ct
            };
        })];
        input.onDidChangeSelection(items => {
            const item = items[0];
            if (item) {
                switchClientTools(item.ct);
            }
            input.hide();
        });
        input.show();
    });
}

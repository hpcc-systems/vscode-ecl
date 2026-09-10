import { describe, it, expect, beforeEach, vi } from "vitest";

const fileType = 1;
const directoryType = 2;
const directories = new Map<string, [string, number][]>();
const files = new Set<string>();

vi.mock("vscode", () => ({
    EventEmitter: class {
        event = vi.fn();
        fire = vi.fn();
    },
    Uri: {
        file: (fsPath: string) => ({ fsPath, path: fsPath })
    },
    window: {
        showErrorMessage: vi.fn()
    },
    workspace: {
        workspaceFolders: [
            { uri: { fsPath: "/work/vscode-ecl" } }
        ],
        getConfiguration: vi.fn(() => ({
            get: vi.fn(),
            update: vi.fn()
        }))
    }
}));

vi.mock("../src/kel/status", () => ({
    kelStatusBar: {
        showKelStatus: vi.fn()
    }
}));

vi.mock("../src/util/localize", () => ({
    default: (key: string) => key
}));

vi.mock("../src/util/fs", () => ({
    exists: vi.fn((fsPath: string) => Promise.resolve(files.has(fsPath) || directories.has(fsPath))),
    isDirectory: vi.fn((fsPath: string) => Promise.resolve(directories.has(fsPath))),
    isTypeDirectory: vi.fn((type: number) => type === directoryType),
    readDirectory: vi.fn((fsPath: string) => Promise.resolve(directories.get(fsPath) || []))
}));

describe("KEL client tools discovery", () => {
    beforeEach(() => {
        directories.clear();
        files.clear();
    });

    it("finds a built KEL launcher in a sibling Tardis checkout", async () => {
        const launcherTargetFolder = "/work/Tardis/kel-top/tools/launcher/target";
        const launcherJar = `${launcherTargetFolder}/kel-launcher-1.28.0-SNAPSHOT.jar`;
        files.add(launcherJar);
        files.add(`${launcherTargetFolder}/original-kel-launcher-1.28.0-SNAPSHOT.jar`);
        directories.set(launcherTargetFolder, [
            ["classes", directoryType],
            ["kel-launcher-1.28.0-SNAPSHOT.jar", fileType],
            ["original-kel-launcher-1.28.0-SNAPSHOT.jar", fileType]
        ]);

        const { locateDevelopmentLauncherClientTools } = await import("../src/kel/clientTools");
        const clientTools = [];

        await locateDevelopmentLauncherClientTools(clientTools);

        expect(clientTools.map(ct => ct.kelPath)).toEqual([launcherJar]);
    });
});
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExtensionContext, WebviewView } from "vscode";
import type { LaunchRequestArguments } from "../debugger/launchRequestArguments";
import type { Messages, State } from "../eclwatch/messages";
import type { ECLWatchPanelView } from "../ecl/eclWatchPanelView";
import { join } from "@hpcc-js/util";

vi.mock("vscode", () => ({
    window: { registerWebviewViewProvider: vi.fn() },
    commands: { registerCommand: vi.fn(), executeCommand: vi.fn() },
    Uri: { joinPath: vi.fn(() => "resource") }
}));
vi.mock("../hpccplatform/session", () => ({
    sessionManager: { onDidChangeSession: vi.fn() }
}));
vi.mock("../util/credentialManager", () => ({
    credentialManager: { getCredentials: vi.fn() }
}));
vi.mock("../hpccplatform/launchConfig", () => ({
    espUrl: ({ protocol, serverAddress, port, path }) => join(`${protocol}://${serverAddress}:${port}/`, path),
    logicalFileUrl: vi.fn(),
    wuDetailsUrl: vi.fn(),
    wuResultUrl: vi.fn()
}));

const launch: LaunchRequestArguments = {
    name: "test",
    type: "ecl",
    request: "launch",
    protocol: "http",
    serverAddress: "localhost",
    port: 8010,
    targetCluster: "thor",
    path: ""
};

describe("ECL Watch navigation", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    async function setup(beforeLoaded?: (provider: ECLWatchPanelView) => void) {
        const { ECLWatchPanelView } = await import("../ecl/eclWatchPanelView");
        const provider = ECLWatchPanelView.attach({
            extensionUri: "extension",
            subscriptions: []
        } as unknown as ExtensionContext);
        let receive: (message: Messages) => Promise<void>;
        let state: State | undefined;
        let ready = false;
        const postMessage = vi.fn(async (message: Messages) => {
            if (ready && message.command === "navigate") state = message.data;
            return ready;
        });
        const view = {
            onDidDispose: vi.fn(() => ({ dispose: vi.fn() })),
            show: vi.fn(),
            webview: {
                onDidReceiveMessage: vi.fn(callback => { receive = callback; }),
                asWebviewUri: vi.fn(() => "resource"),
                postMessage
            }
        } as unknown as WebviewView;
        provider.navigateToLogicalFile(launch, "test::first", "thor");
        provider.resolveWebviewView(view, {}, undefined);
        const loaded = async () => {
            ready = true;
            await receive({ command: "loaded" });
        };
        beforeLoaded?.(provider);
        await loaded();
        return {
            provider,
            state: () => state,
            loaded,
            reload() {
                ready = false;
                state = undefined;
            }
        };
    }

    it("navigates between logical files while the preview is loaded", async () => {
        const preview = await setup();
        expect(preview.state()?.logicalFile).toBe("test::first");
        for (const name of ["test::second", "test::third"]) {
            preview.provider.navigateToLogicalFile(launch, name, "thor");
            expect(preview.state()?.logicalFile).toBe(name);
        }
    });

    it("shows the latest selected file after the webview reloads", async () => {
        const preview = await setup();
        preview.reload();
        preview.provider.navigateToLogicalFile(launch, "test::second", "thor");
        preview.provider.navigateToLogicalFile(launch, "test::third", "thor");
        await preview.loaded();
        expect(preview.state()?.logicalFile).toBe("test::third");
    });

    it("restores the selected file when a hidden webview is recreated", async () => {
        const preview = await setup();
        preview.reload();
        await preview.loaded();
        expect(preview.state()?.logicalFile).toBe("test::first");
    });

    it("uses the latest selection when navigation happens before the first load", async () => {
        const preview = await setup(provider => {
            provider.navigateToLogicalFile(launch, "test::second", "thor");
        });
        expect(preview.state()?.logicalFile).toBe("test::second");
    });

    it("also restores workunit results after the webview reloads", async () => {
        const preview = await setup();
        preview.provider.navigateTo(launch, "W20261029-123456", "Result 1");
        preview.reload();
        await preview.loaded();
        expect(preview.state()).toMatchObject({
            wuid: "W20261029-123456",
            resultName: "Result 1",
            logicalFile: undefined
        });
    });

    it("preserves the configured server path for logical-file and workunit previews", async () => {
        const preview = await setup();
        const config = { ...launch, path: "/hpcc/proxy/" };
        preview.provider.navigateToLogicalFile(config, "test::second", "thor");
        expect(preview.state()?.baseUrl).toBe("http://localhost:8010/hpcc/proxy");
        preview.provider.navigateTo(config, "W20261029-123456", "Result 1");
        expect(preview.state()?.baseUrl).toBe("http://localhost:8010/hpcc/proxy");
    });
});

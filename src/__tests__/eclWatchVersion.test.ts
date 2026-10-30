import { beforeEach, describe, expect, it, vi } from "vitest";
import { LaunchConfig } from "../hpccplatform/launchConfig";
import { formatECLWatchURL, formatLogicalFileURL, formatMetricsURL, formatResultURL, formatResultsURL, formatWorkunitURL } from "../ecl/util";
import { sessionManager } from "../hpccplatform/session";

const { refresh, preference } = vi.hoisted(() => ({
    refresh: vi.fn(),
    preference: { value: "v5" }
}));

vi.mock("vscode", () => ({
    workspace: {
        getConfiguration: () => ({ get: () => preference.value })
    }
}));
vi.mock("@hpcc-js/comms", async importOriginal => ({
    ...await importOriginal<typeof import("@hpcc-js/comms")>(),
    Activity: { attach: () => ({ refresh }) }
}));
vi.mock("../ecl/clientTools", () => ({ showEclStatus: vi.fn() }));
vi.mock("../util/fs", () => ({ readFile: vi.fn() }));
vi.mock("../telemetry", () => ({ reporter: {} }));
vi.mock("../util/localize", () => ({ default: (key: string) => key }));
vi.mock("../hpccplatform/session", () => ({ sessionManager: { session: { fetchBuild: vi.fn() } } }));

describe("ECL Watch platform version", () => {
    const baseUrl = "http://localhost:8010/hpcc/";
    let config: LaunchConfig;

    beforeEach(() => {
        vi.restoreAllMocks();
        refresh.mockReset();
        vi.mocked(sessionManager.session.fetchBuild).mockReset();
        preference.value = "v5";
        config = new LaunchConfig("test");
        vi.spyOn(config, "checkCredentials").mockResolvedValue(undefined);
        vi.spyOn(config, "opts").mockReturnValue({ baseUrl });
        vi.spyOn(config, "espUrl", "get").mockReturnValue(baseUrl);
        vi.mocked(sessionManager.session.fetchBuild).mockImplementation(() => config.fetchBuild());
    });

    it.each([
        ["community_9.12.0-1", "stub.htm"],
        ["community_10.6.0-1", "stub.htm"],
        ["community_10.7.99-1", "stub.htm"],
        ["community_10.8.0-1", "stub.html"],
        ["community_10.8.1-1", "stub.html"],
        ["community_10.10.0-1", "stub.html"],
        ["community_11.0.0-1", "stub.html"]
    ])("uses %s to select %s for all v5 URLs", async (build, stub) => {
        refresh.mockResolvedValue({ Build: build });
        const prefix = `${baseUrl}esp/files/${stub}`;
        expect(await formatECLWatchURL(baseUrl)).toBe(`${prefix}?Widget=HPCCPlatformWidget`);
        expect(await formatWorkunitURL(baseUrl, "W1")).toBe(`${prefix}?Wuid=W1&Widget=WUDetailsWidget#/stub/Summary`);
        expect(await formatResultsURL(baseUrl, "W1")).toBe(`${prefix}?Wuid=W1&Widget=ResultsWidget#/stub/Grid`);
        expect(await formatMetricsURL(baseUrl, "W1")).toBe(`${prefix}?Wuid=W1&Widget=GraphsWUWidget#/stub/Grid`);
        expect(await formatResultURL(baseUrl, "W1", "Result1")).toBe(`${prefix}?Wuid=W1&Name=Result1&Widget=ResultWidget`);
        expect(await formatLogicalFileURL(baseUrl, "test::file", "thor")).toBe(`${prefix}?Widget=LFDetailsWidget&Name=test%3A%3Afile&NodeGroup=thor#/stub/Summary`);
    });

    it("keeps modern ECL Watch on index.html for older platforms", async () => {
        refresh.mockResolvedValue({ Build: "community_10.6.0-1" });
        preference.value = "v9";
        expect(await formatECLWatchURL(baseUrl)).toBe(`${baseUrl}esp/files/index.html#/activities`);
        expect(sessionManager.session.fetchBuild).not.toHaveBeenCalled();
    });

    it("waits for the build before resolving concurrent legacy URLs", async () => {
        let resolveBuild!: (activity: { Build: string }) => void;
        refresh.mockReturnValue(new Promise(resolve => { resolveBuild = resolve; }));
        const resolved = vi.fn();
        const urls = Promise.all([
            formatECLWatchURL(baseUrl),
            formatWorkunitURL(baseUrl, "W1")
        ]).then(resolved);

        await vi.waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
        expect(resolved).not.toHaveBeenCalled();
        resolveBuild({ Build: "community_10.6.0-1" });
        await urls;
        expect(resolved).toHaveBeenCalledWith([
            `${baseUrl}esp/files/stub.htm?Widget=HPCCPlatformWidget`,
            `${baseUrl}esp/files/stub.htm?Wuid=W1&Widget=WUDetailsWidget#/stub/Summary`
        ]);
    });

    it("falls back for a failed lookup and retries on the next request", async () => {
        refresh.mockRejectedValueOnce(new Error("unavailable"))
            .mockResolvedValueOnce({ Build: "community_10.6.0-1" });
        expect(await formatECLWatchURL(baseUrl)).toBe(`${baseUrl}esp/files/stub.html?Widget=HPCCPlatformWidget`);
        expect(await formatECLWatchURL(baseUrl)).toBe(`${baseUrl}esp/files/stub.htm?Widget=HPCCPlatformWidget`);
    });

    it("defaults to stub.html for an unknown build", async () => {
        refresh.mockResolvedValue({ Build: "" });
        expect(await formatECLWatchURL(baseUrl)).toBe(`${baseUrl}esp/files/stub.html?Widget=HPCCPlatformWidget`);
    });
});

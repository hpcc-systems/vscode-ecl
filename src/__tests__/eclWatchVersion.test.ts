import { beforeEach, describe, expect, it, vi } from "vitest";
import { LaunchConfig } from "../hpccplatform/launchConfig";
import { formatECLWatchURL, formatLogicalFileURL, formatMetricsURL, formatResultURL, formatResultsURL, formatWorkunitURL } from "../ecl/util";

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

describe("ECL Watch platform version", () => {
    const baseUrl = "http://localhost:8010/hpcc/";
    let config: LaunchConfig;

    beforeEach(() => {
        vi.restoreAllMocks();
        preference.value = "v5";
        config = new LaunchConfig("test");
        vi.spyOn(config, "checkCredentials").mockResolvedValue(undefined);
        vi.spyOn(config, "opts").mockReturnValue({ baseUrl });
        vi.spyOn(config, "espUrl", "get").mockReturnValue(baseUrl);
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
        expect(await config.fetchBuild()).toBe(build);
        const prefix = `${baseUrl}esp/files/${stub}`;
        expect(formatECLWatchURL(baseUrl)).toBe(prefix);
        expect(formatWorkunitURL(baseUrl, "W1")).toBe(`${prefix}?Wuid=W1&Widget=WUDetailsWidget#/stub/Summary`);
        expect(formatResultsURL(baseUrl, "W1")).toBe(`${prefix}?Wuid=W1&Widget=ResultsWidget#/stub/Grid`);
        expect(formatMetricsURL(baseUrl, "W1")).toBe(`${prefix}?Wuid=W1&Widget=GraphsWUWidget#/stub/Grid`);
        expect(formatResultURL(baseUrl, "W1", "Result1")).toBe(`${prefix}?Wuid=W1&Name=Result1&Widget=ResultWidget`);
        expect(formatLogicalFileURL(baseUrl, "test::file", "thor")).toBe(`${prefix}?Widget=LFDetailsWidget&Name=test%3A%3Afile&NodeGroup=thor#/stub/Summary`);
    });

    it("keeps modern ECL Watch on index.html for older platforms", async () => {
        refresh.mockResolvedValue({ Build: "community_10.6.0-1" });
        await config.fetchBuild();
        preference.value = "v9";
        expect(formatECLWatchURL(baseUrl)).toBe(`${baseUrl}esp/files/index.html`);
    });
});

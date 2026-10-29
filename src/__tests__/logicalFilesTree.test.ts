import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ExtensionContext } from "vscode";
import type { Item } from "../ecl/tree";

type CommandHandler = (item: Item) => Promise<void>;

const mocks = vi.hoisted(() => ({
    commands: new Map<string, CommandHandler>(),
    clipboard: vi.fn(),
    showErrorMessage: vi.fn(),
    openTextDocument: vi.fn(),
    showTextDocument: vi.fn(),
    session: {
        name: "test",
        launchRequestArgs: { serverAddress: "localhost" },
        fetchLogicalFileScope: vi.fn(),
        fetchLogicalFileDetail: vi.fn()
    }
}));

vi.mock("vscode", () => ({
    EventEmitter: class { event = vi.fn(); },
    window: {
        createTreeView: vi.fn(() => ({})),
        withProgress: vi.fn((_options, task) => task()),
        showErrorMessage: mocks.showErrorMessage,
        showTextDocument: mocks.showTextDocument
    },
    commands: {
        registerCommand: vi.fn((id, handler) => {
            mocks.commands.set(id, handler);
            return { dispose: vi.fn() };
        })
    },
    env: { clipboard: { writeText: mocks.clipboard } },
    workspace: { openTextDocument: mocks.openTextDocument }
}));
vi.mock("../hpccplatform/session", () => ({
    sessionManager: { session: mocks.session, onDidChangeSession: vi.fn() }
}));
vi.mock("../util/localize", () => ({ default: (key: string) => key }));
vi.mock("../ecl/eclWatchPanelView", () => ({ eclWatchPanelView: {} }));

import { LogicalFilesTree } from "../ecl/logicalFilesTree";

describe("logical-file copy commands", () => {
    let file: Item;
    beforeEach(async () => {
        vi.clearAllMocks();
        mocks.clipboard.mockResolvedValue(undefined);
        mocks.session.fetchLogicalFileScope.mockResolvedValue([{ Name: "scope::people" }]);
        const tree = LogicalFilesTree.attach({ subscriptions: [] } as unknown as ExtensionContext);
        [file] = await tree.scopeChildren("scope");
    });

    it("copies the fully qualified logical filename without fetching a record", async () => {
        await mocks.commands.get("hpccResources.logicalFiles.copyName")!(file);
        expect(mocks.clipboard).toHaveBeenCalledWith("scope::people");
        expect(mocks.session.fetchLogicalFileDetail).not.toHaveBeenCalled();
    });

    it("copies only the platform ECL record definition", async () => {
        const record = "RECORD\n  STRING name;\nEND;\n";
        mocks.session.fetchLogicalFileDetail.mockResolvedValue({ Ecl: record });
        await mocks.commands.get("hpccResources.logicalFiles.copyRecord")!(file);
        expect(mocks.session.fetchLogicalFileDetail).toHaveBeenCalledWith("scope::people");
        expect(mocks.clipboard).toHaveBeenCalledWith(record);
    });

    it("opens generated ECL using the same record-fetching operation", async () => {
        const record = "RECORD\n  STRING name;\nEND;\n";
        const document = { languageId: "ecl" };
        mocks.session.fetchLogicalFileDetail.mockResolvedValue({ Ecl: record });
        mocks.openTextDocument.mockResolvedValue(document);
        await mocks.commands.get("hpccResources.logicalFiles.openECL")!(file);
        expect(mocks.session.fetchLogicalFileDetail).toHaveBeenCalledWith("scope::people");
        expect(mocks.openTextDocument).toHaveBeenCalledWith({
            language: "ecl",
            content: expect.stringContaining(`Layout := ${record.trim()}`)
        });
        expect(mocks.showTextDocument).toHaveBeenCalledWith(document);
    });

    it.each([undefined, "", " \n "])("reports an unavailable record (%s) without changing the clipboard", async Ecl => {
        mocks.session.fetchLogicalFileDetail.mockResolvedValue({ Ecl });
        await mocks.commands.get("hpccResources.logicalFiles.copyRecord")!(file);
        expect(mocks.clipboard).not.toHaveBeenCalled();
        expect(mocks.showErrorMessage).toHaveBeenCalledWith("Record definition is not available for this logical file");
    });

    it("reports record-fetch failures without changing the clipboard", async () => {
        mocks.session.fetchLogicalFileDetail.mockRejectedValue(new Error("Connection failed"));
        await mocks.commands.get("hpccResources.logicalFiles.copyRecord")!(file);
        expect(mocks.clipboard).not.toHaveBeenCalled();
        expect(mocks.showErrorMessage).toHaveBeenCalledWith("Connection failed");
    });

    it.each(["copyName", "copyRecord"])("reports clipboard failures for %s", async command => {
        mocks.session.fetchLogicalFileDetail.mockResolvedValue({ Ecl: "RECORD STRING name; END;" });
        mocks.clipboard.mockRejectedValue(new Error("Clipboard unavailable"));
        await mocks.commands.get(`hpccResources.logicalFiles.${command}`)!(file);
        expect(mocks.showErrorMessage).toHaveBeenCalledWith("Clipboard unavailable");
    });
});

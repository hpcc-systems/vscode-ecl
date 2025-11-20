import { describe, it, expect, beforeEach, vi } from "vitest";
import * as vscode from "vscode";

// Mock the localize function
vi.mock("../util/localize", () => ({
    default: (key: string) => key
}));

describe("versionNotification", () => {
    let mockContext: any;
    let mockGlobalState: Map<string, any>;

    beforeEach(() => {
        mockGlobalState = new Map();
        mockContext = {
            extension: {
                packageJSON: {
                    version: "2.33.0"
                }
            },
            extensionUri: vscode.Uri.file("/mock/path"),
            globalState: {
                get: vi.fn((key: string) => mockGlobalState.get(key)),
                update: vi.fn((key: string, value: any) => {
                    mockGlobalState.set(key, value);
                    return Promise.resolve();
                })
            }
        };
    });

    it("should store the current version on first activation", async () => {
        const { checkForUpgrade } = await import("../util/versionNotification");

        await checkForUpgrade(mockContext);

        expect(mockContext.globalState.update).toHaveBeenCalledWith(
            "ecl.lastVersion",
            "2.33.0"
        );
    });

    it("should detect version upgrade", async () => {
        mockGlobalState.set("ecl.lastVersion", "2.32.0");

        const showInformationMessageSpy = vi.spyOn(vscode.window, "showInformationMessage")
            .mockResolvedValue(undefined as any);

        const { checkForUpgrade } = await import("../util/versionNotification");

        await checkForUpgrade(mockContext);

        expect(showInformationMessageSpy).toHaveBeenCalled();
        const call = showInformationMessageSpy.mock.calls[0];
        expect(call[0]).toContain("2.33.0");

        showInformationMessageSpy.mockRestore();
    });

    it("should not show notification when version hasn't changed", async () => {
        mockGlobalState.set("ecl.lastVersion", "2.33.0");

        const showInformationMessageSpy = vi.spyOn(vscode.window, "showInformationMessage")
            .mockResolvedValue(undefined as any);

        const { checkForUpgrade } = await import("../util/versionNotification");

        await checkForUpgrade(mockContext);

        expect(showInformationMessageSpy).not.toHaveBeenCalled();

        showInformationMessageSpy.mockRestore();
    });
});

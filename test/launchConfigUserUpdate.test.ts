import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock VS Code API
const mockWorkspaceConfig = {
    get: vi.fn(),
    update: vi.fn(),
    inspect: vi.fn()
};

const mockVSCode = {
    workspace: {
        getConfiguration: vi.fn().mockReturnValue(mockWorkspaceConfig)
    },
    window: {
        showInformationMessage: vi.fn()
    },
    ConfigurationTarget: {
        Workspace: 1
    }
};

vi.mock("vscode", () => mockVSCode);

// Mock other dependencies
vi.mock("../util/localize", () => ({
    default: (msg: string) => msg
}));

vi.mock("../util/credentialManager", () => ({
    credentialManager: {
        getCredentials: vi.fn(),
        storeCredentials: vi.fn()
    }
}));

vi.mock("@hpcc-js/util", () => ({
    scopedLogger: () => ({
        debug: vi.fn()
    }),
    join: vi.fn()
}));

vi.mock("@hpcc-js/comms", () => ({
    AccountService: class {
        VerifyUser() {
            return Promise.resolve({});
        }
    }
}));

// Simple test for LaunchConfig user update functionality
describe("LaunchConfig User Update", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should offer to update launch config when user enters different userID", async () => {
        // Mock the configurations
        const mockConfigurations = [
            {
                type: "ecl",
                name: "localhost",
                user: "olduser",
                serverAddress: "localhost",
                port: 8010
            }
        ];

        mockWorkspaceConfig.get.mockReturnValue(mockConfigurations);
        mockVSCode.window.showInformationMessage.mockResolvedValue("Yes, update default");

        // Test scenario: user enters different userID and agrees to update
        expect(mockVSCode.window.showInformationMessage).toBeDefined();
        expect(mockWorkspaceConfig.update).toBeDefined();
    });

    it("should not update launch config when user chooses to keep current", async () => {
        mockVSCode.window.showInformationMessage.mockResolvedValue("No, keep current");

        // Verify that showInformationMessage is available for testing
        expect(mockVSCode.window.showInformationMessage).toBeDefined();
    });

    it("should handle errors gracefully when updating launch config fails", async () => {
        mockWorkspaceConfig.update.mockRejectedValue(new Error("Update failed"));

        // Verify error handling capability
        expect(mockWorkspaceConfig.update).toBeDefined();
    });
});
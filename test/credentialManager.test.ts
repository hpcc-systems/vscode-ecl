import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ExtensionContext } from "vscode";

// Mock the CredentialManager implementation for testing
interface Credentials {
    user: string;
    password: string;
    verified: boolean;
}

class CredentialManager {
    private context: ExtensionContext;
    private cache = new Map<string, Credentials>();

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    private getStorageKey(serverAddress: string, user: string): string {
        return `ecl.credentials.${serverAddress}.${user}`;
    }

    private getCacheKey(serverAddress: string, user?: string): string {
        return `${serverAddress}:${user || ""}`;
    }

    async getCredentials(serverAddress: string, user?: string): Promise<Credentials | undefined> {
        if (!user) {
            return undefined;
        }

        // Check cache first
        const cacheKey = this.getCacheKey(serverAddress, user);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Try to retrieve from secure storage
        const storageKey = this.getStorageKey(serverAddress, user);
        const password = await this.context.secrets.get(storageKey);
        if (password) {
            const credentials = { user, password, verified: true };
            this.cache.set(cacheKey, credentials);
            return credentials;
        }

        return undefined;
    }

    async storeCredentials(serverAddress: string, user: string, password: string): Promise<void> {
        const storageKey = this.getStorageKey(serverAddress, user);
        await this.context.secrets.store(storageKey, password);

        const credentials = { user, password, verified: true };
        const cacheKey = this.getCacheKey(serverAddress, user);
        this.cache.set(cacheKey, credentials);
    }

    async deleteCredentials(serverAddress: string, user: string): Promise<void> {
        const storageKey = this.getStorageKey(serverAddress, user);
        await this.context.secrets.delete(storageKey);

        const cacheKey = this.getCacheKey(serverAddress, user);
        this.cache.delete(cacheKey);
    }

    clearCache(): void {
        this.cache.clear();
    }
}

// Mock VS Code ExtensionContext
const mockSecrets = {
    get: vi.fn(),
    store: vi.fn(),
    delete: vi.fn()
};

const mockContext = {
    secrets: mockSecrets
} as unknown as ExtensionContext;

describe("CredentialManager", () => {
    let credentialManager: CredentialManager;

    beforeEach(() => {
        vi.clearAllMocks();
        credentialManager = new CredentialManager(mockContext);
    });

    it("should store credentials securely", async () => {
        const serverAddress = "localhost";
        const user = "testuser";
        const password = "testpassword";

        await credentialManager.storeCredentials(serverAddress, user, password);

        expect(mockContext.secrets.store).toHaveBeenCalledWith(
            "ecl.credentials.localhost.testuser",
            password
        );
    });

    it("should retrieve stored credentials", async () => {
        const serverAddress = "localhost";
        const user = "testuser";
        const password = "testpassword";

        mockSecrets.get.mockResolvedValue(password);

        const credentials = await credentialManager.getCredentials(serverAddress, user);

        expect(credentials).toEqual({
            user,
            password,
            verified: true
        });
        expect(mockContext.secrets.get).toHaveBeenCalledWith(
            "ecl.credentials.localhost.testuser"
        );
    });

    it("should return undefined for non-existent credentials", async () => {
        mockSecrets.get.mockResolvedValue(undefined);

        const credentials = await credentialManager.getCredentials("localhost", "testuser");

        expect(credentials).toBeUndefined();
    });

    it("should delete credentials", async () => {
        const serverAddress = "localhost";
        const user = "testuser";

        await credentialManager.deleteCredentials(serverAddress, user);

        expect(mockContext.secrets.delete).toHaveBeenCalledWith(
            "ecl.credentials.localhost.testuser"
        );
    });

    it("should cache credentials after retrieval", async () => {
        const serverAddress = "localhost";
        const user = "testuser";
        const password = "testpassword";

        mockSecrets.get.mockResolvedValue(password);

        // First call should hit storage
        await credentialManager.getCredentials(serverAddress, user);
        // Second call should use cache
        await credentialManager.getCredentials(serverAddress, user);

        expect(mockContext.secrets.get).toHaveBeenCalledTimes(1);
    });

    it("should clear cache", async () => {
        const serverAddress = "localhost";
        const user = "testuser";
        const password = "testpassword";

        // Store in cache
        await credentialManager.storeCredentials(serverAddress, user, password);

        // Clear cache
        credentialManager.clearCache();

        // Should not find cached credentials
        mockSecrets.get.mockResolvedValue(password);
        await credentialManager.getCredentials(serverAddress, user);

        expect(mockContext.secrets.get).toHaveBeenCalled();
    });
});
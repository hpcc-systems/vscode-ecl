import { describe, it, expect, beforeEach, vi } from "vitest";
import * as vscode from "vscode";
import { loadStore } from "../src/ecl/docs/SimilarityModel";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

// Mock vscode module
vi.mock("vscode", () => ({
    workspace: {
        fs: {
            readFile: vi.fn()
        }
    },
    Uri: {
        file: (path: string) => ({ fsPath: path, path })
    }
}));

// Mock @hpcc-js/wasm-llama
vi.mock("@hpcc-js/wasm-llama", () => ({
    Llama: {
        load: vi.fn(() => Promise.resolve({
            embedding: vi.fn((text: string, modelData: Uint8Array) => {
                // Return mock embeddings based on text length
                return [[text.length / 100, (text.length * 2) / 100, (text.length * 3) / 100]];
            })
        })),
        unload: vi.fn()
    }
}));

// Mock @hpcc-js/wasm-zstd
vi.mock("@hpcc-js/wasm-zstd", () => ({
    Zstd: {
        load: vi.fn(() => Promise.resolve({
            decompress: vi.fn((data: Uint8Array) => {
                // Mock decompression - just return a stringified JSON
                const mockData = {
                    vectors: [
                        {
                            content: "test document 1",
                            embedding: [0.1, 0.2, 0.3],
                            metadata: { source: "doc1" }
                        },
                        {
                            content: "test document 2",
                            embedding: [0.4, 0.5, 0.6],
                            metadata: { source: "doc2" }
                        }
                    ]
                };
                const jsonStr = JSON.stringify(mockData);
                return new TextEncoder().encode(jsonStr);
            })
        }))
    }
}));

describe("SimilarityModel loadStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load and return a MemoryVectorStore instance", async () => {
        // Mock file reading
        const mockModelData = new Uint8Array([1, 2, 3, 4]);
        const mockDocsData = new Uint8Array([5, 6, 7, 8]);

        vi.mocked(vscode.workspace.fs.readFile)
            .mockResolvedValueOnce(mockModelData)
            .mockResolvedValueOnce(mockDocsData);

        const modelPath = Promise.resolve(vscode.Uri.file("/path/to/model.bin"));
        const docsPath = vscode.Uri.file("/path/to/docs.vecdb");

        const store = await loadStore(modelPath, docsPath);

        expect(store).toBeDefined();
        expect(store).toBeInstanceOf(MemoryVectorStore);
    });

    it("should read the model and docs files", async () => {
        const mockModelData = new Uint8Array([1, 2, 3, 4]);
        const mockDocsData = new Uint8Array([5, 6, 7, 8]);

        vi.mocked(vscode.workspace.fs.readFile)
            .mockResolvedValueOnce(mockModelData)
            .mockResolvedValueOnce(mockDocsData);

        const modelPath = Promise.resolve(vscode.Uri.file("/path/to/model.bin"));
        const docsPath = vscode.Uri.file("/path/to/docs.vecdb");

        await loadStore(modelPath, docsPath);

        expect(vscode.workspace.fs.readFile).toHaveBeenCalledTimes(2);
    });

    it("should decompress the docs file using Zstd", async () => {
        const { Zstd } = await import("@hpcc-js/wasm-zstd");

        const mockModelData = new Uint8Array([1, 2, 3, 4]);
        const mockDocsData = new Uint8Array([5, 6, 7, 8]);

        vi.mocked(vscode.workspace.fs.readFile)
            .mockResolvedValueOnce(mockModelData)
            .mockResolvedValueOnce(mockDocsData);

        const modelPath = Promise.resolve(vscode.Uri.file("/path/to/model.bin"));
        const docsPath = vscode.Uri.file("/path/to/docs.vecdb");

        await loadStore(modelPath, docsPath);

        expect(Zstd.load).toHaveBeenCalled();
    });

    it("should populate memoryVectors with decompressed data", async () => {
        const mockModelData = new Uint8Array([1, 2, 3, 4]);
        const mockDocsData = new Uint8Array([5, 6, 7, 8]);

        vi.mocked(vscode.workspace.fs.readFile)
            .mockResolvedValueOnce(mockModelData)
            .mockResolvedValueOnce(mockDocsData);

        const modelPath = Promise.resolve(vscode.Uri.file("/path/to/model.bin"));
        const docsPath = vscode.Uri.file("/path/to/docs.vecdb");

        const store = await loadStore(modelPath, docsPath);

        expect(store.memoryVectors).toBeDefined();
        expect(Array.isArray(store.memoryVectors)).toBe(true);
        expect(store.memoryVectors.length).toBe(2);
    });

    it("should return a store with the correct vector data structure", async () => {
        const mockModelData = new Uint8Array([1, 2, 3, 4]);
        const mockDocsData = new Uint8Array([5, 6, 7, 8]);

        vi.mocked(vscode.workspace.fs.readFile)
            .mockResolvedValueOnce(mockModelData)
            .mockResolvedValueOnce(mockDocsData);

        const modelPath = Promise.resolve(vscode.Uri.file("/path/to/model.bin"));
        const docsPath = vscode.Uri.file("/path/to/docs.vecdb");

        const store = await loadStore(modelPath, docsPath);

        expect(store.memoryVectors.length).toBe(2);
        expect(store.memoryVectors[0]).toHaveProperty("content");
        expect(store.memoryVectors[0]).toHaveProperty("embedding");
        expect(store.memoryVectors[0]).toHaveProperty("metadata");
    });

    it("should handle errors when model file cannot be read", async () => {
        vi.mocked(vscode.workspace.fs.readFile)
            .mockRejectedValueOnce(new Error("Model file not found"));

        const modelPath = Promise.resolve(vscode.Uri.file("/invalid/model.bin"));
        const docsPath = vscode.Uri.file("/path/to/docs.vecdb");

        await expect(loadStore(modelPath, docsPath)).rejects.toThrow("Model file not found");
    });

    it("should handle errors when docs file cannot be read", async () => {
        vi.mocked(vscode.workspace.fs.readFile)
            .mockRejectedValueOnce(new Error("Docs file not found"));

        const modelPath = Promise.resolve(vscode.Uri.file("/path/to/model.bin"));
        const docsPath = vscode.Uri.file("/invalid/docs.vecdb");

        await expect(loadStore(modelPath, docsPath)).rejects.toThrow("Docs file not found");
    });

    it("should handle invalid JSON in decompressed data", async () => {
        const { Zstd } = await import("@hpcc-js/wasm-zstd");

        // Mock Zstd to return invalid JSON
        vi.mocked(Zstd.load).mockResolvedValueOnce({
            decompress: vi.fn(() => new TextEncoder().encode("invalid json"))
        } as any);

        const mockModelData = new Uint8Array([1, 2, 3, 4]);
        const mockDocsData = new Uint8Array([5, 6, 7, 8]);

        vi.mocked(vscode.workspace.fs.readFile)
            .mockResolvedValueOnce(mockModelData)
            .mockResolvedValueOnce(mockDocsData);

        const modelPath = Promise.resolve(vscode.Uri.file("/path/to/model.bin"));
        const docsPath = vscode.Uri.file("/path/to/docs.vecdb");

        await expect(loadStore(modelPath, docsPath)).rejects.toThrow();
    });
});

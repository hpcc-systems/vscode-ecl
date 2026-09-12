import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Result, XSDSchema, XSDXMLNode } from "@hpcc-js/comms";

vi.mock("@hpcc-js/dgrid", () => ({
    Deferred: class {
        private readonly promise: Promise<unknown>;
        resolve!: (value: unknown) => void;
        reject!: (reason?: unknown) => void;

        constructor() {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        }

        then(onFulfilled: (value: unknown) => unknown) {
            return this.promise.then(onFulfilled);
        }
    },
    QueryResults: (promise: Promise<unknown>) => promise,
    RowFormatter: class {
        format(row: Record<string, unknown>) {
            return { ...row };
        }
    },
    domConstruct: {
        create: (tagName: string, _attributes: unknown, parent?: HTMLElement) => {
            const element = document.createElement(tagName);
            parent?.appendChild(element);
            return element;
        }
    }
}));

import { Store } from "../src/eclwatch/WUResultStore";

function schemaWithLeaf(): XSDSchema {
    const leaf = {
        name: "value",
        attrs: {},
        isSet: false,
        children: () => [],
        charWidth: () => 10
    } as unknown as XSDXMLNode;
    return {
        root: {
            children: () => [leaf]
        }
    } as unknown as XSDSchema;
}

describe("WUResultStore", () => {
    beforeEach(() => {
        document.body.replaceChildren();
    });

    it("renders row layout markup without interpreting result markup", () => {
        const result = { Total: 0 } as Result;
        const store = new Store(result, schemaWithLeaf(), false);
        const column = store.columns()[0];
        const container = document.createElement("div");

        column.renderCell?.call(column, {} as never, "&lt;img src=x onerror=alert(1)&gt;", container);
        expect(container.querySelector("img")).toBeNull();
        expect(container.textContent).toBe("<img src=x onerror=alert(1)>");

        column.renderCell?.call(column, {} as never, "first<br><hr class='dgrid-fakeline'>second", container);
        expect(container.querySelectorAll(".dgrid-fakeline")).toHaveLength(1);
    });

    it("renders nested rows as text without creating injected elements", () => {
        const result = { Total: 0 } as Result;
        const store = new Store(result, schemaWithLeaf(), false);
        const container = document.createElement("div");

        store.rowToTable([{ value: "<img src=x>" }, { value: "second" }], undefined, container);

        expect(container.querySelector("img")).toBeNull();
        expect(container.textContent).toContain("<img src=x>");
        expect(container.textContent).toContain("second");
        expect(container.querySelectorAll("tr")).toHaveLength(3);
    });

    it("retries a range after a transient fetch failure", async () => {
        const fetchRows = vi.fn()
            .mockRejectedValueOnce(new Error("temporary failure"))
            .mockResolvedValueOnce([{ value: "ok" }]);
        const result = { Total: 1, fetchRows } as unknown as Result;
        const store = new Store(result, schemaWithLeaf(), false);

        await expect(store._request(0, 1)).rejects.toThrow("temporary failure");
        await expect(store._request(0, 1)).resolves.toMatchObject({
            totalLength: 1,
            data: [{ value: "ok", __hpcc_id: 0 }]
        });
        expect(fetchRows).toHaveBeenCalledTimes(2);
    });
});
import * as vscode from "vscode";
import { TelemetryReporter } from "@vscode/extension-telemetry";

type Props = Record<string, string> | undefined;
type Measures = Record<string, number> | undefined;

class MyTelemetryReporter extends TelemetryReporter {

    constructor(guid: string) {
        super(guid);
    }

    dispose(): Promise<any> {
        try {
            this.sendTelemetryEvent("MyTelemetryReporter.dispose");
        } catch { /* ignore */ }
        return super.dispose();
    }
}

// telemetry reporter
export let reporter: TelemetryReporter;

export function activate(context: vscode.ExtensionContext) {
    const extPackageJSON = context.extension?.packageJSON;
    reporter = new MyTelemetryReporter("b785b2bb-e170-421b-8bd8-baaf895fe88b");
    context.subscriptions.push(reporter);

    logEvent("activate", {
        extensionVersion: extPackageJSON?.version ?? "",
        vscodeVersion: vscode.version ?? "",
        platform: process?.platform ?? "",
    });
}

export function deactivate(): void {
    logEvent("deactivate");
    try {
        reporter?.dispose();
    } catch { /* ignore */ }
}

//  Safe helpers (never throw)  ----------------------------------------------

export function logEvent(name: string, props?: Props, measurements?: Measures): void {
    try {
        reporter?.sendTelemetryEvent(name, props, measurements);
    } catch { /* ignore */ }
}

export function logError(name: string, error?: any, props?: Props, measurements?: Measures): void {
    try {
        const merged: Record<string, string> = { ...(props ?? {}) };
        if (error) {
            if (error.message !== undefined) merged.message = String(error.message);
            if (error.code !== undefined) merged.code = String(error.code);
            if (error.name !== undefined) merged.errorName = String(error.name);
        }
        reporter?.sendTelemetryErrorEvent(name, merged, measurements);
    } catch { /* ignore */ }
}

/**
 * Start a timer. Call the returned function when done to emit a `<name>.duration`
 * measurement on a telemetry event.  Optionally pass extra props/measures.
 */
export function time(name: string): (extraProps?: Props, extraMeasures?: Measures) => void {
    const start = Date.now();
    return (extraProps?: Props, extraMeasures?: Measures) => {
        const duration = Date.now() - start;
        logEvent(name, extraProps, { duration, ...(extraMeasures ?? {}) });
    };
}

/**
 * Wraps `vscode.commands.registerCommand` so that every invocation of the
 * registered command emits a telemetry event including its duration and
 * automatically reports any thrown errors.
 */
export function registerCommand(
    ctx: vscode.ExtensionContext,
    id: string,
    handler: (...args: any[]) => any,
    thisArg?: any
): vscode.Disposable {
    const wrapped = (...args: any[]) => {
        const start = Date.now();
        logEvent("command", { id });
        try {
            const result = handler.apply(thisArg, args);
            if (result && typeof result.then === "function") {
                return Promise.resolve(result).then(
                    value => {
                        logEvent("command.success", { id }, { duration: Date.now() - start });
                        return value;
                    },
                    err => {
                        logError("command.error", err, { id }, { duration: Date.now() - start });
                        throw err;
                    }
                );
            }
            logEvent("command.success", { id }, { duration: Date.now() - start });
            return result;
        } catch (err) {
            logError("command.error", err, { id }, { duration: Date.now() - start });
            throw err;
        }
    };
    const disposable = vscode.commands.registerCommand(id, wrapped);
    ctx.subscriptions.push(disposable);
    return disposable;
}

/**
 * Same as `registerCommand` but for text editor commands.
 */
export function registerTextEditorCommand(
    ctx: vscode.ExtensionContext,
    id: string,
    handler: (editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => any,
    thisArg?: any
): vscode.Disposable {
    const wrapped = (editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => {
        const start = Date.now();
        logEvent("command", { id, kind: "textEditor" });
        try {
            const result = handler.apply(thisArg, [editor, edit, ...args]);
            if (result && typeof result.then === "function") {
                return Promise.resolve(result).then(
                    value => {
                        logEvent("command.success", { id, kind: "textEditor" }, { duration: Date.now() - start });
                        return value;
                    },
                    err => {
                        logError("command.error", err, { id, kind: "textEditor" }, { duration: Date.now() - start });
                        throw err;
                    }
                );
            }
            logEvent("command.success", { id, kind: "textEditor" }, { duration: Date.now() - start });
            return result;
        } catch (err) {
            logError("command.error", err, { id, kind: "textEditor" }, { duration: Date.now() - start });
            throw err;
        }
    };
    const disposable = vscode.commands.registerTextEditorCommand(id, wrapped);
    ctx.subscriptions.push(disposable);
    return disposable;
}

/**
 * Records a feature/module activation including a duration measurement.
 */
export function logActivation(name: string, fn: () => void): void {
    const end = time(`activation.${name}`);
    try {
        fn();
        end();
    } catch (err) {
        end();
        logError(`activation.${name}.error`, err);
        throw err;
    }
}

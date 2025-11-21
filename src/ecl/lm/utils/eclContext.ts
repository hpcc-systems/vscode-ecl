import * as vscode from "vscode";

/**
 * Determines if the user is currently working in an ECL context
 */
export function isECLContext(): boolean {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
        return false;
    }

    // Check if active document is ECL-related
    const doc = activeEditor.document;
    const isECLLanguage = doc.languageId === "ecl" || doc.languageId === "kel";
    const isECLFile = doc.fileName.match(/\.(ecl|kel|mod|ecllib|eclnb)$/i);

    // Check visible editors for ECL content
    const hasECLVisible = vscode.window.visibleTextEditors.some(editor => {
        const editorDoc = editor.document;
        return editorDoc.languageId === "ecl" ||
            editorDoc.languageId === "kel" ||
            editorDoc.fileName.match(/\.(ecl|kel|mod|ecllib|eclnb)$/i);
    });

    // Check if viewing HPCC Platform output or workunit
    const isHPCCOutput = doc.uri.scheme === "hpcc" ||
        doc.uri.scheme === "wu" ||
        doc.fileName.includes("workunit") ||
        doc.fileName.includes("HPCC");

    return !!(isECLLanguage || isECLFile || hasECLVisible || isHPCCOutput);
}

/**
 * Gets contextual information about the current ECL environment
 */
export function getECLContextInfo(): {
    isECLContext: boolean;
    activeLanguage?: string;
    activeFileName?: string;
    hasECLFiles: boolean;
    isConnected: boolean;
} {
    const isECL = isECLContext();
    const activeEditor = vscode.window.activeTextEditor;

    return {
        isECLContext: isECL,
        activeLanguage: activeEditor?.document.languageId,
        activeFileName: activeEditor?.document.fileName,
        hasECLFiles: vscode.workspace.textDocuments.some(doc =>
            doc.languageId === "ecl" || doc.languageId === "kel"
        ),
        isConnected: !!vscode.workspace.getConfiguration("ecl").get("connected")
    };
}

/**
 * Creates a context-aware invocation message
 */
export function createECLContextMessage(toolName: string, baseMessage: string): string {
    if (isECLContext()) {
        return `${baseMessage} (ECL context detected)`;
    }
    return baseMessage;
}

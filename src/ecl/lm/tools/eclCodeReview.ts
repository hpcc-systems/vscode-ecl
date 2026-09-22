import * as vscode from "vscode";
import localize from "../../../util/localize";
import { reporter } from "../../../telemetry";
import { reviewECL } from "../review";

export interface IECLCodeReviewParameters {
    ecl: string;
}

export class ECLCodeReviewTool implements vscode.LanguageModelTool<IECLCodeReviewParameters> {
    async invoke(options: vscode.LanguageModelToolInvocationOptions<IECLCodeReviewParameters>, token: vscode.CancellationToken) {
        reporter?.sendTelemetryEvent("lmTool.invoke", { tool: "eclCodeReview" });
        const source = typeof options.input.ecl === "string" ? options.input.ecl.trim() : "";
        if (!source) {
            throw new vscode.LanguageModelError(localize("ECL code is required"), { cause: "invalid_parameters" });
        }
        if (token.isCancellationRequested) {
            throw new vscode.CancellationError();
        }

        const findings = reviewECL(source);
        const status = findings.some(finding => finding.severity === "high") ? "changes_required" : "pass";
        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(JSON.stringify({
                status,
                findingCount: findings.length,
                findings,
            }, null, 2))
        ]);
    }

    async prepareInvocation() {
        return {
            invocationMessage: localize("Reviewing ECL code"),
        };
    }
}


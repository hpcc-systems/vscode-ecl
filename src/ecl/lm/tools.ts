import * as vscode from "vscode";
import { FindLogicalFilesTool } from "./findLogicalFiles";
import { FindWorkunitsTool } from "./findWorkunits";
import { GetLogicalFileInfoTool } from "./getLogicalFileInfo";
import { GetTargetClustersTool } from "./getTargetClusters";
import { GetWorkunitDetailsTool } from "./getWorkunitDetails";
import { GetWorkunitDiagnosticsTool } from "./getWorkunitDiagnostics";
import { GetWorkunitECLTool } from "./getWorkunitECL";
import { GetWorkunitResultsTool } from "./getWorkunitResults";
import { GetWorkunitTimingsTool } from "./getWorkunitTimings";
import { SubmitECLTool } from "./submitECL";
import { SyntaxCheckTool } from "./syntaxCheck";

let eclLMTools: ECLLMTools;

export class ECLLMTools {

    protected constructor(ctx: vscode.ExtensionContext) {
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_findWorkunits", new FindWorkunitsTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_getWorkunitDetails", new GetWorkunitDetailsTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_syntaxCheck", new SyntaxCheckTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_findLogicalFiles", new FindLogicalFilesTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_getLogicalFileInfo", new GetLogicalFileInfoTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_getWorkunitDiagnostics", new GetWorkunitDiagnosticsTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_getWorkunitECL", new GetWorkunitECLTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_getWorkunitResults", new GetWorkunitResultsTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_getWorkunitTimings", new GetWorkunitTimingsTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_getTargetClusters", new GetTargetClustersTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_submitECL", new SubmitECLTool()));
    }

    static attach(ctx: vscode.ExtensionContext): ECLLMTools {
        if (!eclLMTools) {
            eclLMTools = new ECLLMTools(ctx);
        }
        return eclLMTools;
    }
}

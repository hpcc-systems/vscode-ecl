import * as vscode from "vscode";
import { ECLDocsTool } from "./tools/eclDocs";
import { FindLogicalFilesTool } from "./tools/findLogicalFiles";
import { FindWorkunitsTool } from "./tools/findWorkunits";
import { GetLogicalFileInfoTool } from "./tools/getLogicalFileInfo";
import { GetTargetClustersTool } from "./tools/getTargetClusters";
import { GetWorkunitDetailsTool } from "./tools/getWorkunitDetails";
import { GetWorkunitDiagnosticsTool } from "./tools/getWorkunitDiagnostics";
import { GetWorkunitECLTool } from "./tools/getWorkunitECL";
import { GetWorkunitResultsTool } from "./tools/getWorkunitResults";
import { GetWorkunitTimingsTool } from "./tools/getWorkunitTimings";
import { SubmitECLTool } from "./tools/submitECL";
import { SyntaxCheckTool } from "./tools/syntaxCheck";

let eclLMTools: ECLLMTools;

export class ECLLMTools {

    protected constructor(ctx: vscode.ExtensionContext) {
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_eclDocs", new ECLDocsTool(ctx)));
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

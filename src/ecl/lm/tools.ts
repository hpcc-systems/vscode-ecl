import * as vscode from "vscode";
import { FindWorkunitsTool } from "./tools/findWorkunits";
import { GetWorkunitErrorsTool } from "./tools/getWorkunitErrors";
import { GetWorkunitECLTool } from "./tools/getWorkunitECL";
import { GetWorkunitMetricsTool } from "./tools/getWorkunitMetrics";
import { FindLogicalFilesTool } from "./tools/findLogicalFiles";
import { SyntaxCheckTool } from "./tools/syntaxCheck";

let eclLMTools: ECLLMTools;

export class ECLLMTools {

    protected constructor(ctx: vscode.ExtensionContext) {
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension-findWorkunits", new FindWorkunitsTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension-getWorkunitErrors", new GetWorkunitErrorsTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension-getWorkunitECL", new GetWorkunitECLTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension-getWorkunitMetrics", new GetWorkunitMetricsTool()));

        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension-findLogicalFiles", new FindLogicalFilesTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension-syntaxCheck", new SyntaxCheckTool()));
    }

    static attach(ctx: vscode.ExtensionContext): ECLLMTools {
        if (!eclLMTools) {
            eclLMTools = new ECLLMTools(ctx);
        }
        return eclLMTools;
    }
}

import * as vscode from "vscode";
import { FindWorkunitsTool } from "./tools/findWorkunits";
import { FindLogicalFilesTool } from "./tools/findLogicalFiles";
import { SyntaxCheckTool } from "./tools/syntaxCheck";

let eclLMTools: ECLLMTools;

export class ECLLMTools {

    protected constructor(ctx: vscode.ExtensionContext) {
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension-findWorkunits", new FindWorkunitsTool()));
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

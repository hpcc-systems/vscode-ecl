import * as vscode from "vscode";
import { FindLogicalFilesTool } from "./tools/findLogicalFiles";
import { SyntaxCheckTool } from "./tools/syntaxCheck";

let eclLMTools: ECLLMTools;

export class ECLLMTools {

    protected constructor(ctx: vscode.ExtensionContext) {
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_syntaxCheck", new SyntaxCheckTool()));
        ctx.subscriptions.push(vscode.lm.registerTool("ecl-extension_findLogicalFiles", new FindLogicalFilesTool()));
    }

    static attach(ctx: vscode.ExtensionContext): ECLLMTools {
        if (!eclLMTools) {
            eclLMTools = new ECLLMTools(ctx);
        }
        return eclLMTools;
    }
}

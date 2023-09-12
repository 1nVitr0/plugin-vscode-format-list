import { ExtensionContext, workspace } from "vscode";
import contributeCommands from "./contribute/commands";
import { ListFormattingProvider } from "./providers/ListFormattingProvider";

export function activate(context: ExtensionContext) {
  const formattingProvider = new ListFormattingProvider();
  context.subscriptions.push(...contributeCommands(formattingProvider));
  context.subscriptions.push(workspace.onDidChangeConfiguration((change) => {}));
}

function deactivate(context: ExtensionContext) {
  context.subscriptions.forEach((subscription) => subscription.dispose());
}

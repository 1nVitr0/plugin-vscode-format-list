import { ExtensionContext, commands, workspace } from "vscode";
import contributeCommands from "./contribute/commands";
import { ListConversionProvider } from "./providers/ListConversionProvider";

export function activate(context: ExtensionContext) {
  const formattingProvider = new ListConversionProvider();
  context.subscriptions.push(...contributeCommands(formattingProvider));
  context.subscriptions.push(
    workspace.onDidChangeConfiguration((change) => {
      if (change.affectsConfiguration("list-tools")) {
        deactivate(context);
        activate(context);
      }
    })
  );
}

function deactivate(context: ExtensionContext) {
  commands.executeCommand("setContext", "list-tools.lastAction", false);
  context.subscriptions.forEach((subscription) => subscription.dispose());
}

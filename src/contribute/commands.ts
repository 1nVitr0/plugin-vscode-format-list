import { commands } from "vscode";
import { ListFormattingProvider } from "../providers/ListFormattingProvider";

export default function contributeCommands(formattingProvider: ListFormattingProvider) {
  return [
    commands.registerTextEditorCommand(
      "list-tools.formatSimpleList",
      formattingProvider.provideSimpleListFormattingEdit.bind(formattingProvider)
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatObjectList",
      formattingProvider.provideObjectListFormattingEdit.bind(formattingProvider)
    ),
  ];
}

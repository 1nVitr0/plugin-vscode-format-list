import { commands } from "vscode";
import { ListFormattingProvider } from "../providers/ListFormattingProvider";

export default function contributeCommands(formattingProvider: ListFormattingProvider) {
  return [
    commands.registerTextEditorCommand(
      "format-lists.formatSimpleList",
      formattingProvider.provideSimpleListFormattingEdit.bind(formattingProvider)
    ),
    commands.registerTextEditorCommand(
      "format-lists.formatObjectList",
      formattingProvider.provideObjectListFormattingEdit.bind(formattingProvider)
    ),
  ];
}

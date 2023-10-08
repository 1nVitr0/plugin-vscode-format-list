import { commands } from "vscode";
import { ListFormattingProvider } from "../providers/ListFormattingProvider";

export default function contributeCommands(formattingProvider: ListFormattingProvider) {
  return [
    commands.registerTextEditorCommand(
      "list-tools.formatSimpleList",
      formattingProvider.provideSimpleListFormattingEdit.bind(formattingProvider, {})
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatObjectList",
      formattingProvider.provideObjectListFormattingEdit.bind(formattingProvider, {})
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatSimpleListPretty",
      formattingProvider.provideSimpleListFormattingEdit.bind(formattingProvider, { forcePretty: true })
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatObjectListPretty",
      formattingProvider.provideObjectListFormattingEdit.bind(formattingProvider, { forcePretty: true })
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatSimpleListUgly",
      formattingProvider.provideSimpleListFormattingEdit.bind(formattingProvider, { forcePretty: false })
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatObjectListUgly",
      formattingProvider.provideObjectListFormattingEdit.bind(formattingProvider, { forcePretty: false })
    ),
    commands.registerTextEditorCommand(
      "list-tools.repeatLastAction",
      formattingProvider.provideRepeatFormattingEdit.bind(formattingProvider)
    ),
  ];
}

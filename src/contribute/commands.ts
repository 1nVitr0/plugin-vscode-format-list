import { commands } from "vscode";
import { ListConversionProvider } from "../providers/ListConversionProvider";

export default function contributeCommands(conversionProvider: ListConversionProvider) {
  return [
    commands.registerTextEditorCommand(
      "list-tools.formatSimpleList",
      conversionProvider.provideSimpleListFormattingEdit.bind(conversionProvider, {})
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatObjectList",
      conversionProvider.provideObjectListFormattingEdit.bind(conversionProvider, {})
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatSimpleListPretty",
      conversionProvider.provideSimpleListFormattingEdit.bind(conversionProvider, { forcePretty: true })
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatObjectListPretty",
      conversionProvider.provideObjectListFormattingEdit.bind(conversionProvider, { forcePretty: true })
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatSimpleListUgly",
      conversionProvider.provideSimpleListFormattingEdit.bind(conversionProvider, { forcePretty: false })
    ),
    commands.registerTextEditorCommand(
      "list-tools.formatObjectListUgly",
      conversionProvider.provideObjectListFormattingEdit.bind(conversionProvider, { forcePretty: false })
    ),
    commands.registerTextEditorCommand(
      "list-tools.extractColumns",
      conversionProvider.provideObjectListFormattingEdit.bind(conversionProvider, { keepLanguage: true })
    ),
    commands.registerTextEditorCommand(
      "list-tools.repeatLastAction",
      conversionProvider.provideRepeatFormattingEdit.bind(conversionProvider)
    ),
  ];
}

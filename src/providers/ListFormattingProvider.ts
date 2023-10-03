import {
  CancellationToken,
  CancellationTokenSource,
  QuickInputButton,
  QuickPickItem,
  QuickPickItemKind,
  Selection,
  TextDocument,
  TextEditor,
  TextEditorEdit,
  commands,
  window,
} from "vscode";
import { ListDataProvider } from "../types/Providers";
import ListFormatProvider from "./formats/ListFormatProvider";
import { listDataProviders } from "./data";
import { listFormatProviders } from "./formats";
import { ListDataParams } from "../types/List";
import {
  ChangeDataProviderButton,
  ListFormattingButton,
  ObjectListButton,
  SimpleListButton,
  TogglePrettyButton,
} from "../input/buttons";
import { DefaultFormatterLanguages, FormatterListTypes, CustomFormatters, Pretty } from "../types/Formatter";
import { workspace } from "vscode";
import { SetRequired } from "type-fest";

interface QuickPickProviderItem extends QuickPickItem {
  languageId?: string;
  provider?: ListFormatProvider;
}

interface QueryFormatterResult {
  listType: keyof FormatterListTypes;
  pretty: number;
  indent: number;
  provider: ListFormatProvider;
  action?: "changeDataProvider";
}

interface StoredListOptions<T extends ListDataParams = ListDataParams> extends Omit<QueryFormatterResult, "provider"> {
  dataProvider: ListDataProvider<T>;
  formatProvider: ListFormatProvider;
  selectedColumns: string[];
  dataParameters?: any;
  formatParameters: Record<string, string | number | boolean>;
}

export class ListFormattingProvider {
  private listDataProviders: Record<string, ListDataProvider<any>>;
  private formatProviders: Record<DefaultFormatterLanguages, ListFormatProvider>;
  private customFormatProviders: Record<string, ListFormatProvider>;
  /** @internal Should only be used with `lastListOptions` getter / setter */
  private _lastListOptions: StoredListOptions | null = null;

  private set lastListOptions(action: StoredListOptions) {
    commands.executeCommand("setContext", "list-tools.lastAction", true);
    this._lastListOptions = action;
  }

  private get lastListOptions(): StoredListOptions | null {
    return this._lastListOptions;
  }

  public constructor() {
    this.listDataProviders = listDataProviders;
    this.formatProviders = listFormatProviders;
    this.customFormatProviders = Object.entries(
      workspace.getConfiguration("list-tools.additionalFormats") ?? {}
    ).reduce<Record<string, ListFormatProvider>>((providers, [name, options]) => {
      const { simpleList, objectList } = options;
      const simpleListProvider = simpleList && "base" in simpleList ? providers[simpleList.base] : null;
      const objectListProvider = objectList && "base" in objectList ? providers[objectList.base] : null;

      providers[name] = ListFormatProvider.extend(name, simpleListProvider, objectListProvider, options);
      return providers;
    }, {});
  }

  public async provideSimpleListFormattingEdit(textEditor: TextEditor) {
    const { document, selection } = textEditor;
    const cancellation = new CancellationTokenSource();
    const formattedList = await this.provideList(document, selection, "simpleList", cancellation.token);
    if (!formattedList) return;

    textEditor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(selection, formattedList);
    });
  }

  public async provideObjectListFormattingEdit(textEditor: TextEditor) {
    const { document, selection } = textEditor;
    const cancellation = new CancellationTokenSource();
    const formattedList = await this.provideList(document, selection, "objectList", cancellation.token);
    if (!formattedList) return;

    textEditor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(selection, formattedList);
    });
  }

  public async provideRepeatFormattingEdit(textEditor: TextEditor) {
    const { document, selection } = textEditor;
    const cancellation = new CancellationTokenSource();
    const formattedList = await this.provideRepeatLastList(document, selection, cancellation.token);
    if (!formattedList) return;

    textEditor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(selection, formattedList);
    });
  }

  private async provideRepeatLastList(document: TextDocument, selection: Selection, token: CancellationToken) {
    if (!this.lastListOptions) return null;

    const {
      indent,
      listType,
      formatParameters,
      pretty,
      formatProvider,
      dataProvider,
      selectedColumns,
      dataParameters,
    } = this.lastListOptions;

    const { columns, listData } =
      (await this.getListData(document, selection, token, dataProvider, dataParameters)) ?? {};

    if (!listData || !columns || selectedColumns?.some((column) => !columns.some((col) => col.name === column))) {
      window.showErrorMessage("Not all columns are available in the current selection");
      return;
    }

    switch (listType) {
      case "simpleList":
        return await formatProvider.formatSimpleList(listData, selectedColumns[0], pretty, indent, formatParameters);
      case "objectList":
        return await formatProvider.formatObjectList(listData, selectedColumns, pretty, indent, formatParameters);
    }
  }

  private async provideList(
    document: TextDocument,
    selection: Selection,
    preferredListType: keyof FormatterListTypes,
    token: CancellationToken,
    customDataProvider?: boolean
  ): Promise<string | null> {
    const {
      columns,
      listData,
      provider: dataProvider,
      parameters: dataParameters,
    } = (await this.getListData(document, selection, token, customDataProvider)) ?? {};
    if (!listData || !columns || token.isCancellationRequested) return null;

    const {
      pretty = 0,
      indent = 0,
      listType,
      provider: formatProvider,
      action,
    } = (await this.queryListFormatter(preferredListType, token)) ?? {};
    if (action === "changeDataProvider")
      return await this.provideList(document, selection, preferredListType, token, true);
    if (!formatProvider || !listType || !dataProvider || token.isCancellationRequested) return null;

    switch (listType) {
      case "simpleList":
        const selectedColumn = await this.queryColumn(columns, token);
        const simpleListParameters = await formatProvider.queryParameters("simpleList", token);
        if (!selectedColumn || !simpleListParameters || token.isCancellationRequested) return null;
        this.lastListOptions = {
          dataProvider,
          formatProvider,
          pretty,
          indent,
          listType,
          selectedColumns: [selectedColumn],
          formatParameters: simpleListParameters,
          dataParameters,
        };
        return await formatProvider.formatSimpleList(listData, selectedColumn, pretty, indent, simpleListParameters);
      case "objectList":
        const selectedColumns = await this.queryColumns(columns, token);
        const objectListParameters = await formatProvider.queryParameters("objectList", token);
        if (!selectedColumns || !objectListParameters || token.isCancellationRequested) return null;
        this.lastListOptions = {
          dataProvider,
          formatProvider,
          pretty,
          indent,
          listType,
          selectedColumns,
          formatParameters: objectListParameters,
          dataParameters,
        };
        return await formatProvider.formatObjectList(listData, selectedColumns, pretty, indent, objectListParameters);
    }
  }

  private async getListData<T>(
    document: TextDocument,
    selection: Selection,
    token: CancellationToken,
    customDataProvider?: ListDataProvider<T> | boolean,
    dataParameters?: T
  ) {
    const provider =
      typeof customDataProvider === "object"
        ? customDataProvider
        : customDataProvider === true || !this.listDataProviders[document.languageId]
        ? await this.queryDataProvider(token)
        : this.listDataProviders[document.languageId] ?? null;
    if (!provider) {
      window.showErrorMessage(`List formatting is not supported for ${document.languageId} files`);
      return;
    }

    const options = await provider.provideColumns(document, selection, token, dataParameters);
    if (!options || token.isCancellationRequested) return;

    const listData = await provider.provideListData(document, selection, options, token);
    if (!listData || token.isCancellationRequested) return;

    return { columns: options.columns, listData, provider, parameters: options.parameters };
  }

  private async queryDataProvider<T extends ListDataParams = ListDataParams>(
    token: CancellationToken
  ): Promise<ListDataProvider<T> | null> {
    const response = await window.showQuickPick(
      Object.entries(this.listDataProviders).map(([label, provider]) => ({ label, provider })),
      { title: "Data format could not be determined automatically", placeHolder: "Select a data provider" }
    );

    if (!response || token.isCancellationRequested) return null;

    return response.provider;
  }

  private async queryColumn(columns: { name: string; example?: string }[], token: CancellationToken) {
    const selectedColumns = await window.showQuickPick(
      columns.map((column) => ({ label: column.name, description: column.example })),
      { placeHolder: "Select column" }
    );

    if (!selectedColumns || token.isCancellationRequested) return null;

    return selectedColumns.label;
  }

  private async queryColumns(columns: { name: string; example?: string }[], token: CancellationToken) {
    const selectedColumns = await window.showQuickPick(
      columns.map((column) => ({ label: column.name, description: column.example })),
      { canPickMany: true, placeHolder: "Select columns to include" }
    );

    if (!selectedColumns || token.isCancellationRequested) return null;

    return selectedColumns.map((column) => column.label);
  }

  private async queryListFormatter(
    listType: keyof FormatterListTypes,
    token: CancellationToken,
    forcePretty?: boolean
  ): Promise<
    QueryFormatterResult | (Partial<QueryFormatterResult> & Required<Pick<QueryFormatterResult, "action">>) | null
  > {
    const providers = { ...this.formatProviders, ...this.customFormatProviders };
    const quickPick = window.createQuickPick();
    quickPick.title =
      "Select a formatter" +
      (forcePretty !== undefined ? ` (Pretty print ${forcePretty ? "enabled" : "disabled"})` : "");
    quickPick.items = this.getQuickPickItems(providers, listType);
    quickPick.buttons = this.getQuickPickButton(listType, forcePretty);
    quickPick.canSelectMany = false;

    const selectedFormatter = await new Promise<QuickPickProviderItem | ListFormattingButton | undefined>((resolve) => {
      const disposables = [
        quickPick.onDidAccept(() => {
          resolve(quickPick.selectedItems[0]);
          disposables.forEach((disposable) => disposable.dispose());
          quickPick.hide();
        }),
        quickPick.onDidTriggerButton((button: QuickInputButton) => {
          resolve(button as ListFormattingButton);
          disposables.forEach((disposable) => disposable.dispose());
          quickPick.hide();
        }),
        quickPick.onDidHide(() => {
          resolve(undefined);
          disposables.forEach((disposable) => disposable.dispose());
          quickPick.dispose();
        }),
      ];
      quickPick.show();
    });

    if (token.isCancellationRequested) return null;
    if (selectedFormatter instanceof ChangeDataProviderButton) return { action: "changeDataProvider" };
    if (selectedFormatter instanceof SimpleListButton)
      return await this.queryListFormatter("simpleList", token, forcePretty);
    if (selectedFormatter instanceof ObjectListButton)
      return await this.queryListFormatter("objectList", token, forcePretty);
    if (selectedFormatter instanceof TogglePrettyButton)
      return await this.queryListFormatter(listType, token, !forcePretty);
    if (!selectedFormatter || !selectedFormatter.provider) return null;

    const context = selectedFormatter.languageId ? { languageId: selectedFormatter.languageId } : undefined;
    const prettyPrint = workspace.getConfiguration("list-tools", context).get<Pretty>("prettyPrint", 0);
    const tabSize = workspace.getConfiguration("editor", context).get<number>("tabSize", 2);

    const pretty =
      forcePretty || prettyPrint === -1
        ? Infinity
        : (forcePretty ?? prettyPrint) === false
        ? 0
        : (prettyPrint as number);
    const indent = tabSize;
    return { listType, pretty, indent, provider: selectedFormatter.provider };
  }

  private getQuickPickItems(
    providers: Record<string, ListFormatProvider>,
    listType: keyof FormatterListTypes,
    forcePretty?: boolean
  ): QuickPickProviderItem[] {
    const groupedFormatters: Record<string, [string, ListFormatProvider][]> = Object.entries(providers).reduce(
      (grouped, formatter) => {
        const { options } = formatter[1];

        if (options[listType]) {
          if (!grouped[listType]) grouped[listType] = [];
          grouped[listType].push(formatter);
        } else {
          for (const group of ListFormatProvider.listTypes) {
            if (!options[group]) continue;
            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(formatter);
          }
        }

        return grouped;
      },
      {} as Record<string, [string, ListFormatProvider][]>
    );

    const itemGroups = Object.entries(groupedFormatters).map(([label, formatters]) => {
      const items = formatters.map<QuickPickProviderItem>(([name, provider]) => ({
        label:
          (forcePretty !== undefined && !provider.supportsPretty() ? "$(bracket-error) " : "") + provider.custom
            ? `$(file-add)$(${name}) ${provider.name}`
            : `$(${name}) ${provider.name}`,
        languageId: name,
        provider,
        detail: provider.options[listType]?.example,
        description: forcePretty !== undefined && provider.supportsPretty() ? "Doesn't support pretty printing" : "",
      }));

      return { label, items };
    });

    const result: QuickPickProviderItem[] = itemGroups.shift()?.items ?? [];

    for (const { label, items } of itemGroups) {
      result.push({ label, kind: QuickPickItemKind.Separator });
      result.push(...items);
    }

    return result;
  }

  private getQuickPickButton(listType: keyof FormatterListTypes, pretty = false): ListFormattingButton[] {
    const buttons: ListFormattingButton[] = [new TogglePrettyButton(!pretty), new ChangeDataProviderButton()];

    switch (listType) {
      case "simpleList":
        buttons.push(new ObjectListButton());
        break;
      case "objectList":
        buttons.push(new SimpleListButton());
        break;
    }

    return buttons;
  }
}

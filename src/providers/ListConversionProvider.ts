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
  l10n,
  window,
} from "vscode";
import { ListDataProvider } from "../types/Providers";
import ListFormatProvider from "./formats/ListFormatProvider";
import { listDataProviders } from "./data";
import { listFormatProviders } from "./formats";
import { ListDataContext } from "../types/List";
import {
  ChangeDataProviderButton,
  ListFormattingButton,
  ObjectListButton,
  SimpleListButton,
  TogglePrettyButton,
} from "../input/buttons";
import { DefaultFormatterLanguages, FormatterListTypes, Pretty } from "../types/Formatter";
import { workspace } from "vscode";

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

interface StoredListOptions<T extends ListDataContext = ListDataContext>
  extends Omit<QueryFormatterResult, "provider"> {
  dataProvider: ListDataProvider<T>;
  formatProvider: ListFormatProvider;
  selectedColumns: string[];
  dataParameters?: any;
  formatParameters: Record<string, string | number | boolean>;
}

interface FormattingEditOptions {
  forcePretty?: boolean;
  customDataProvider?: boolean;
  keepLanguage?: boolean;
}

export class ListConversionProvider {
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
    const configuration = workspace.getConfiguration("list-tools");

    this.listDataProviders = listDataProviders;
    this.formatProviders = listFormatProviders;
    this.customFormatProviders = Object.entries(configuration?.get("additionalFormats") ?? {}).reduce<
      Record<string, ListFormatProvider>
    >((providers, [name, options]) => {
      const { simpleList, objectList } = options;
      const simpleListProvider =
        simpleList && "base" in simpleList
          ? listFormatProviders[simpleList.base as DefaultFormatterLanguages] ?? providers[simpleList.base]
          : null;
      const objectListProvider =
        objectList && "base" in objectList
          ? listFormatProviders[objectList.base as DefaultFormatterLanguages] ?? providers[objectList.base]
          : null;

      providers[name] = ListFormatProvider.extend(name, simpleListProvider, objectListProvider, options);
      return providers;
    }, {});
  }

  /**
   * Provides simple list formatting edit for the given text editor and selection.
   *
   * @param options Formatting options.
   * @param textEditor The text editor to provide the formatting edit for.
   */
  public async provideSimpleListFormattingEdit(options: FormattingEditOptions, textEditor: TextEditor) {
    const { document, selection } = textEditor;
    const cancellation = new CancellationTokenSource();
    const formattedList = await this.provideList(document, selection, "simpleList", options, cancellation.token);
    if (!formattedList) return;

    textEditor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(selection, formattedList);
    });
  }

  /**
   * Provides object list formatting edit for the given text editor and selection.
   *
   * @param options Formatting options.
   * @param textEditor The text editor to provide the formatting edit for.
   */
  public async provideObjectListFormattingEdit(options: FormattingEditOptions, textEditor: TextEditor) {
    const { document, selection } = textEditor;
    const cancellation = new CancellationTokenSource();
    const formattedList = await this.provideList(document, selection, "objectList", options, cancellation.token);
    if (!formattedList) return;

    textEditor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(selection, formattedList);
    });
  }

  /**
   * Provides formatting edit for the last list formatting action.
   *
   * @param textEditor The text editor to provide the formatting edit for.
   */
  public async provideRepeatFormattingEdit(textEditor: TextEditor) {
    const { document, selection } = textEditor;
    const cancellation = new CancellationTokenSource();
    const formattedList = await this.provideRepeatLastList(document, selection, cancellation.token);
    if (!formattedList) return;

    textEditor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(selection, formattedList);
    });
  }

  /**
   * Applies the last list formatting action to the given text editor and selection.
   *
   * @param textEditor The text editor to apply the formatting action to.
   * @param selection The selection to apply the formatting action to.
   * @param token A cancellation token.
   * @returns the formatted list as a string or `null` if the action could not be applied.
   */
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
      window.showErrorMessage(l10n.t("Not all columns are available in the current selection"));
      return;
    }

    switch (listType) {
      case "simpleList":
        return await formatProvider.formatSimpleList(listData, selectedColumns[0], pretty, indent, formatParameters);
      case "objectList":
        return await formatProvider.formatObjectList(listData, selectedColumns, pretty, indent, formatParameters);
    }
  }

  /**
   * Provides a converted list for the given text editor and selection.
   * Handles all the user to change the data provider and list formatter.
   *
   * @param document The document to provide the converted list for.
   * @param selection The selection to provide the converted list for.
   * @param preferredListType The preferred list type to use.
   * @param options Formatting options.
   * @param token A cancellation token.
   * @returns the converted list as a string or `null` if the list could not be converted.
   */
  private async provideList(
    document: TextDocument,
    selection: Selection,
    preferredListType: keyof FormatterListTypes,
    { forcePretty, customDataProvider, keepLanguage }: FormattingEditOptions = {},
    token: CancellationToken
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
    } = (await this.queryListFormatter(document, preferredListType, { forcePretty, keepLanguage }, token)) ?? {};
    if (action === "changeDataProvider")
      return await this.provideList(document, selection, preferredListType, { customDataProvider: true }, token);
    if (!formatProvider || !listType || !dataProvider || token.isCancellationRequested) return null;

    switch (listType) {
      case "simpleList":
        const selectedColumn = await this.querySingleColumn(columns, token);
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
        const selectedColumns = await this.queryMultipleColumns(columns, token);
        const objectListParameters = await formatProvider.queryParameters("objectList", token);
        if (!selectedColumns || selectedColumns.length <= 0 || !objectListParameters || token.isCancellationRequested)
          return null;
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

  /**
   * Gets the list data for the given text editor and selection.
   *
   * @param document The document to get the list data for.
   * @param selection The selection to get the list data for.
   * @param token A cancellation token.
   * @param customDataProvider Whether to force the use of a custom data provider.
   * @param dataParameters The parameters to pass to the data provider.
   * @returns the list data or `null` if the list data could not be retrieved.
   */
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
        ? await this.queryListDataProvider(token)
        : this.listDataProviders[document.languageId] ?? null;
    if (!provider) {
      window.showErrorMessage(l10n.t("List formatting is not supported for {0} files", document.languageId));
      return;
    }

    const options = await provider.provideColumns(document, selection, token, dataParameters);
    if (!options || token.isCancellationRequested) return;

    const listData = await provider.provideListData(document, selection, options, token);
    if (!listData || token.isCancellationRequested) return;

    return { columns: options.columns, listData, provider, parameters: options.parameters };
  }

  /**
   * Queries the user to select a data provider.
   *
   * @param token A cancellation token.
   * @returns the selected data provider or `null` if the user cancelled the selection.
   */
  private async queryListDataProvider<T extends ListDataContext = ListDataContext>(
    token: CancellationToken
  ): Promise<ListDataProvider<T> | null> {
    const response = await window.showQuickPick(
      Object.entries(this.listDataProviders).map(([label, provider]) => ({ label, provider })),
      {
        ignoreFocusOut: true,
        title: l10n.t("Data format could not be determined automatically"),
        placeHolder: l10n.t("Select a data provider"),
      }
    );

    if (!response || token.isCancellationRequested) return null;

    return response.provider;
  }

  /**
   * Queries the user to select a single column.
   *
   * @param columns The columns to select from.
   * @param token A cancellation token.
   * @returns the selected column or `null` if the user cancelled the selection.
   */
  private async querySingleColumn(columns: { name: string; example?: string }[], token: CancellationToken) {
    const selectedColumns = await window.showQuickPick(
      columns.map((column) => ({ label: column.name, description: column.example })),
      { placeHolder: l10n.t("Select column"), ignoreFocusOut: true }
    );

    if (!selectedColumns || token.isCancellationRequested) return null;

    return selectedColumns.label;
  }

  /**
   * Queries the user to select multiple columns.
   *
   * @param columns The columns to select from.
   * @param token A cancellation token.
   * @returns the selected columns or `null` if the user cancelled the selection.
   */
  private async queryMultipleColumns(columns: { name: string; example?: string }[], token: CancellationToken) {
    const selectedColumns = await window.showQuickPick(
      columns.map((column) => ({ label: column.name, description: column.example })),
      { canPickMany: true, ignoreFocusOut: true, placeHolder: l10n.t("Select columns to include") }
    );

    if (!selectedColumns || token.isCancellationRequested) return null;

    return selectedColumns.map((column) => column.label);
  }

  /**
   * Queries the user to select a list formatter.
   *
   * @param document The document to get the list formatter for.
   * @param listType The preferred list type to use.
   * @param options Formatting options.
   * @param token A cancellation token.
   * @returns the selected list formatter or `null` if the user cancelled the selection.
   */
  private async queryListFormatter(
    document: TextDocument,
    listType: keyof FormatterListTypes,
    { forcePretty, keepLanguage }: FormattingEditOptions = {},
    token?: CancellationToken
  ): Promise<
    QueryFormatterResult | (Partial<QueryFormatterResult> & Required<Pick<QueryFormatterResult, "action">>) | null
  > {
    const formatProviders: Record<string, ListFormatProvider> = {
      ...this.formatProviders,
      ...this.customFormatProviders,
    };

    const matchingFormatProvider = keepLanguage ? formatProviders[document.languageId] : null;
    const selectedFormatter = matchingFormatProvider
      ? { provider: matchingFormatProvider, languageId: document.languageId }
      : await new Promise<QuickPickProviderItem | ListFormattingButton | undefined>((resolve) => {
          const quickPick = window.createQuickPick();
          quickPick.title =
            l10n.t("Select an output format") + forcePretty !== undefined
              ? ` (${forcePretty ? l10n.t("Pretty print enabled") : l10n.t("Pretty print disabled")})`
              : "";
          quickPick.items = this.getListFormatterQuickPickItems(formatProviders, listType, { forcePretty });
          quickPick.buttons = this.getListFormatterQuickPickButton(listType, forcePretty);
          quickPick.canSelectMany = false;
          quickPick.ignoreFocusOut = true;

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

    if (token?.isCancellationRequested) return null;
    if (selectedFormatter instanceof ChangeDataProviderButton) return { action: "changeDataProvider" };
    if (selectedFormatter instanceof SimpleListButton)
      return await this.queryListFormatter(document, "simpleList", { forcePretty }, token);
    if (selectedFormatter instanceof ObjectListButton)
      return await this.queryListFormatter(document, "objectList", { forcePretty }, token);
    if (selectedFormatter instanceof TogglePrettyButton)
      return await this.queryListFormatter(document, listType, { forcePretty: !forcePretty }, token);
    if (!selectedFormatter || !selectedFormatter.provider) return null;

    const context = selectedFormatter.languageId ? { languageId: selectedFormatter.languageId } : undefined;
    const prettyPrint = workspace.getConfiguration("list-tools", context).get<Pretty>("prettyPrint", 0);
    const tabSize = workspace.getConfiguration("editor", context).get<number>("tabSize", 2);

    const pretty =
      (forcePretty ?? prettyPrint) === false
        ? 0
        : forcePretty || prettyPrint === -1
        ? Infinity
        : (prettyPrint as number);
    const indent = tabSize;
    return { listType, pretty, indent, provider: selectedFormatter.provider };
  }

  /**
   * Gets the quick pick items for the given list format providers.
   *
   * @param providers The list format providers to get the quick pick items for.
   * @param listType The preferred list type to use.
   * @param options Formatting options.
   * @returns the quick pick items.
   * @internal
   */
  private getListFormatterQuickPickItems(
    providers: Record<string, ListFormatProvider>,
    listType: keyof FormatterListTypes,
    { forcePretty }: FormattingEditOptions = {}
  ): QuickPickProviderItem[] {
    // Group formatters by supported list type
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
      {} as Record<keyof FormatterListTypes, [string, ListFormatProvider][]>
    );

    const itemGroups = (
      Object.entries(groupedFormatters) as [keyof FormatterListTypes, [string, ListFormatProvider][]][]
    ).map(([type, formatters]) => {
      const items = formatters.map<QuickPickProviderItem>(([name, provider]) => ({
        label:
          (forcePretty !== undefined && !provider.supportsPretty() ? "$(bracket-error) " : "") + provider.custom
            ? `$(file-add)$(${name}) ${provider.name}`
            : `$(${name}) ${provider.name}`,
        languageId: name,
        provider,
        detail: provider.options[listType]?.example,
        description:
          forcePretty !== undefined && !provider.supportsPretty()
            ? l10n.t("Format does not support pretty printing")
            : "",
      }));

      const label =
        type === "objectList" ? l10n.t("Object list") : type === "simpleList" ? l10n.t("Simple list") : type;
      
      return { label, items };
    });

    const result: QuickPickProviderItem[] = itemGroups.shift()?.items ?? [];

    for (const { label, items } of itemGroups) {
      result.push({ label, kind: QuickPickItemKind.Separator });
      result.push(...items);
    }

    return result;
  }

  /**
   * Gets the quick pick buttons for the given list format providers.
   *
   * @param listType The preferred list type to use.
   * @param pretty Whether pretty printing is enabled.
   * @returns the quick pick buttons.
   */
  private getListFormatterQuickPickButton(
    listType: keyof FormatterListTypes,
    pretty?: boolean
  ): ListFormattingButton[] {
    const buttons: ListFormattingButton[] = [new TogglePrettyButton(pretty === undefined ? true : !pretty)];

    switch (listType) {
      case "simpleList":
        buttons.push(new ObjectListButton());
        break;
      case "objectList":
        buttons.push(new SimpleListButton());
        break;
    }

    buttons.push(new ChangeDataProviderButton());
    return buttons;
  }
}

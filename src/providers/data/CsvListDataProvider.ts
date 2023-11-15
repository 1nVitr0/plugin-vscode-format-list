import { Selection, TextDocument, CancellationToken, window, l10n } from "vscode";
import { ListColumn, ListData, ListDataContext } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";
import { showFreeSoloQuickPick } from "../../input/freeSoloQuickPick";
import { parse } from "csv-parse";

interface CsvParameters {
  delimiter: string;
  hasHeader: boolean;
}

export default class CsvListDataProvider implements ListDataProvider<CsvParameters> {
  protected quickPickTitle = "CSV Data Format";
  protected delimiters = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ", (comma)": ",",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "; (semicolon)": ";",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "\\t (tab)": "\t",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "\\s (space)": " ",
  };

  public async provideColumns(
    document: TextDocument,
    selection: Selection,
    token: CancellationToken,
    parameters?: CsvParameters
  ) {
    const _parameters = parameters ?? (await this.queryOptions(token));
    if (!_parameters) return;

    const { delimiter, hasHeader } = _parameters;

    const [header, firstEntry] = await new Promise<string[][]>((res, rej) =>
      parse(
        document.getText(selection),
        { delimiter, skipEmptyLines: true, quote: '"', comment: "#" },
        (err, records) => (err ? rej(err) : res(records))
      )
    );

    const columns = header.map<ListColumn>((column, index) => {
      const example = firstEntry?.[index];
      const name = hasHeader ? this.extractString(column) : `column_${index}`;

      return { name, example };
    });

    return { columns, parameters: _parameters };
  }

  public async provideListData(
    document: TextDocument,
    selection: Selection,
    { columns, parameters }: ListDataContext<CsvParameters>,
    token: CancellationToken
  ) {
    const { delimiter, hasHeader } = parameters ?? { delimiter: ",", hasHeader: false };

    const [header, ...body] = await new Promise<string[][]>((res, rej) =>
      parse(
        document.getText(selection),
        { delimiter, skipEmptyLines: true, quote: '"', comment: "#" },
        (err, records) => (err ? rej(err) : res(records))
      )
    );
    const csv = hasHeader ? body : [header, ...body];

    return csv.map((values) => {
      return values.reduce((acc, item, index) => {
        const column = columns[index]?.name ?? `column_${index}`;
        acc[column] = this.parseValue(item);
        return acc;
      }, {} as ListData);
    });
  }

  protected async queryOptions(token: CancellationToken): Promise<CsvParameters | null> {
    const delimiter = await showFreeSoloQuickPick(
      Object.entries(this.delimiters).map(([key, value]) => ({ label: l10n.t(key), value })),
      {
        title: this.quickPickTitle,
        placeholder: l10n.t("Select a delimiter"),
        ignoreFocusOut: true,
        createInputItem: (input) => ({ label: l10n.t('Custom delimiter: "{input}"', { input }), value: input }),
      },
      token
    );

    if (!delimiter || token.isCancellationRequested) return null;

    const hasHeader = await window.showQuickPick(
      [
        { label: l10n.t("Yes"), value: true },
        { label: l10n.t("No"), value: false },
      ],
      { title: this.quickPickTitle, placeHolder: l10n.t("Does the CSV have a header?") }
    );

    if (hasHeader === undefined || token.isCancellationRequested) return null;

    return {
      delimiter: delimiter.value,
      hasHeader: hasHeader.value,
    };
  }

  protected parseValue(value: string): string | number | boolean | null {
    if (value === "null") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) return value.slice(1, -1);

    return this.extractString(value);
  }

  protected extractString(value: string): string {
    return /^".*"$/.test(value) || /^'.*'$/.test(value) ? value.slice(1, -1) : value;
  }
}

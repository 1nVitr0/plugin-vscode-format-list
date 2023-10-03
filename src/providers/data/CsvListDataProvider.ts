import { Selection, TextDocument, CancellationToken, window } from "vscode";
import { ListColumn, ListData, ListDataParams } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";

interface CsvParameters {
  delimiter: string;
  hasHeader: boolean;
}

export default class CsvListDataProvider implements ListDataProvider<CsvParameters> {
  protected quickPickTitle = "CSV Data Format";
  protected delimiters = {
    ", (comma)": ",",
    "; (semicolon)": ";",
    "\\t (tab)": "\t",
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
    const firstLineParts = document.lineAt(selection.start.line).text.split(delimiter);
    const secondLineParts = document
      .lineAt(Math.min(selection.start.line + 1, selection.end.line))
      .text.split(delimiter);
    const columns = firstLineParts.map<ListColumn>((column, index) => {
      const example = secondLineParts[index];
      const name = hasHeader ? this.extractString(column) : `column_${index}`;

      return { name, example };
    });

    return { columns, parameters: _parameters };
  }

  public async provideListData(
    document: TextDocument,
    selection: Selection,
    { columns, parameters }: ListDataParams<CsvParameters>,
    token: CancellationToken
  ) {
    const { delimiter, hasHeader } = parameters ?? { delimiter: ",", hasHeader: false };
    const text = document.getText(selection);
    const lines = text.split(/\r?\n/);

    if (hasHeader) lines.shift();

    return lines.map((line) => {
      const values = line.split(delimiter);

      return values.reduce((acc, item, index) => {
        const column = columns[index]?.name ?? `column_${index}`;
        acc[column] = this.parseValue(item);
        return acc;
      }, {} as ListData);
    });
  }

  protected async queryOptions(token: CancellationToken): Promise<CsvParameters | null> {
    const delimiterKey = (await window.showQuickPick(Object.keys(this.delimiters), {
      title: this.quickPickTitle,
      placeHolder: "Select a delimiter",
    })) as keyof typeof this.delimiters | undefined;

    if (!delimiterKey || token.isCancellationRequested) return null;

    const hasHeader = await window.showQuickPick(["Yes", "No"], {
      title: this.quickPickTitle,
      placeHolder: "Does the CSV have a header?",
    });

    if (hasHeader === undefined || token.isCancellationRequested) return null;

    return { delimiter: this.delimiters[delimiterKey], hasHeader: hasHeader === "Yes" };
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

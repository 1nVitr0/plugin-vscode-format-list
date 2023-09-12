import { Selection, TextDocument, CancellationToken, window } from "vscode";
import { ListColumn, ListData, ListDataParams } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";

interface CsvListDataParams extends ListDataParams {
  delimiter: string;
  hasHeader: boolean;
}

export default class CsvListDataProvider implements ListDataProvider<CsvListDataParams> {
  protected quickPickTitle = "CSV Data Format";
  protected delimiters = [",", ";", "\t"];

  public async provideColumns(document: TextDocument, selection: Selection, token: CancellationToken) {
    const options = await this.queryOptions(token);
    if (!options) return;

    const { delimiter, hasHeader } = options;
    const firstLineParts = document.lineAt(selection.start.line).text.split(delimiter);
    const secondLineParts = document
      .lineAt(Math.min(selection.start.line + 1, selection.end.line))
      .text.split(delimiter);
    const columns = firstLineParts.map<ListColumn>((column, index) => {
      const example = secondLineParts[index];
      const name = hasHeader ? column : `column_${index}`;

      return { name, example };
    });

    return { hasHeader, delimiter, columns };
  }

  public async provideListData(
    document: TextDocument,
    selection: Selection,
    { columns, delimiter, hasHeader }: ListDataParams & { delimiter: string; hasHeader: boolean },
    token: CancellationToken
  ) {
    const text = document.getText(selection);
    const lines = text.split("\n");

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

  protected async queryOptions(token: CancellationToken) {
    const delimiter = await window.showQuickPick(this.delimiters, {
      title: this.quickPickTitle,
      placeHolder: "Select a delimiter",
    });

    if (!delimiter || token.isCancellationRequested) return null;

    const hasHeader = await window.showQuickPick(["Yes", "No"], {
      title: this.quickPickTitle,
      placeHolder: "Does the CSV have a header?",
    });

    if (hasHeader === undefined || token.isCancellationRequested) return null;

    return { delimiter, hasHeader: hasHeader === "Yes" };
  }

  protected parseValue(value: string): string | number | boolean | null {
    if (value === "null") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) return value.slice(1, -1);

    return value;
  }
}

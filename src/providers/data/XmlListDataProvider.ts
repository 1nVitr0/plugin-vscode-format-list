import { Selection, TextDocument, CancellationToken } from "vscode";
import { ListColumn, ListData, ListDataContext } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";
import { Parser } from "xml2js";

export default class XmlListDataProvider implements ListDataProvider {
  private parser: Parser = new Parser();

  public async provideColumns(document: TextDocument, selection: Selection, token: CancellationToken) {
    const text = document.getText(selection).trim();
    const xml: { [key: string]: Record<string, Record<string, string | number | boolean | null>[]> } | null =
      await this.parser.parseStringPromise(text).catch(() => null);
    const root = xml && typeof xml === "object" ? xml[Object.keys(xml)[0]] : null;
    const items = root && root[Object.keys(root)[0]];

    if (!items || !Array.isArray(items)) throw new Error("Selected text must be a valid XML array");

    const columns: ListColumn[] = items.reduce<ListColumn[]>((columns, item) => {
      Object.keys(item).forEach((key) => {
        if (!columns.find((column) => column.name === key)) columns.push({ name: key });
      });

      return columns;
    }, []);

    return { columns };
  }

  public async provideListData(
    document: TextDocument,
    selection: Selection,
    { columns }: ListDataContext,
    token: CancellationToken
  ) {
    const text = document.getText(selection).trim();
    const xml: { [key: string]: Record<string, Record<string, string | number | boolean | null>[]> } | null =
      await this.parser.parseStringPromise(text).catch(() => null);
    const root = xml && typeof xml === "object" ? xml[Object.keys(xml)[0]] : null;
    const items = root && root[Object.keys(root)[0]];

    if (!items || !Array.isArray(items)) throw new Error("Selected text must be a valid XML array");

    return items.map<ListData>((item) => {
      return columns.reduce<ListData>((data, column) => {
        const value = item[column.name];
        if (value !== undefined) data[column.name] = this.parseValue(value as string);
        return data;
      }, {});
    });
  }

  protected parseValue(value: string): string | number | boolean | null {
    if (value === "null") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);

    return value;
  }
}

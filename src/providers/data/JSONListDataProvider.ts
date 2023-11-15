import { TextDocument, Selection, CancellationToken, ProviderResult } from "vscode";
import stripJsonComments from "strip-json-comments";
import { flatten } from "flat";
import parseJson from "parse-json";
import { ListDataContext, ListData } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";

export default class JSONListDataProvider implements ListDataProvider {
  public provideColumns(
    document: TextDocument,
    selection: Selection,
    token: CancellationToken,
    parameters?: undefined
  ): ProviderResult<ListDataContext<undefined>> {
    const json = this.parseJsonArray(document.getText(selection));
    const flattened = json.map((item) => flatten<any, any>(item, { delimiter: "." }));

    const columns = flattened.reduce<Set<string>>((columns, item) => {
      Object.keys(item).forEach((key) => columns.add(key));
      return columns;
    }, new Set<string>());
    const firstItem = flattened[0];

    return {
      columns: [...columns].map((name) => ({
        name,
        example: firstItem?.[name]?.toString(),
      })),
    };
  }

  public provideListData(
    document: TextDocument,
    selection: Selection,
    context: ListDataContext<undefined>,
    token: CancellationToken
  ): ProviderResult<ListData[]> {
    const { columns } = context;
    const json = this.parseJsonArray(document.getText(selection));
    const flattened = json.map((item) => flatten<any, Record<string, any>>(item, { delimiter: "." }));

    return flattened.map((item) =>
      columns.reduce<ListData>((data, { name }) => ({ ...data, [name]: this.parseValue(item[name]) }), {})
    );
  }

  private parseJsonArray(json: string) {
    let stripped = stripJsonComments(json).trim();

    if (stripped[0] !== "[") stripped = `[${stripped}]`;
    if (stripped[stripped.length - 1] === ",") stripped = stripped.slice(0, -1);
    if (stripped[stripped.length - 1] !== "]") stripped += "]";

    const items = parseJson(stripped) as unknown as object[];

    if (items.length === 1) {
      const entries = Object.entries(items[0]);
      if (!entries.every(([, value]) => typeof value === "object")) return items;

      return entries.map(([key, value]) => ({ key: key, ...value }));
    }

    return items;
  }

  private parseValue(value: any) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
    return null;
  }
}

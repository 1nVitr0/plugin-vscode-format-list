import { TextDocument, Selection, CancellationToken, ProviderResult } from "vscode";
import stripJsonComments from "strip-json-comments";
import { flatten } from "flat";
import parseJson from "parse-json";
import { ListDataContext, ListData } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";

export default class JSONListDataProvider implements ListDataProvider {
  public async provideColumns(
    document: TextDocument,
    selection: Selection,
    token: CancellationToken,
    parameters?: undefined
  ): Promise<ListDataContext<undefined>> {
    const json = await this.parseJsonArray(document.getText(selection), token);
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

  public async provideListData(
    document: TextDocument,
    selection: Selection,
    context: ListDataContext<undefined>,
    token: CancellationToken
  ): Promise<ListData[]> {
    const { columns } = context;
    const json = await this.parseJsonArray(document.getText(selection), token);
    const flattened = json.map((item) => flatten<any, Record<string, any>>(item, { delimiter: "." }));

    return flattened.map((item) =>
      columns.reduce<ListData>((data, { name }) => ({ ...data, [name]: this.parseValue(item[name]) }), {})
    );
  }

  private async parseJsonArray(json: string, token: CancellationToken) {
    let stripped = stripJsonComments(json).trim();

    if (stripped[0] !== "[") stripped = `[${stripped}`;
    if (stripped[stripped.length - 1] === ",") stripped = stripped.slice(0, -1);
    if (stripped[stripped.length - 1] !== "]") stripped += "]";

    let items: object[];
    
    try {
      items = parseJson(stripped) as unknown as object[];
    } catch (error) {
      // Retry parsing as jsonl
      if (token.isCancellationRequested) return [];
      stripped = stripped.replace(/\}\r?\n/g, "},\n");
      items = parseJson(stripped) as unknown as object[];
    }


    if (token.isCancellationRequested) return [];
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

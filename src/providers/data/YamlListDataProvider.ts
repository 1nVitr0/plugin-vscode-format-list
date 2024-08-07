import { CancellationToken, Selection, TextDocument } from "vscode";
import { ListDataProvider } from "../../types/Providers";
import { ListData, ListDataContext } from "../../types/List";
import { flatten } from "flat";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export default class YamlListDataProvider implements ListDataProvider {
  public async provideColumns(
    document: TextDocument,
    selection: Selection,
    token: CancellationToken,
    parameters?: undefined
  ): Promise<ListDataContext<undefined>> {
    const json = await this.parseYamlArray(document.getText(selection), token);
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
    const json = await this.parseYamlArray(document.getText(selection), token);
    const flattened = json.map((item) => flatten<any, Record<string, any>>(item, { delimiter: "." }));

    return flattened.map((item) =>
      columns.reduce<ListData>((data, { name }) => ({ ...data, [name]: this.parseValue(item[name]) }), {})
    );
  }

  private async parseYamlArray(yaml: string, token: CancellationToken) {
    const items = parseYaml(yaml) as unknown as object[];

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

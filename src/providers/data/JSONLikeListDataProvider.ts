import { CancellationToken, Selection, TextDocument } from "vscode";
import { ListColumn, ListData, ListDataContext } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";

export default abstract class JSONLikeListDataProvider implements ListDataProvider {
  protected abstract parseStringRegex: string;
  protected abstract parseValueRegex: string;
  protected abstract parseObjectEntriesRegex: string | null;
  protected abstract parseObjectRegex: string | null;
  protected abstract parseArrayRegex: string;

  public async provideColumns(document: TextDocument, selection: Selection, token: CancellationToken) {
    const text = document.getText(selection);
    const parseArray = new RegExp(this.parseArrayRegex, "ug");
    const parseObject = this.parseObjectRegex && new RegExp(this.parseObjectRegex, "ug");
    const parseObjectEntries = this.parseObjectEntriesRegex && new RegExp(this.parseObjectEntriesRegex, "ug");

    if (parseArray.test(text)) {
      const example = parseArray.exec(text)?.[1].replace(/,\s*$/, "");
      return {
        columns: [{ name: "0", example }],
      };
    } else if (!parseObject || !parseObjectEntries) {
      return { columns: [] };
    }

    const columns: Record<string, ListColumn> = {};
    for (const [match] of text.matchAll(parseObject)) {
      const entries = Array.from(match.matchAll(parseObjectEntries));
      for (const [entry, enclosed, key, doubleQuotes, singleQuotes, backTicks, value] of entries) {
        const name = backTicks ?? singleQuotes ?? doubleQuotes ?? key;
        if (!columns[name]) columns[name] = { name, example: value };
      }
    }

    return {
      columns: token.isCancellationRequested ? [] : Object.values(columns),
    };
  }

  public async provideListData(
    document: TextDocument,
    selection: Selection,
    { columns }: ListDataContext,
    token: CancellationToken
  ) {
    const text = document.getText(selection);
    const parseArray = new RegExp(this.parseArrayRegex, "ug");
    const parseObject = this.parseObjectRegex && new RegExp(this.parseObjectRegex, "ug");
    const parseObjectEntries = this.parseObjectEntriesRegex && new RegExp(this.parseObjectEntriesRegex, "ug");
    const parseValue = new RegExp(this.parseValueRegex, "ug");

    if (parseArray.test(text)) {
      const [column = { name: "0" }] = columns;
      const entries = Array.from(text.matchAll(parseValue));
      return entries.map(([, value]) => ({ [column.name]: value }));
    } else if (!parseObject || !parseObjectEntries) {
      return [];
    }

    const result: ListData[] = [];
    for (const [match] of text.matchAll(parseObject)) {
      const row: ListData = {};
      const entries = Array.from(match.matchAll(parseObjectEntries));
      for (const [
        entry,
        keyEnclosed,
        key,
        keyDoubleQuoted,
        keySingleQuoted,
        keyBackTicked,
        valueEnclosed,
        value,
        valueDoubleQuoted,
        valueSingleQuoted,
        valueBackTicked,
      ] of entries) {
        const name = keyBackTicked ?? keySingleQuoted ?? keyDoubleQuoted ?? key;
        row[name] = valueBackTicked ?? valueSingleQuoted ?? valueDoubleQuoted ?? this.parseValue(value);
      }
      result.push(row);
    }

    return token.isCancellationRequested ? [] : result;
  }

  protected parseValue(value?: string): string | number | boolean | null {
    if (value === undefined) return null;
    if (value === "null") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);

    return value;
  }
}

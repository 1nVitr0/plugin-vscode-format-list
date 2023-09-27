import { Selection, TextDocument, CancellationToken, window } from "vscode";
import { ListColumn, ListData, ListDataParams } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";

export default class JavaScriptListDataProvider implements ListDataProvider {
  protected parseStringRegex = `"((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)'|\`((?:[^\`\\\\]|\\\\.)*)\``;
  protected parseKeyRegex = `[\\p{Letter}_$][0-9\\p{Letter}_$]*|${this.parseStringRegex}`;
  protected parseValueRegex = `(${this.parseStringRegex}|true|false|null|undefined|NaN|-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`;
  protected parseObjectEntries = `(${this.parseKeyRegex})\\s*:\\s*(${this.parseValueRegex})`;
  protected parseObjectRegex = `\\{\\s*(${this.parseObjectEntries}\\s*,?\\s*)*\\s*\\}`;
  protected parseArrayRegex = `\\[\\s*(${this.parseValueRegex}\\s*,?\\s*)*\\s*\\]`;

  public async provideColumns(document: TextDocument, selection: Selection, token: CancellationToken) {
    const text = document.getText(selection);
    const parseArray = new RegExp(this.parseArrayRegex, "ug");
    const parseObject = new RegExp(this.parseObjectRegex, "ug");
    const parseObjectEntries = new RegExp(this.parseObjectEntries, "ug");

    if (parseArray.test(text)) {
      const example = parseArray.exec(text)?.[1].replace(/,\s*$/, "");
      return {
        columns: [{ name: "0", example }],
      };
    }

    const columns: Record<string, ListColumn> = {};
    for (const [match] of text.matchAll(parseObject)) {
      const entries = Array.from(match.matchAll(parseObjectEntries));
      for (const [entry, key, doubleQuotes, singleQuotes, backTicks, value] of entries) {
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
    { columns }: ListDataParams,
    token: CancellationToken
  ) {
    const text = document.getText(selection);
    const parseArray = new RegExp(this.parseArrayRegex, "ug");
    const parseObject = new RegExp(this.parseObjectRegex, "ug");
    const parseObjectEntries = new RegExp(this.parseObjectEntries, "ug");
    const parseValue = new RegExp(this.parseValueRegex, "ug");

    if (parseArray.test(text)) {
      const [column = { name: "0" }] = columns;
      const entries = Array.from(text.matchAll(parseValue));
      return entries.map(([, value]) => ({ [column.name]: value }));
    }

    const result: ListData[] = [];
    for (const [match] of text.matchAll(parseObject)) {
      const row: ListData = {};
      const entries = Array.from(match.matchAll(parseObjectEntries));
      for (const [
        entry,
        key,
        keyDoubleQuoted,
        keySingleQuoted,
        keyBackTicked,
        valueEnclosure,
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

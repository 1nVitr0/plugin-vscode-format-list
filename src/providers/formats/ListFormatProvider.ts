import { CancellationToken, QuickPickItem, window } from "vscode";
import {
  ExtendFormatterOptions,
  FormatterListHeaderOptions,
  FormatterRegexEnclosure,
  FormatterListOptions,
  FormatterListTypes,
  FormatterOptions,
  FormatterValueAlias,
  FormatterValueEnclosure,
  FormatterValueEscape,
  FormatterEnclosure,
  FormatterListObjectItemOptions,
} from "../../types/Formatter";
import { ListData } from "../../types/List";
import * as deepMerge from 'deepmerge';

/**
 * List formatter
 */
export default class ListFormatProvider {
  public static readonly listTypes: (keyof FormatterListTypes)[] = ["simpleList", "objectList"];

  public readonly name: string;
  public readonly options: FormatterOptions;
  public readonly custom: boolean;

  public static extend(
    name: string,
    simpleListProvider: ListFormatProvider | null = null,
    objectListProvider: ListFormatProvider | null = null,
    options: ExtendFormatterOptions = {}
  ): ListFormatProvider {
    const mergedOptions: FormatterOptions = deepMerge({
      simpleList: simpleListProvider ? simpleListProvider.options.simpleList : undefined,
      objectList: objectListProvider ? objectListProvider.options.objectList : undefined,
    }, options);

    return new ListFormatProvider(name, mergedOptions, true);
  }

  /**
   * Create a new list formatter
   *
   * @param name Formatter name
   * @param options Formatter options
   * @returns List formatter
   */
  public constructor(name: string, options: FormatterOptions, custom?: boolean) {
    this.name = name;
    this.options = options;
    this.custom = custom ?? false;
  }

  /**
   * Weither the formatter supports simple lists
   *
   * @returns Weither the formatter supports simple lists
   */
  public supportsSimpleList(): boolean {
    return !!this.options.simpleList;
  }

  /**
   * Weither the formatter supports object lists
   *
   * @returns Weither the formatter supports object lists
   */
  public supportsObjectList(): boolean {
    return !!this.options.objectList;
  }

  /**
   * Weither the formatter supports pretty print, if false pretty is set to a static value
   *
   * @returns Weither the formatter supports pretty print
   */
  public supportsPretty(): boolean {
    return this.options.pretty === undefined;
  }

  /**
   * Weither the formatter supports indentation, if false indentation is set to a static value
   *
   * @returns Weither the formatter supports indentation
   */
  public supportsIndent(): boolean {
    return this.options.indent === undefined;
  }

  /**
   * Format list
   *
   * @param items List of items to format
   * @param columns List of columns to include
   * @param pretty Pretty print level
   * @param indent Indentation level
   * @returns Formatted list
   */
  public async formatSimpleList(
    items: ListData[],
    column: string,
    pretty: number = 0,
    indent: number = 0,
    parameters?: Record<string, string | number | boolean>
  ): Promise<string | null> {
    if (!this.options.simpleList) return null;

    const { simpleList, pretty: maxPretty, indent: overrideIndent } = this.options;
    const { valueEnclosure, valueAlias, valueEscape } = simpleList;
    const _parameters = parameters ?? (await this.queryParameters("simpleList"));
    const _pretty = Math.min(pretty, maxPretty ?? pretty);
    const _indent = overrideIndent ?? indent;

    if (!_parameters) return null;

    const mappedItems = items.map((item) =>
      this.encloseValue(item[column], valueAlias, valueEnclosure, valueEscape, _parameters)
    );

    return this.joinList(mappedItems, _pretty, _indent, 0, simpleList, _parameters);
  }

  /**
   * Format object list
   *
   * @param items List of items to format
   * @param columns List of columns to include
   * @param pretty Pretty print level
   * @param indent Indentation level
   * @returns Formatted object list
   */
  public async formatObjectList(
    items: ListData[],
    columns: string[],
    pretty: number = 0,
    indent: number = 0,
    parameters?: Record<string, string | number | boolean>
  ): Promise<string | null> {
    if (!this.options.objectList) return null;

    const { objectList, pretty: maxPretty, indent: overrideIndent } = this.options;
    const { itemFormat, header } = objectList;
    const _parameters = parameters ?? (await this.queryParameters("objectList"));
    const _pretty = Math.min(pretty, maxPretty ?? pretty);
    const _indent = overrideIndent ?? indent;

    if (!_parameters) return null;

    const mappedItems = items.map((item) => {
      const mappedItem = columns.map((column) =>
        this.encloseKeyValue(column, item[column], itemFormat, _pretty > 0, _parameters)
      );

      return this.joinList(mappedItem, _pretty, _indent, 1, itemFormat, _parameters);
    });

    const body = this.joinList(mappedItems, _pretty, _indent, 0, objectList, _parameters);

    const lines = [];
    if (header) lines.push(this.buildHeader(columns, _pretty, _indent, header, _parameters));
    lines.push(body);

    return _pretty > 0 ? lines.join("\n") : lines.join("");
  }

  public async queryParameters(
    type: "simpleList" | "objectList",
    token?: CancellationToken
  ): Promise<Record<string, string | number | boolean> | null> {
    const { parameters = {} } = this.options[type] ?? {};

    const result: Record<string, string | number | boolean> = {};

    for (const [key, param] of Object.entries(parameters)) {
      const { default: defaultValue, query } = param;
      if (query) {
        const option = await new Promise<string | number | boolean | null>((resolve) => {
          const entries: [string, string | number | boolean][] = query.options ? Object.entries(query.options) : [];
          const keys = entries.map(([key]) => key);
          const quickPick = window.createQuickPick<QuickPickItem & { value: string | number | boolean }>();
          quickPick.items = entries.map(([key, value]) => ({ label: key, value, picked: value === defaultValue }));

          quickPick.title = query.prompt;

          quickPick.onDidChangeValue(() => {
            // Inject user values into proposed values
            if (!keys.includes(quickPick.value)) {
              quickPick.items = [[quickPick.value, quickPick.value], ...entries].map(([key, value]) => ({
                label: key,
                value,
                picked: value === quickPick.value,
              }));
            }
          });

          quickPick.onDidAccept(() => {
            const selection = quickPick.activeItems[0];
            resolve(selection.value);
            quickPick.hide();
          });
          quickPick.onDidHide(() => {
            resolve(null);
            quickPick.dispose();
          });
          quickPick.show();

          token?.onCancellationRequested(() => {
            resolve(null);
            quickPick.hide();
          });
        });

        if (token?.isCancellationRequested) return null;
        else if (option !== null) result[key] = option;
        else return null; // User cancelled
      } else {
        result[key] = defaultValue ?? -1;
      }
    }

    return result;
  }

  private joinList(
    items: string[],
    pretty: number = 0,
    indent: number = 0,
    level: number = 0,
    {
      delimiter,
      delimitLastItem,
      delimitSameLine,
      enclosure,
      indentItems,
      indentEnclosure,
      itemPrefix = "",
    }: FormatterListOptions,
    parameters: Record<string, string | number | boolean> = {}
  ): string {
    indentItems = indentItems && indent * (indentItems === -1 ? level + 1 : indentItems);
    indentEnclosure = indentEnclosure && indent * (indentEnclosure === -1 ? level : indentEnclosure);
    const breakLine = pretty > level && !delimiter?.includes("\n");
    const itemIndent = indentItems && pretty > level ? " ".repeat(indentItems) : "";
    const sameLineItemIndent = delimitSameLine && pretty > level ? " ".repeat(delimitSameLine ?? 0) : "";
    const enclosureIndent = indentEnclosure && pretty > level ? " ".repeat(indentEnclosure) : "";
    const { first, rest } = typeof itemPrefix === "string" ? { first: itemPrefix, rest: itemPrefix } : itemPrefix;

    const lines = [];
    if (enclosure?.start) lines.push(this.templateString(enclosure.start, parameters));
    lines.push(
      ...items.map(
        (item, index) =>
          `${index === 0 || !delimitSameLine ? itemIndent : sameLineItemIndent}${this.templateString(index === 0 ? first : rest, {
            ...parameters,
            index,
          })}${item}${
            delimitLastItem || index < items.length - 1
              ? this.templateString(delimiter ?? "", { ...parameters, index })
              : ""
          }`
      )
    );
    if (enclosure?.end) lines.push(`${enclosureIndent}${this.templateString(enclosure.end, parameters)}`);

    if (breakLine && delimitSameLine) {
      lines[0] += "\n";
      lines[lines.length - 1] = `\n${lines[lines.length - 1]}`;
    }

    if (breakLine && !delimitSameLine) return lines.join("\n");
    else if (pretty > level && !delimiter?.includes("\n") && !delimitSameLine) return lines.join(" ");
    else return lines.join("");
  }

  private encloseKeyValue(
    key: string,
    value: string | number | boolean | null,
    {
      assignmentOperator,
      assignmentOperatorSpaced,
      keyEnclosure,
      keyEscape,
      keyAlias,
      valueEnclosure,
      valueEscape,
      valueAlias,
      noKeys,
    }: FormatterListObjectItemOptions,
    spaced?: boolean,
    parameters: Record<string, string | number | boolean> = {}
  ): string {
    if (noKeys) return this.encloseValue(value, valueAlias, valueEnclosure, valueEscape, parameters);

    const assignment = spaced ? assignmentOperatorSpaced ?? assignmentOperator : assignmentOperator;
    const enclosedKey = this.encloseValue(key, keyAlias, keyEnclosure, keyEscape, parameters);
    const enclosedValue = this.encloseValue(value, valueAlias, valueEnclosure, valueEscape, { ...parameters, key });

    return `${enclosedKey}${this.templateString(assignment, parameters)}${enclosedValue}`;
  }

  /**
   * Enclose values based on the value enclosure options
   *
   * @param value Value to enclose
   * @param valueAlias Value alias options
   * @param enclosureOptions Value enclosure options
   * @param escapeOptions Value escape options
   * @returns Enclosed value
   */
  private encloseValue(
    value: string | number | boolean | null,
    valueAlias: FormatterValueAlias = {},
    enclosureOptions: FormatterEnclosure = {},
    escapeOptions: FormatterValueEscape[] = [],
    parameters: Record<string, string | number | boolean> = {}
  ): string {
    if (value === true) return valueAlias.true ?? "true";
    else if (value === false) return valueAlias.false ?? "false";
    else if (value === null) return valueAlias.null ?? "null";
    else if (enclosureOptions instanceof Array)
      return this.encloseByRegex(value.toString(), enclosureOptions, parameters);

    let enclosure =
      typeof enclosureOptions === "string" || "start" in enclosureOptions
        ? enclosureOptions
        : enclosureOptions?.[typeof value as keyof FormatterValueEnclosure];
    let escapedValue = this.escapeValue(value.toString(), escapeOptions);

    if (enclosure === undefined) return escapedValue;

    const startTemplated = this.templateString(
      typeof enclosure === "string" ? enclosure : enclosure?.start ?? "",
      parameters
    );
    const endTemplated = this.templateString(
      typeof enclosure === "string" ? enclosure : enclosure?.end ?? "",
      parameters
    );

    return `${startTemplated}${escapedValue}${endTemplated}`;
  }

  /**
   * Enclose values based on regex enclosure options
   *
   * @param value value to enclose
   * @param regexEnclosure regex enclosure options
   * @returns Enclosed value
   */
  private encloseByRegex(
    value: string,
    regexEnclosure: FormatterRegexEnclosure[] = [],
    parameters: Record<string, string | number | boolean> = {}
  ): string {
    for (const keyEnclosureOption of regexEnclosure) {
      let { test, inverse, enclosure, replace } = keyEnclosureOption;
      const { start, end } = typeof enclosure === "string" ? { start: enclosure, end: enclosure } : enclosure;
      const regex = typeof test === "string" ? new RegExp(test.replace(/^\/(.*)\/$/, "$1")) : test;

      const startTemplated = this.templateString(start, parameters);
      const endTemplated = this.templateString(end, parameters);
      const replaceTemplated = replace !== undefined && this.templateString(replace, parameters);

      if (inverse) return regex.test(value) ? value : `${startTemplated}${value}${endTemplated}`;
      else if (replaceTemplated !== false) return value.replace(regex, replaceTemplated);
      else if (regex.test(value)) return `${startTemplated}${value}${endTemplated}`;
    }

    return value;
  }

  /**
   * Escape values based on the escape options
   *
   * @param value Value to escape
   * @param escapeOptions Escape options
   */
  private escapeValue(value: string, escapeOptions: FormatterValueEscape[] = []): string {
    let escapedValue = value;

    escapeOptions?.forEach((escapeOption) => {
      const { escape, replace } = escapeOption;
      const regex = this.buildEscapeRegex(escapeOption);

      if (escape) escapedValue = escapedValue.replace(regex, `${escape}$1`);
      else if (replace) escapedValue = escapedValue.replace(regex, replace);
    });

    return escapedValue;
  }

  private templateString(template: string, data: Record<string, string | number | boolean>): string {
    if (Object.keys(data).length === 0) return template;

    return template.replace(/\${(.*?)}/g, (_, template) => {
      const [tmp, key, modifier, factor] = /([a-z0-9_]+)\s*([+\-\*\/])?\s*(\d+)?/i.exec(template) ?? [];
      const value = key && data[key];

      if (!key || value === undefined) return template;
      if (modifier && factor) {
        const numericValue = Number(value);
        const numericFactor = Number(factor);

        switch (modifier) {
          case "+":
            return (numericValue + numericFactor).toString();
          case "-":
            return (numericValue - numericFactor).toString();
          case "*":
            return (numericValue * numericFactor).toString();
          case "/":
            return (numericValue / numericFactor).toString();
          default:
            return template;
        }
      }

      return value.toString();
    });
  }

  private buildHeader(
    columns: string[],
    pretty: number = 0,
    indent: number = 0,
    options: FormatterListHeaderOptions,
    parameters?: Record<string, string | number | boolean>
  ): string {
    const { keyEnclosure, keyEscape, keyAlias } = options;
    const mappedColumns = columns.map((column) =>
      this.encloseValue(column, keyAlias, keyEnclosure, keyEscape, parameters)
    );
    return this.joinList(mappedColumns, pretty, indent, 0, options, parameters);
  }

  /**
   * Build escape regex for values based on the escape options
   *
   * @param escapeOptions Escape options
   */
  private buildEscapeRegex({ pattern, escape }: FormatterValueEscape): RegExp {
    if (typeof pattern !== "string") return pattern;

    // TODO: ignore already escaped characters
    const regexParts = /\/(.*)\/([gimuy]*)$/.exec(pattern);
    if (regexParts) return new RegExp(regexParts[1], regexParts[2]);

    return new RegExp(`(?<!${escape})(${pattern})`, "g");
  }
}

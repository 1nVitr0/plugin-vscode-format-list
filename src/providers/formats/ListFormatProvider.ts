import {
  ExtendFormatterOptions,
  FormatterHeaderOptions,
  FormatterKeyEnclosure,
  FormatterListOptions,
  FormatterListTypes,
  FormatterObjectListOptions,
  FormatterOptions,
  FormatterValueAlias,
  FormatterValueEnclosure,
  FormatterValueEscape,
} from "../../types/Formatter";
import { ListData } from "../../types/List";
import defaults from "defaults";

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
    const mergedOptions: FormatterOptions = defaults(options as Partial<FormatterOptions>, {
      simpleList: simpleListProvider ? simpleListProvider.options.simpleList : undefined,
      objectList: objectListProvider ? objectListProvider.options.objectList : undefined,
    });

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
  public formatSimpleList(items: ListData[], column: string, pretty: number = 0, indent: number = 0): string | null {
    if (!this.options.simpleList) return null;

    const { simpleList } = this.options;
    const { valueEnclosure, valueAlias, valueEscape } = simpleList;

    const mappedItems = items.map((item) => this.encloseValue(item[column], valueAlias, valueEnclosure, valueEscape));

    return this.joinList(mappedItems, pretty, indent, 0, simpleList);
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
  public formatObjectList(items: ListData[], columns: string[], pretty: number = 0, indent: number = 0): string | null {
    if (!this.options.objectList) return null;

    const { objectList } = this.options;
    const { itemFormat, delimiter = "", indentItems, header } = objectList;

    const mappedItems = items.map((item) => {
      const mappedItem = columns.map((column) => this.encloseKeyValue(column, item[column], objectList, pretty > 0));

      return this.joinList(mappedItem, pretty, indentItems === false ? 0 : indent, 1, itemFormat);
    });

    if (itemFormat.delimitSameLine)
      mappedItems.splice(0, mappedItems.length, mappedItems.join(pretty > 0 ? `${delimiter} ` : delimiter));
    const inner = this.joinList(mappedItems, pretty, indent, 0, objectList);

    const lines = [];
    if (header) lines.push(this.buildHeader(columns, pretty, indent, header));
    lines.push(inner);

    return pretty > 0 ? lines.join("\n") : lines.join("");
  }

  private joinList(
    items: string[],
    pretty: number = 0,
    indent: number = 0,
    level: number = 0,
    { delimiter, delimitLastItem, enclosure, indentItems, itemPrefix = "" }: FormatterListOptions
  ): string {
    const breakLine = pretty > level && !delimiter?.includes("\n");
    const indentEnclosure = pretty >= level ? " ".repeat(indent * level) : "";
    const indentItem = indentItems && pretty > level ? " ".repeat(indent * (level + 1)) : "";
    const { first, rest } = typeof itemPrefix === "string" ? { first: itemPrefix, rest: itemPrefix } : itemPrefix;

    const lines = [];
    if (enclosure?.start) lines.push(enclosure.start);
    lines.push(
      ...items.map(
        (item, index) =>
          `${indentItem}${index === 0 ? first : rest}${item}${
            delimitLastItem || index < items.length - 1 ? delimiter : ""
          }`
      )
    );
    if (enclosure?.end) lines.push(`${indentEnclosure}${enclosure.end}`);

    if (breakLine) return lines.join("\n");
    else if (pretty > 0 && !delimiter?.includes("\n")) return lines.join(" ");
    else return lines.join("");
  }

  private encloseKeyValue(
    key: string,
    value: string | number | boolean | null,
    {
      assignmentOperator,
      assignmentOperatorSpaced,
      keyEnclosure,
      valueEnclosure,
      valueEscape,
      valueAlias,
      noKeys,
    }: FormatterObjectListOptions,
    spaced?: boolean
  ): string {
    if (noKeys) return this.encloseValue(value, valueAlias, valueEnclosure, valueEscape);

    const assignment = spaced ? assignmentOperatorSpaced ?? assignmentOperator : assignmentOperator;
    const enclosedKey = this.encloseKey(key, keyEnclosure);
    const enclosedValue = this.encloseValue(value, valueAlias, valueEnclosure, valueEscape);

    return `${enclosedKey}${assignment}${enclosedValue}`;
  }

  /**
   * Enclose keys based on the key enclosure options
   *
   * @param key Key to enclose
   * @param keyEnclosure Key enclosure options
   * @returns Enclosed key
   */
  private encloseKey(key: string, keyEnclosure: FormatterKeyEnclosure[] = []): string {
    for (const keyEnclosureOption of keyEnclosure) {
      let { test, inverse, enclosure, replace } = keyEnclosureOption;
      const { start, end } = typeof enclosure === "string" ? { start: enclosure, end: enclosure } : enclosure;
      const regex = typeof test === "string" ? new RegExp(test) : test;

      if (inverse) return regex.test(key) ? key : `${start}${key}${end}`;
      else if (replace) return key.replace(regex, replace);
      else if (regex.test(key)) return `${start}${key}${end}`;
    }

    return key;
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
    enclosureOptions: FormatterValueEnclosure = {},
    escapeOptions: FormatterValueEscape[] = []
  ): string {
    if (value === true) return valueAlias.true ?? "true";
    else if (value === false) return valueAlias.false ?? "false";
    else if (value === null) return valueAlias.null ?? "null";
    let enclosure = enclosureOptions?.[typeof value as keyof FormatterValueEnclosure];
    let escapedValue = this.escapeValue(value.toString(), escapeOptions);

    if (typeof enclosure === "string") return `${enclosure}${escapedValue}${enclosure}`;
    else if (typeof enclosure === "object") return `${enclosure.start}${escapedValue}${enclosure.end}`;

    return escapedValue;
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

  private buildHeader(
    columns: string[],
    pretty: number = 0,
    indent: number = 0,
    options: FormatterHeaderOptions
  ): string {
    const { keyEnclosure, pretty: allowPretty } = options;
    const mappedColumns = columns.map((column) => this.encloseKey(column, keyEnclosure));
    return this.joinList(mappedColumns, allowPretty ? pretty : 0, indent, 0, options);
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

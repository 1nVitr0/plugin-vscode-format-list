import * as deepMerge from "deepmerge";
import { Primitive } from "type-fest";
import { CancellationToken, QuickPickItem, l10n } from "vscode";
import { showFreeSoloQuickPick } from "../../input/freeSoloQuickPick";
import {
  ExtendFormatterOptions,
  FormatterListHeaderOptions,
  FormatterListObjectItemOptions,
  FormatterListOptions,
  FormatterListParameterFormatOptions,
  FormatterListParameterFormatPrefixedOptions,
  FormatterListTypes,
  FormatterOptions,
  FormatterParameterExpansionOptions,
  FormatterPipe,
  FormatterRegexEnclosure,
  FormatterValueAlias,
  FormatterValueEnclosure,
  FormatterValueEscape,
  ParameterList,
} from "../../types/Formatter";
import { ListData } from "../../types/List";

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
    options: ExtendFormatterOptions = { name }
  ): ListFormatProvider {
    const mergedOptions: FormatterOptions = deepMerge(
      {
        simpleList: simpleListProvider ? simpleListProvider.options.simpleList : undefined,
        objectList: objectListProvider ? objectListProvider.options.objectList : undefined,
      },
      options,
      {
        // Merge formatter regex enclosures by their id
        arrayMerge: (target, source) => {
          let hasIds = true;
          const generateLookup = (lookup: Record<string, FormatterRegexEnclosure>, item: FormatterRegexEnclosure) => {
            if (!item.id) hasIds = false;
            lookup[item.id] = item;
            return lookup;
          };
          const sourceLookup = source.reduce(generateLookup, {});
          const targetLookup = target.reduce(generateLookup, {});

          if (hasIds) return Object.values({ ...targetLookup, ...sourceLookup });
          else return target;
        },
        clone: true,
      }
    );

    return new ListFormatProvider(options.name, mergedOptions, true);
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
   * @param token Cancellation token
   * @param parameters Parameters to inject into templates
   * @returns Formatted list
   */
  public async formatSimpleList(
    items: ListData[],
    column: string,
    pretty: number = 0,
    indent: number = 0,
    parameters?: ParameterList,
    token?: CancellationToken
  ): Promise<string | null> {
    if (!this.options.simpleList) return null;

    const { simpleList, pretty: maxPretty, indent: overrideIndent } = this.options;
    const _parameters = parameters ?? (await this.queryParameters("simpleList", [column]));
    const _pretty = Math.min(pretty, maxPretty ?? pretty);
    const _indent = overrideIndent ?? indent;

    if (!_parameters || token?.isCancellationRequested) return null;

    const mappedItems = items.map((item) =>
      this.encloseValue(
        item[column],
        {
          ..._parameters,
          item,
          key: column,
          value: item[column],
        },
        simpleList
      )
    );

    return !token?.isCancellationRequested
      ? this.joinList(mappedItems, _pretty, _indent, 0, simpleList, _parameters)
      : null;
  }

  /**
   * Format object list
   *
   * @param items List of items to format
   * @param columns List of columns to include
   * @param pretty Pretty print level
   * @param indent Indentation level
   * @param token Cancellation token
   * @param parameters Parameters to inject into templates
   * @returns Formatted object list
   */
  public async formatObjectList(
    items: ListData[],
    columns: string[],
    pretty: number = 0,
    indent: number = 0,
    parameters?: ParameterList,
    token?: CancellationToken
  ): Promise<string | null> {
    if (!this.options.objectList) return null;

    const { objectList, pretty: maxPretty, indent: overrideIndent } = this.options;
    const { itemFormat, header } = objectList;
    const _parameters = parameters ?? (await this.queryParameters("objectList", columns));
    const _pretty = Math.min(pretty, maxPretty ?? pretty);
    const _indent = overrideIndent ?? indent;

    if (!_parameters || token?.isCancellationRequested) return null;

    const mappedItems = items.map((item) => {
      if (token?.isCancellationRequested) return "";

      const mappedItem = columns.map((column) =>
        this.encloseKeyValue(column, item[column], itemFormat, _pretty > 0, {
          ..._parameters,
          item,
          key: column,
          value: item[column],
        })
      );

      return this.joinList(mappedItem, _pretty, _indent, 1, itemFormat, { ..._parameters, item });
    });
    if (token?.isCancellationRequested) return null;
    const headerItem = header && this.buildHeader(columns, _pretty, _indent, header, _parameters);

    if (token?.isCancellationRequested) return null;
    if (header?.afterEnclosure && headerItem) mappedItems.unshift(headerItem);
    const body = this.joinList(mappedItems, _pretty, _indent, 0, objectList, _parameters);

    const lines = [];
    if (token?.isCancellationRequested) return null;
    if (headerItem && !header?.afterEnclosure) lines.push(headerItem);
    lines.push(body);

    if (token?.isCancellationRequested) return null;
    return _pretty > 0 ? lines.join("\n") : lines.join("");
  }

  /**
   * Query the user for set parameters, that do not have a default-only value
   *
   * @param type Type of the list to query parameters for
   * @param token Cancellation token
   * @returns Parameters as a key-value object
   */
  public async queryParameters(
    type: "simpleList" | "objectList",
    columns: string[] = []
  ): Promise<ParameterList | null> {
    const { parameters = {} } = this.options[type] ?? {};

    const result: ParameterList = {};

    for (const [key, param] of Object.entries(parameters)) {
      const templateParams = { type, columnCount: columns.length, key };
      const { default: defaultValue, query } = param;
      if (query) {
        const option = await showFreeSoloQuickPick(
          query.options === "columns"
            ? columns.map<QuickPickItem & { value: string | number | boolean }>((value) => ({
                label: value,
                value,
              }))
            : Object.entries(query.options ?? {}).map<QuickPickItem & { value: string | number | boolean }>(
                ([key, value]) => ({
                  label: l10n.t(key),
                  value,
                  picked: value === defaultValue,
                })
              ),
          {
            ignoreFocusOut: true,
            title: l10n.t(query.prompt),
            placeholder: query.placeholder && l10n.t(query.placeholder),
            createInputItem: (input) => ({
              label: query.customInputLabel ? l10n.t(query.customInputLabel, { input }) : input,
              value: input,
            }),
          }
        );

        if (option === null) return null;

        result[key] =
          typeof option.value === "string" ? this.templateString(option.value, templateParams, {}) : option.value;
      } else {
        result[key] =
          typeof defaultValue === "string" ? this.templateString(defaultValue, templateParams, {}) : defaultValue ?? -1;
      }
    }

    return result;
  }

  /**
   * Format a list of strings using the formatter options
   *
   * @param items string items
   * @param pretty if true or >= level, separate items by newlines and indent
   * @param indent number of spaces to indent
   * @param level current level of pretty print
   * @param options formatter options
   * @param parameters parameters to inject into templates
   * @returns
   */
  private joinList(
    items: string[],
    pretty: number = 0,
    indent: number = 0,
    level: number = 0,
    options: FormatterListOptions & FormatterParameterExpansionOptions,
    parameters: ParameterList = {}
  ): string {
    let {
      delimiter,
      delimitLastItem,
      delimitSameLine,
      enclosure,
      indentItems,
      indentEnclosure,
      itemPrefix = "",
    } = options;

    indentItems = indentItems && indent * (indentItems === -1 ? level + 1 : indentItems);
    indentEnclosure = indentEnclosure && indent * (indentEnclosure === -1 ? level : indentEnclosure);
    const breakLine = pretty > level && !delimiter?.includes("\n");
    const itemIndent = indentItems && pretty > level ? " ".repeat(indentItems) : "";
    const sameLineItemIndent = delimitSameLine && pretty > level ? " ".repeat(delimitSameLine ?? 0) : "";
    const enclosureIndent = indentEnclosure && pretty > level ? " ".repeat(indentEnclosure) : "";
    const { first, rest } = typeof itemPrefix === "string" ? { first: itemPrefix, rest: itemPrefix } : itemPrefix;

    const lines = [];
    if (enclosure?.start) lines.push(this.templateString(enclosure.start, parameters, options));
    lines.push(
      ...items.map(
        (item, index) =>
          `${index === 0 || !delimitSameLine ? itemIndent : sameLineItemIndent}${this.templateString(
            index === 0 ? first : rest,
            { ...parameters, index },
            options
          )}${item}${
            delimitLastItem || index < items.length - 1
              ? this.templateString(delimiter ?? "", { ...parameters, index }, options)
              : ""
          }`
      )
    );
    if (enclosure?.end) lines.push(`${enclosureIndent}${this.templateString(enclosure.end, parameters, options)}`);

    if (breakLine && delimitSameLine) {
      lines[0] += "\n";
      lines[lines.length - 1] = `\n${lines[lines.length - 1]}`;
    }

    if (breakLine && !delimitSameLine) return lines.join("\n");
    else if (pretty > level && !delimiter?.includes("\n") && !delimitSameLine) return lines.join(" ");
    else return lines.join("");
  }

  /**
   * Enclose key-value pairs based on the key and value enclosure options
   * If noKeys is true, only the value will be enclosed
   *
   * @param key Key to enclose
   * @param value Value to enclose
   * @param options Key-value enclosure options
   * @param spaced If true, add a space between the key and value
   * @param parameters Parameters to inject into templates
   * @returns Enclosed key-value pair
   */
  private encloseKeyValue(
    key: string,
    value: Exclude<Primitive, undefined>,
    options: FormatterListObjectItemOptions,
    spaced?: boolean,
    parameters: ParameterList = {}
  ): string {
    const { assignmentOperator, assignmentOperatorSpaced, noKeys } = options;

    if (noKeys) return this.encloseValue(value, parameters, options);

    const assignment = spaced ? assignmentOperatorSpaced ?? assignmentOperator : assignmentOperator;
    const enclosedKey = this.encloseValue(key, parameters, options, "key");
    const enclosedValue = this.encloseValue(value, { ...parameters, key }, options);

    return `${enclosedKey}${this.templateString(assignment, parameters, options)}${enclosedValue}`;
  }

  /**
   * Enclose values based on the value enclosure options
   *
   * @param value Value to enclose
   * @param valueType Type of value to enclose ("key" or "value")
   * @param parameters Parameters to inject into templates
   * @param options Value enclosure options
   * @returns Enclosed value
   */
  private encloseValue<T extends "key" | "value">(
    value: Exclude<Primitive, undefined>,
    parameters: ParameterList = {},
    options: FormatterParameterExpansionOptions & FormatterListParameterFormatPrefixedOptions<T> = {},
    valueType: T = "value" as T
  ): string {
    const {
      [`${valueType}Alias` as "alias"]: aliasOptions = {} as FormatterValueAlias,
      [`${valueType}Enclosure` as "enclosure"]: enclosureOptions = {} as FormatterValueEnclosure,
      [`${valueType}Escape` as "escape"]: escapeOptions = [] as FormatterValueEscape[],
    } = options as FormatterListParameterFormatOptions;

    const type = typeof value === "number"! && !isFinite(value as number) ? "string" : typeof value;
    let enclosure =
      enclosureOptions instanceof Array || typeof enclosureOptions === "string" || "start" in enclosureOptions
        ? enclosureOptions
        : enclosureOptions?.[type as keyof FormatterValueEnclosure];

    value =
      value === true
        ? aliasOptions.true ?? "true"
        : value === false
        ? aliasOptions.false ?? "false"
        : value === null
        ? aliasOptions.null ?? "null"
        : value;
    value = this.escapeValue(value.toString(), escapeOptions);

    if (enclosure === undefined) return value;
    else if (enclosure instanceof Array) return this.encloseByRegex(value, enclosure, parameters, options);

    const startTemplated = this.templateString(
      typeof enclosure === "string" ? enclosure : enclosure?.start ?? "",
      parameters,
      options
    );
    const endTemplated = this.templateString(
      typeof enclosure === "string" ? enclosure : enclosure?.end ?? "",
      parameters,
      options
    );

    return `${startTemplated}${value}${endTemplated}`;
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
    parameters: ParameterList = {},
    options: FormatterParameterExpansionOptions = {}
  ): string {
    const activeEnclosures = regexEnclosure.filter((enclosure) => !enclosure.disabled);

    for (const keyEnclosureOption of activeEnclosures) {
      let { test, inverse, enclosure, replace } = keyEnclosureOption;
      const { start, end } = typeof enclosure === "string" ? { start: enclosure, end: enclosure } : enclosure;
      const regex = typeof test === "string" ? new RegExp(test.replace(/^\/(.*)\/$/, "$1")) : test;

      const startTemplated = this.templateString(start, parameters, options);
      const endTemplated = this.templateString(end, parameters, options);
      const replaceTemplated = replace !== undefined && this.templateString(replace, parameters, options);

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

    escapeOptions?.forEach((esc) => {
      const regex = this.buildEscapeRegex(esc);

      if ("escape" in esc) escapedValue = escapedValue.replace(regex, `${esc.escape}$1`);
      else if ("replace" in esc) escapedValue = escapedValue.replace(regex, esc.replace);
    });

    return escapedValue;
  }

  private templateString(template: string, data: ParameterList, options: FormatterParameterExpansionOptions): string {
    if (Object.keys(data).length === 0) return template;

    return template.replace(/\$(\[[^\]]+\][*?])?{([^}]+)}/g, (_, repeat: string = "", content: string = "") => {
      const [, repeatKey, repeatModifier, repeatFactor, repeatType] =
        /^\[([a-z0-9_]+)\s*([+\-\*\/%><=!\.])?\s*([\$a-z0-9_\.]+)?\]([*?])$/i.exec(repeat) ?? [];
      const [param, ...pipes] = content.split(/\s*\|\s*/);
      const [, key, modifier, factor] =
        /^([a-z0-9_]+|"[^"]+"|'[^']+')\s*([+\-\*\/%><=!\.])?\s*([\$a-z0-9_\.]+)?$/i.exec(param) ?? [];
      const value = /"[^"]*"|'[^']*'/g.test(key)
        ? key.slice(1, -1)
        : this.getTemplateParameter(data, key, modifier, factor);
      const pipe = this.buildPipe(pipes as FormatterPipe[], data, options);

      if (!repeat || !value) return value !== null ? (pipe(value) ?? "")?.toString() : content;

      const repeatValue = this.getTemplateParameter(data, repeatKey, repeatModifier, repeatFactor);
      const repeatNumber = Number(repeatValue);
      const repeatBoolean = !repeatValue || ["", "null", "false", "0"].includes(repeatValue.toString()) ? false : true;

      switch (repeatType) {
        case "*":
          return repeatNumber && repeatNumber > 0 ? (pipe(value.toString().repeat(repeatNumber)) ?? "").toString() : "";
        case "?":
          return repeatBoolean ? (pipe(value) ?? "").toString() : "";
        default:
          throw new Error(`Invalid repeat type: ${repeatType}`);
      }
    });
  }

  private buildPipe(pipes: FormatterPipe[], parameters: ParameterList, options: FormatterParameterExpansionOptions) {
    return pipes.reduce(
      (fn, pipe) => {
        switch (pipe) {
          case "value":
            return (value) => this.encloseValue(fn(value), parameters, options);
          case "key":
            return (value) => this.encloseValue(fn(value), parameters, options, "key");
          default:
            return fn;
        }
      },
      (value: Exclude<Primitive, undefined>): Exclude<Primitive, undefined> => value
    );
  }

  private getTemplateParameter(
    data: ParameterList,
    key: string,
    modifier?: string,
    factor?: string
  ): Exclude<Primitive, undefined> {
    const value = key && data[key];

    if (value === undefined || !modifier || !factor) return value?.toString() ?? null;

    const numericValue = Number(value);
    const numericFactor = Number(factor);

    switch (modifier) {
      case "+":
        return numericValue + numericFactor;
      case "-":
        return numericValue - numericFactor;
      case "*":
        return numericValue * numericFactor;
      case "/":
        return numericValue / numericFactor;
      case "%":
        return numericValue % numericFactor;
      case ">":
        return numericValue > numericFactor;
      case "<":
        return numericValue < numericFactor;
      case "=":
        return numericValue === numericFactor;
      case "!":
        return numericValue !== numericFactor;
      case ".":
        const path =
          factor.split(".").reduce<ParameterList[string] | null>((value, path) => {
            if (value === null || typeof value !== "object") return null;
            if (path.startsWith("$")) {
              const expandedPath = data[path.slice(1)];
              if (typeof expandedPath !== "string" && typeof expandedPath !== "number") return null;
              return value[expandedPath];
            }
            return value[path];
          }, value) ?? null;
        return typeof path === "object" ? null : path;
    }

    return null;
  }

  /**
   * Build header for object list
   *
   * @param columns selected columns
   * @param pretty PIf truthy, separate items by newlines and indent
   * @param indent Indentation level
   * @param options Header options
   * @param parameters Parameters to inject into templates
   * @returns Formatted header
   */
  private buildHeader(
    columns: string[],
    pretty: number = 0,
    indent: number = 0,
    options: FormatterListHeaderOptions,
    parameters?: ParameterList
  ): string {
    const mappedColumns = columns.map((column) =>
      this.encloseValue(column, { ...parameters, key: column }, options, "key")
    );
    return this.joinList(mappedColumns, pretty, indent, 0, options, parameters);
  }

  /**
   * Build escape regex for values based on the escape options
   *
   * @param escapeOptions Escape options
   */
  private buildEscapeRegex(options: FormatterValueEscape): RegExp {
    const { pattern } = options;
    if (typeof pattern !== "string") return pattern;

    // TODO: ignore already escaped characters
    const regexParts = /\/(.*)\/([gimuy]*)$/.exec(pattern);
    if (regexParts) return new RegExp(regexParts[1], regexParts[2]);

    return "escape" in options ? new RegExp(`(?<!${options.escape})(${pattern})`, "g") : new RegExp(pattern, "g");
  }
}

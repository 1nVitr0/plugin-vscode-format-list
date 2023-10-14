import { PartialDeep, RequireAtLeastOne, Simplify } from "type-fest";

/** Indentation width, true is equivalent to 2 spaces */
export type Indent = number;

/** Pretty print depth, true is equivalent to an infinite depth */
export type Pretty = 0 | 1 | 2 | -1;

/** Boundary options for value-like items */
export interface FormatterBoundaryEnclosure {
  /** Start boundary */
  start: string;
  /** End boundary */
  end: string;
}

/** Enclosure options for key-like items */
export interface FormatterRegexEnclosure {
  /** Regular expression, that tests if the key must be enclosed */
  test: RegExp | `/${string}/${string}`;
  /** Inverse the test */
  inverse?: boolean;
  /** Enclosure boundaries or char, if char, it's used for both start and end */
  enclosure: FormatterBoundaryEnclosure | string;
  /** Replacement string, indexes like `$1` can be used */
  replace?: string;
}

/** Enclosure options for value types */
export interface FormatterValueEnclosure {
  /** Enclosure for string values, if char, it's used for both start and end */
  string?: FormatterBoundaryEnclosure | string;
  /** Enclosure for number values, if char, it's used for both start and end */
  number?: FormatterBoundaryEnclosure | string;
  /** Enclosure for boolean values, if char, it's used for both start and end */
  boolean?: FormatterBoundaryEnclosure | string;
  /** Enclosure for null values, if char, it's used for both start and end */
  null?: FormatterBoundaryEnclosure | string;
}

export type FormatterEnclosure =
  | FormatterBoundaryEnclosure
  | FormatterValueEnclosure
  | FormatterRegexEnclosure[]
  | string;

/** Escape options for value-like items */
export interface FormatterValueEscape {
  /** Regular expression, that matches parts of the value to be escaped */
  pattern: RegExp | string;
  /** Escape char */
  escape: string;
  /** Replacement string, indexes like `$1` can be used */
  replace?: string;
}

/** Alias options for value-like items */
export interface FormatterValueAlias {
  /** Alias for true values */
  true?: string;
  /** Alias for false values */
  false?: string;
  /** Alias for null values */
  null?: string;
}

/** Prefix options for list items */
export interface ItemPrefix {
  /** Prefix for the first item */
  first: string;
  /** Prefix for the rest of the items */
  rest: string;
}

/** Formatter query parameters, can be used to expand formatter strings */
interface FormatterParameterBase<T extends string | number | boolean> {
  /** Type of the parameter */
  type: T extends string ? "string" : T extends number ? "number" : "boolean";
  /** Default value, if no query is specified this will always be set */
  default?: T;
  /** Query options, if specified, the user will be prompted to enter a value */
  query?: RequireAtLeastOne<
    {
      /** If true, the user can enter any value, otherwise the user can only select from the given options */
      allowInput?: boolean;
      /** Prompt shown to the user */
      prompt: string;
      /** Placeholder shown in the input field */
      placeholder?: string;
      /** Options for the user to select from */
      options?: Record<string, T>;
    },
    "allowInput" | "options"
  >;
}

/** Formatter query parameters, can be used to expand formatter strings */
export type FormatterParameter = Simplify<
  | RequireAtLeastOne<FormatterParameterBase<string>, "default" | "query">
  | RequireAtLeastOne<FormatterParameterBase<number>, "default" | "query">
  | RequireAtLeastOne<FormatterParameterBase<boolean>, "default" | "query">
>;

/** Base options for lists */
export interface FormatterListOptions {
  /** Enclosure around entire list */
  enclosure?: FormatterBoundaryEnclosure;
  /** Delimiter between items */
  delimiter?: string;
  /** If true, generate a delimiter for the last item as well */
  delimitLastItem?: boolean;
  /** Prefix for each item */
  itemPrefix?: ItemPrefix | string;
  /** Enclosure around each item */
  itemEnclosure?: FormatterEnclosure;
  /** If true indent items */
  indentItems?: Indent;
  /** If true, indent enclosure */
  indentEnclosure?: Indent;
  /** If false, items are separated by newlines, otherwise next spaced by given number of spaces */
  delimitSameLine?: Indent;
}

/** Options for values */
export interface FormatterListValueOptions {
  /** Enclosure around each item */
  valueEnclosure?: FormatterEnclosure;
  /** Escape options for each item */
  valueEscape?: FormatterValueEscape[];
  /** Alias options for each item */
  valueAlias?: FormatterValueAlias;
}

/** Options for keys */
export interface FormatterListKeyOptions {
  /** Enclosure around each key */
  keyEnclosure?: FormatterEnclosure;
  /** Escape options for each key */
  keyEscape?: FormatterValueEscape[];
  /** Alias options for each key */
  keyAlias?: FormatterValueAlias;
  /** If true, don't generate keys for objects */
  noKeys?: boolean;
}

/** Options for assignment between key value pairs */
export interface FormatterListAssignmentOptions {
  /** Assignment operator between object key and value */
  assignmentOperator: string;
  /** Pretty assignment operator between object key and value */
  assignmentOperatorSpaced?: string;
}

/** Options for object list items */
export interface FormatterListObjectItemOptions
  extends FormatterListOptions,
    FormatterListKeyOptions,
    FormatterListAssignmentOptions,
    FormatterListValueOptions {}

/** Options for list headers */
export interface FormatterListHeaderOptions extends FormatterListOptions, FormatterListKeyOptions {}

/** Options for output of generated lists */
export interface GeneratedListOptions {
  /** Example result shown in quick picks */
  example?: string;
  /** Keyed List of available parameters queried when formatting the lst */
  parameters?: Record<string, FormatterParameter>;
  /** Header options for csv-like formats, usually noKeys is set to `false` */
  header?: FormatterListHeaderOptions;
}

/** Options for simple lists */
export interface FormatterSimpleListOptions
  extends FormatterListOptions,
    GeneratedListOptions,
    FormatterListValueOptions {}

/** Options for object lists */
export interface FormatterObjectListOptions extends FormatterListOptions, GeneratedListOptions {
  /** Format options for each item */
  itemFormat: FormatterListObjectItemOptions;
}

/** List options */
export interface FormatterListTypes {
  /** Simple list options, if not specified simple lists are not supported */
  simpleList?: FormatterSimpleListOptions;
  /** Object list options, if not specified object lists are not supported */
  objectList?: FormatterObjectListOptions;
}

/** Formatter options */
export interface FormatterOptions extends FormatterListTypes {
  /** Default pretty print level */
  pretty?: Pretty;
  /** Default indent level */
  indent?: Indent;
}

export type ExtendableFormatterListOptions<T extends FormatterSimpleListOptions> = {
  /** Language to use as base config */
  base: DefaultFormatterLanguages;
} & PartialDeep<T>;

export interface ExtendFormatterOptions extends PartialDeep<FormatterOptions> {
  simpleList?: FormatterSimpleListOptions | ExtendableFormatterListOptions<FormatterSimpleListOptions>;
  objectList?: FormatterObjectListOptions | ExtendableFormatterListOptions<FormatterObjectListOptions>;
}

export interface CustomFormatters {
  [key: string]: ExtendFormatterOptions;
}

export type DefaultFormatterLanguages =
  | "javascript"
  | "json"
  | "yaml"
  | "xml"
  | "markdown"
  | "php"
  | "c"
  | "cpp"
  | "csv"
  | "csvCustom"
  | "java"
  | "textList"
  | "sql";

export type DefaultDataLanguages =
  | "javascript"
  | "typescript"
  | "json"
  | "yaml"
  | "xml"
  | "php"
  | "c"
  | "cpp"
  | "csv"
  | "java";

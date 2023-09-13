import { PartialDeep } from "type-fest";

/** Indentation width, true is equivalent to 2 spaces */
export type Indent = number | boolean;

/** Pretty print depth, true is equivalent to an infinite depth */
export type Pretty = number | boolean;

/** Boundary options for value-like items */
export interface FormatterValueBoundary {
  /** Start boundary */
  start: string;
  /** End boundary */
  end: string;
}

/** Enclosure options for key-like items */
export interface FormatterKeyEnclosure {
  /** Regular expression, that tests if the key must be enclosed */
  test: RegExp | `/${string}/${string}`;
  /** Inverse the test */
  inverse?: boolean;
  /** Enclosure boundaries or char, if char, it's used for both start and end */
  enclosure: FormatterValueBoundary | string;
  /** Replacement string, indexes like `$1` can be used */
  replace?: string;
}

/** Enclosure options for value types */
export interface FormatterValueEnclosure {
  /** Enclosure for string values, if char, it's used for both start and end */
  string?: FormatterValueBoundary | string;
  /** Enclosure for number values, if char, it's used for both start and end */
  number?: FormatterValueBoundary | string;
  /** Enclosure for boolean values, if char, it's used for both start and end */
  boolean?: FormatterValueBoundary | string;
  /** Enclosure for null values, if char, it's used for both start and end */
  null?: FormatterValueBoundary | string;
}

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

export interface FormatterListOptions {
  /** Enclosure around entire list */
  enclosure?: FormatterValueBoundary;
  /** Delimiter between items */
  delimiter?: string;
  /** If true, generate a delimiter for the last item as well */
  delimitLastItem?: boolean;
  /** Prefix for each item */
  itemPrefix?: ItemPrefix | string;
  /** If true indent items */
  indentItems?: Indent;
  /** If false, items are separated by newlines, otherwise next sspaced by given number of spaces */
  delimitSameLine?: Indent;
}

export interface FormatterHeaderOptions extends FormatterListOptions {
  /** Enclosure around each key */
  keyEnclosure?: FormatterKeyEnclosure[];
  /** If true, header may contain line breaks */
  pretty?: Pretty;
}

/** Options for simple lists */
export interface FormatterSimpleListOptions extends FormatterHeaderOptions {
  /** Example result shown in quick picks */
  example?: string;
  /** Enclosure around each item */
  valueEnclosure?: FormatterValueEnclosure;
  /** Escape options for each item */
  valueEscape?: FormatterValueEscape[];
  /** Alias options for each item */
  valueAlias?: FormatterValueAlias;
  /** Header options for csv-like formats, usually noKeys is set to `false` */
  header?: FormatterHeaderOptions;
}

/** Options for object lists */
export interface FormatterObjectListOptions extends FormatterSimpleListOptions {
  /** Format options for each item */
  itemFormat: FormatterListOptions;
  /** Assignment operator between object key and value */
  assignmentOperator: string;
  /** Pretty assignment operator between object key and value */
  assignmentOperatorSpaced?: string;
  /** Enclosure around each key */
  keyEnclosure?: FormatterKeyEnclosure[];
  /** If true, don't generate keys for objects */
  noKeys?: boolean;
  /** If false, item enclosures will be on a new line, otherwise spaced by given number of spaces */
  itemEnclosureSameLine?: Indent;
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

type ExtendableFormatterListOptions<T extends FormatterSimpleListOptions> = {
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
  | "json"
  | "yaml"
  | "markdown"
  | "php"
  | "cpp"
  | "csv"
  | "ruby"
  | "commaSeparatedList"
  | "tabSeparatedList"
  | "spaceSeparatedList"
  | "newLineSeparatedList"
  | "enclosedCommaSeparatedList"
  | "enclosedTabSeparatedList"
  | "enclosedSpaceSeparatedList";

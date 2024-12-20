import { PartialDeep, Primitive, RequireAtLeastOne, Simplify } from "type-fest";
import { ListDataContext } from "./List";

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
  /** Unique id, used to identify the enclosure and override it in extending formats */
  id: string;
  /**
   * Regular expression, that tests if the key must be enclosed
   *
   * @TJS-type string
   * @pattern ^\/.*\/[gimuy]*$
   */
  test: RegExp | `/${string}/${string}`;
  /** Inverse the test */
  inverse?: boolean;
  /** If true, the enclosure is disabled, used in extending formats to disabled enclosures */
  disabled?: boolean;
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

/** Replace options for value-like items */
export type FormatterValueEscape = {
  /**
   * Regular expression, that matches parts of the value to be escaped
   *
   * @TJS-type string
   * @pattern ^\/.*\/[gimuy]*$
   */
  pattern: RegExp | string;
} & (
  | {
      /** Escape char */
      escape: string;
    }
  | {
      /** Replacement string, indexes like `$1` can be used */
      replace: string;
    }
);

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
      /** Label fused for a custom input, `{input}` can be used to display input */
      customInputLabel?: string;
      /** Prompt shown to the user */
      prompt: string;
      /** Placeholder shown in the input field */
      placeholder?: string;
      /** Options for the user to select from */
      options?: Record<string, T> | "columns";
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

/** Simple (nested) Object of parameters */
export interface ParameterList {
  [key: string]: Exclude<Primitive, undefined> | ParameterList;
}

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

export interface FormatterListParameterFormatOptions {
  /** Enclosure around each item */
  enclosure?: FormatterEnclosure;
  /** Escape options for each item */
  escape?: FormatterValueEscape[];
  /** Alias options for each item */
  alias?: FormatterValueAlias;
}

export type FormatterListParameterFormatPrefixedOptions<Prefix extends string> = {
  [K in keyof FormatterListParameterFormatOptions as K extends string
    ? `${Prefix}${Capitalize<K>}`
    : never]?: FormatterListParameterFormatOptions[K];
};

/** Options for values */
export interface FormatterListValueOptions extends FormatterListParameterFormatPrefixedOptions<"value"> {}

/** Options for keys */
export interface FormatterListKeyOptions extends FormatterListParameterFormatPrefixedOptions<"key"> {
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
export interface FormatterListHeaderOptions extends FormatterListOptions, FormatterListKeyOptions {
  /** If true, header is generated after the enclosure */
  afterEnclosure?: boolean;
}

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
  base: DefaultFormatterLanguage;
} & PartialDeep<T>;

export interface ExtendFormatterOptions extends PartialDeep<FormatterOptions> {
  name: string;
  simpleList?: FormatterSimpleListOptions | ExtendableFormatterListOptions<FormatterSimpleListOptions>;
  objectList?: FormatterObjectListOptions | ExtendableFormatterListOptions<FormatterObjectListOptions>;
}

/** Options for parameter expansion */
export interface FormatterParameterExpansionOptions
  extends Partial<FormatterListKeyOptions>,
    Partial<FormatterListValueOptions> {}

export interface CustomFormatters {
  [key: string]: ExtendFormatterOptions;
}

export type DefaultFormatterLanguage =
  | "javascript"
  | "json"
  | "jsonl"
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
  | "sql"
  | "sqlUpdate"
  | "latex";

export type DefaultDataLanguage =
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

export type FormatterPipe = "key" | "value";

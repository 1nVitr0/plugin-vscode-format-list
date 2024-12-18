/* eslint-disable @typescript-eslint/naming-convention */
import * as deepMerge from "deepmerge";
import { FormatterOptions, FormatterParameter, FormatterSimpleListOptions } from "../../types/Formatter";
import { PartialDeep } from "type-fest";

export const csvParameters: Record<string, FormatterParameter> = {
  delimiter: {
    type: "string",
    default: ",",
    query: {
      prompt: "Delimiter",
      placeholder: "Select a delimiter",
      customInputLabel: 'Custom delimiter: "{input}"',
      options: {
        ", (comma)": ",",
        "; (semicolon)": ";",
        "\\s (space)": " ",
        "\\t (tab)": "\t",
        "\\n (newline)": "\n",
      },
      allowInput: true,
    },
  },
  enclosure: {
    type: "string",
    default: '"',
    query: {
      prompt: "Enclosure",
      placeholder: "Select an enclosure",
      customInputLabel: 'Custom enclosure: "{input}"',
      options: {
        '" (double quote)': '"',
        "' (single quote)": "'",
        "` (backtick)": "`",
        None: "",
      },
      allowInput: true,
    },
  },
};

const csvSimpleListOptions: FormatterSimpleListOptions = {
  delimiter: "\n",
  valueAlias: { null: "" },
  valueEscape: [{ pattern: /"/g, replace: '""' }],
  header: {
    delimiter: ",",
    keyEnclosure: '"',
    enclosure: {
      start: "",
      end: "\n",
    },
    itemEnclosure: [
      { id: "quote-strings", test: "/\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' },
    ],
    delimitSameLine: 1,
  },
};

export const formatCsvDefault: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: csvSimpleListOptions,
  objectList: {
    ...csvSimpleListOptions,
    itemFormat: {
      delimiter: ",",
      valueAlias: { null: "" },
      valueEnclosure: { string: '"' },
      assignmentOperator: "",
      noKeys: true,
    },
  },
};

export const formatCsvCustom: FormatterOptions = deepMerge(formatCsvDefault, {
  simpleList: {
    header: {
      delimiter: "${delimiter}",
      keyEnclosure: [{ test: "/\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" }],
    },
    parameters: csvParameters,
  },
  objectList: {
    itemFormat: {
      delimiter: "${delimiter}",
      valueEnclosure: {
        string: "${enclosure}",
      },
    },
    header: {
      delimiter: "${delimiter}",
      keyEnclosure: [{ test: "/\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" }],
    },
    parameters: csvParameters,
  },
} as PartialDeep<FormatterOptions>) as FormatterOptions;

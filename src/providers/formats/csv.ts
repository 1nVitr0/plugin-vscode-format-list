import * as deepMerge from "deepmerge";
import { FormatterOptions, FormatterParameter, FormatterSimpleListOptions } from "../../types/Formatter";
import { PartialDeep } from "type-fest";

export const csvParameters: Record<string, FormatterParameter> = {
  delimiter: {
    type: "string",
    default: ",",
    query: {
      prompt: "Delimiter",
      placeholder: "Enter delimiter",
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
      placeholder: "Enter enclosure",
      options: {
        '" (double quote)': '"',
        "' (single quote)": "'",
        "` (backtick)": "`",
        "none (empty string)": "",
      },
      allowInput: true,
    },
  },
};

const csvSimpleListOptions: FormatterSimpleListOptions = {
  delimiter: "\n",
  header: {
    delimiter: ",",
    keyEnclosure: '"',
    enclosure: {
      start: "",
      end: "\n",
    },
    itemEnclosure: [{ test: "/\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
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
      valueEnclosure: {
        string: '"',
      },
      assignmentOperator: "",
      noKeys: true,
    },
  },
};

export const formatCsvCustom: FormatterOptions = deepMerge(formatCsvDefault, {
  simpleList: {
    header: {
      delimiter: "${delimiter}",
      keyEnclosure: [
        { test: "/\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" },
      ],
    },
    parameters: csvParameters,
  },
  objectList: {
    itemFormat: {
      delimiter: "${delimiter}",
      valueEnclosure: {
        string: "${enclosure}",
      }
    },
    header: {
      delimiter: "${delimiter}",
      keyEnclosure: [
        { test: "/\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" },
      ],
    },
    parameters: csvParameters,
  },
} as PartialDeep<FormatterOptions>) as FormatterOptions;

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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ", (comma)": ",",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "; (semicolon)": ";",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "\\s (space)": " ",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "\\t (tab)": "\t",
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '" (double quote)': '"',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "' (single quote)": "'",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "` (backtick)": "`",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        None: "",
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

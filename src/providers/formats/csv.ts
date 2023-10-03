import defaults from "defaults";
import { FormatterOptions, FormatterParameter } from "../../types/Formatter";
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

export const formatCsvDefault: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    header: {
      delimiter: ",",
      keyEnclosure: [{ test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
      pretty: 0,
    },
  },
  objectList: {
    delimiter: "\n",
    itemFormat: {
      delimiter: ",",
    },
    assignmentOperator: "",
    noKeys: true,
    header: {
      delimiter: ",",
      keyEnclosure: [{ test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
      pretty: 0,
    },
  },
};

export const formatCsvCustom: FormatterOptions = defaults(
  {
    simpleList: {
      header: {
        delimiter: "${delimiter}",
        keyEnclosure: [
          { test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" },
        ],
      },
      parameters: csvParameters,
    },
    objectList: {
      itemFormat: {
        delimiter: "${delimiter}",
      },
      header: {
        delimiter: "${delimiter}",
        keyEnclosure: [
          { test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" },
        ],
      },
      parameters: csvParameters,
    },
  },
  formatCsvDefault as Partial<FormatterOptions>
) as FormatterOptions;

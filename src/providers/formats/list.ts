import { FormatterOptions } from "../../types/Formatter";

export const formatTextList: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "${delimiter}",
    enclosure: { start: "${enclosure}", end: "${enclosure}" },
    parameters: {
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
    },
  },
};

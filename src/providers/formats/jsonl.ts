import { FormatterOptions } from "../../types/Formatter";

export const formatJsonLog: FormatterOptions = {
  pretty: 0,
  objectList: {
    delimiter: "\n",
    delimitLastItem: true,
    itemFormat: {
      enclosure: { start: "{", end: "}" },
      delimiter: ", ",
      keyEnclosure: [{ id: "quote-keys", test: "/.*/", enclosure: '"' }],
      valueEnclosure: { string: '"' },
      valueEscape: [
        { pattern: '"', escape: '\\"' },
        { pattern: "\n", replace: "\\n" },
        { pattern: "\r", replace: "\\r" },
      ],
      assignmentOperator: ": ",
    },
  },
};

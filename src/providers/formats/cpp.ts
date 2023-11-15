import { FormatterOptions } from "../../types/Formatter";

export const formatCpp: FormatterOptions = {
  simpleList: {
    enclosure: { start: "{", end: "}" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    valueEscape: [
      { pattern: '"', escape: '\\"' },
      { pattern: "\n", replace: "\\n" },
      { pattern: "\r", replace: "\\r" },
    ],
    indentItems: -1,
  },
};

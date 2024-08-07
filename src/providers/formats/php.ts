import { FormatterOptions } from "../../types/Formatter";

export const formatPhp: FormatterOptions = {
  simpleList: {
    enclosure: { start: "[", end: "]" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    valueEscape: [
      { pattern: '"', escape: '\\"' },
      { pattern: "\n", replace: "\\n" },
      { pattern: "\r", replace: "\\r" },
    ],
    indentItems: -1,
  },
  objectList: {
    enclosure: { start: "[", end: "]" },
    delimiter: ",",
    indentItems: -1,
    itemFormat: {
      enclosure: { start: "[", end: "]" },
      delimiter: ",",
      keyEnclosure: [{ id: "quote-keys", test: "/.*/", enclosure: '"' }],
      valueEnclosure: { string: '"' },
      valueEscape: [
        { pattern: '"', escape: '\\"' },
        { pattern: "\n", replace: "\\n" },
        { pattern: "\r", replace: "\\r" },
      ],
      assignmentOperator: "=>",
      assignmentOperatorSpaced: " => ",
      indentItems: -1,
      indentEnclosure: -1,
    },
  },
};

import { FormatterOptions } from "../../types/Formatter";

export const formatJavaScript: FormatterOptions = {
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
    delimitSameLine: 1,
    itemFormat: {
      enclosure: { start: "{", end: "}" },
      delimiter: ",",
      keyEnclosure: [{ id: "quote-strings", test: "/^([^A-Za-z0-9_$]*|^[^0-9]*)$/", enclosure: '"' }],
      valueEnclosure: { string: '"' },
      valueEscape: [
        { pattern: '"', escape: '\\"' },
        { pattern: "\n", replace: "\\n" },
        { pattern: "\r", replace: "\\r" },
      ],
      assignmentOperator: ":",
      assignmentOperatorSpaced: ": ",
      indentItems: -1,
      indentEnclosure: -1,
    },
  },
};

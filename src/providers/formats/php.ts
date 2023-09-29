import { FormatterOptions } from "../../types/Formatter";

export const formatPhp: FormatterOptions = {
  simpleList: {
    enclosure: { start: "[", end: "]" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    indentItems: -1,
  },
  objectList: {
    enclosure: { start: "[", end: "]" },
    delimiter: ",",
    assignmentOperator: "=>",
    assignmentOperatorSpaced: " => ",
    keyEnclosure: [{ test: "/.*/", enclosure: '"' }],
    valueEnclosure: { string: '"' },
    indentItems: -1,
    itemFormat: {
      enclosure: { start: "{", end: "}" },
      delimiter: ",",
      indentItems: -1,
      indentEnclosure: -1,
    },
  },
};
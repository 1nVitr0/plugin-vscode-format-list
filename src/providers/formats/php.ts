import { FormatterOptions } from "../../types/Formatter";

export const formatPhp: FormatterOptions = {
  simpleList: {
    enclosure: { start: "[", end: "]" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    indentItems: true,
  },
  objectList: {
    enclosure: { start: "[", end: "]" },
    delimiter: ",",
    assignmentOperator: "=>",
    assignmentOperatorSpaced: " => ",
    keyEnclosure: [{ test: "/.*/", enclosure: '"' }],
    valueEnclosure: { string: '"' },
    indentItems: true,
    itemFormat: {
      enclosure: { start: "{", end: "}" },
      delimiter: ",",
      indentItems: true,
      delimitSameLine: true,
    },
  },
};

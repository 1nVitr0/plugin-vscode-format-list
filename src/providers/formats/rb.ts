import { FormatterOptions } from "../../types/Formatter";

export const formatRb: FormatterOptions = {
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
    keyEnclosure: [{ test: "/:[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
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

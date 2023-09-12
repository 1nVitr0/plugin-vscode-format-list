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
    objectEnclosure: { start: "{", end: "}" },
    delimiter: ",",
    objectDelimiter: ",",
    assignmentOperator: "=>",
    assignmentOperatorSpaced: " => ",
    keyEnclosure: [{ test: "/:[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
    valueEnclosure: { string: '"' },
    objectEnclosureSameLine: true,
    indentItems: true,
    objectItemIndentProperties: true,
  },
};

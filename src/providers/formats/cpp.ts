import { FormatterOptions } from "../../types/Formatter";

export const formatCpp: FormatterOptions = {
  simpleList: {
    enclosure: { start: "{", end: "}" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    indentItems: true,
  },
  objectList: {
    enclosure: { start: "{", end: "}" },
    objectEnclosure: { start: "{", end: "}" },
    delimiter: ",",
    objectDelimiter: ",",
    assignmentOperator: "=",
    assignmentOperatorSpaced: " = ",
    keyEnclosure: [{ test: "/.*/", enclosure: { start: "[", end: "] " } }],
    valueEnclosure: { string: '"' },
    objectEnclosureSameLine: true,
    indentItems: true,
    objectItemIndentProperties: true,
  },
};

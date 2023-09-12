import { FormatterOptions } from "../../types/Formatter";

export const formatJson: FormatterOptions = {
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
    assignmentOperator: ":",
    assignmentOperatorSpaced: ": ",
    keyEnclosure: [{ test: "/.*/", enclosure: '"' }],
    valueEnclosure: { string: '"' },
    indentItems: true,
    objectItemIndentProperties: true,
  },
};

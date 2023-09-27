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
    delimiter: ",",
    assignmentOperator: ":",
    assignmentOperatorSpaced: ": ",
    keyEnclosure: [{ test: "/[^A-Za-z0-9_$]|^[0-9]/", enclosure: '"' }],
    valueEnclosure: { string: '"' },
    indentItems: true,
    delimitSameLine: true,
    itemFormat: {
      enclosure: { start: "{", end: "}" },
      delimiter: ",",
      indentItems: true,
      indentEnclosure: true,
    },
  },
};
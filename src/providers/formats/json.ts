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
    itemFormat: {
      enclosure: { start: "{", end: "}" },
      delimiter: ",",
      indentItems: true,
    },
    delimiter: ",",
    assignmentOperator: ":",
    assignmentOperatorSpaced: ": ",
    keyEnclosure: [{ test: "/.*/", enclosure: '"' }],
    valueEnclosure: { string: '"' },
    indentItems: true,
  },
};

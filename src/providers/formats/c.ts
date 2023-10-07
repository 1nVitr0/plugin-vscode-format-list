import { FormatterOptions } from "../../types/Formatter";

export const formatC: FormatterOptions = {
  simpleList: {
    enclosure: { start: "{", end: "}" },
    delimiter: ",",
    valueEnclosure: { string: '"' },
    indentItems: -1,
  },
  objectList: {
    enclosure: { start: "{", end: "}" },
    delimiter: ",",
    indentItems: -1,
    itemFormat: {
      enclosure: { start: "{", end: "}" },
      delimiter: ",",
      keyEnclosure: [{ test: "/.*/", enclosure: { start: ".", end: "" } }],
      valueEnclosure: { string: '"' },
      assignmentOperator: "=",
      assignmentOperatorSpaced: " = ",
      indentItems: -1,
      indentEnclosure: -1,
    },
  },
};

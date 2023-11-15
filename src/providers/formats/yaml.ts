import { FormatterOptions } from "../../types/Formatter";

export const formatYaml: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    itemPrefix: "- ",
    valueEscape: [
      { pattern: '"', escape: '\\"' },
      { pattern: "\n", replace: "\\n" },
      { pattern: "\r", replace: "\\r" },
    ],
  },
  objectList: {
    delimiter: "\n",
    itemPrefix: "- ",
    itemFormat: {
      delimiter: "\n",
      assignmentOperator: ": ",
      itemPrefix: { first: "", rest: "  " },
      indentItems: 0,
      valueEscape: [
        { pattern: '"', escape: '\\"' },
        { pattern: "\n", replace: "\\n" },
        { pattern: "\r", replace: "\\r" },
      ],
    },
  },
};

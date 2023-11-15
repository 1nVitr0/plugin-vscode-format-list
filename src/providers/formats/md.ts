import { FormatterOptions } from "../../types/Formatter";

export const formatMarkdown: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    itemPrefix: "- ",
    valueEscape: [{ pattern: "\n", replace: "\n  " }],
  },
  objectList: {
    delimiter: "\n",
    itemPrefix: "- Item ${index + 1}:\n",
    indentItems: 0,
    itemFormat: {
      delimiter: "\n",
      assignmentOperator: ": ",
      itemPrefix: "- ",
      indentItems: 1,
      valueEscape: [{ pattern: "\n", replace: "\n    " }],
    },
  },
};

import { FormatterOptions } from "../../types/Formatter";

export const formatMarkdown: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    itemPrefix: "- ",
  },
  objectList: {
    assignmentOperator: ": ",
    delimiter: "\n",
    itemPrefix: "- Item ${index + 1}:\n",
    indentItems: 0,
    itemFormat: {
      delimiter: "\n",
      itemPrefix: "- ",
      indentItems: 1,
    },
  },
};

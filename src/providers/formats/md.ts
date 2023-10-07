import { FormatterOptions } from "../../types/Formatter";

export const formatMarkdown: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    itemPrefix: "- ",
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
    },
  },
};

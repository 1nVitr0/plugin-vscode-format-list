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
    itemPrefix: "- Item:",
    indentItems: true,
    itemFormat: {
      delimiter: "\n",
      itemPrefix: "- ",
    },
  },
};

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
    objectDelimiter: "\n",
    itemPrefix: "- Item:",
    objectItemPrefix: "  - ",
    indentItems: true,
  },
};

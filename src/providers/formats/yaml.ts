import { FormatterOptions } from "../../types/Formatter";

export const formatYaml: FormatterOptions = {
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
    itemPrefix: "- ",
    objectItemIgnoreIndent: true,
    objectItemPrefix: { first: "", rest: "  " },
  },
};

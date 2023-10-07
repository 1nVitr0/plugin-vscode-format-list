import { FormatterOptions } from "../../types/Formatter";

export const formatYaml: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    itemPrefix: "- ",
  },
  objectList: {
    delimiter: "\n",
    itemPrefix: "- ",
    itemFormat: {
      delimiter: "\n",
      assignmentOperator: ": ",
      itemPrefix: { first: "", rest: "  " },
      indentItems: 0,
    },
  },
};

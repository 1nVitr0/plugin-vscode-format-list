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
    itemPrefix: "- ",
    itemFormat: {
      delimiter: "\n",
      itemPrefix: { first: "", rest: "  " },
      indentItems: false,
    },
  },
};

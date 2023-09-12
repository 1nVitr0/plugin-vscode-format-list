import { FormatterOptions } from "../../types/Formatter";

export const formatCsv: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    header: {
      delimiter: ",",
      keyEnclosure: [{ test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
      pretty: false,
    },
  },
  objectList: {
    delimiter: "\n",
    objectDelimiter: ",",
    assignmentOperator: "",
    noKeys: true,
    header: {
      delimiter: ",",
      keyEnclosure: [{ test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
      pretty: false,
    },
  },
};

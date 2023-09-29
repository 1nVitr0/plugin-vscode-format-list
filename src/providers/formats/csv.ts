import { FormatterOptions } from "../../types/Formatter";

export const formatCsv: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    header: {
      delimiter: ",",
      keyEnclosure: [{ test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
      pretty: 0,
    },
  },
  objectList: {
    delimiter: "\n",
    itemFormat: {
      delimiter: ",",
    },
    assignmentOperator: "",
    noKeys: true,
    header: {
      delimiter: ",",
      keyEnclosure: [{ test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: '"' }],
      pretty: 0,
    },
  },
};

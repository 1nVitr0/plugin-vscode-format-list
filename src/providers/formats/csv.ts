import defaults from "defaults";
import { FormatterOptions } from "../../types/Formatter";
import { PartialDeep } from "type-fest";

export const formatCsvDefault: FormatterOptions = {
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

export const formatCsvCustom: FormatterOptions = defaults(
  {
    simpleList: {
      header: {
        delimiter: "${delimiter}",
        keyEnclosure: [
          { test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" },
        ],
      },
    },
    objectList: {
      itemFormat: {
        delimiter: "${delimiter}",
      },
      header: {
        delimiter: "${delimiter}",
        keyEnclosure: [
          { test: "/[A-Za-z_$]+|\\d+(\\.\\d+)?|\\.\\d+|true|false/", inverse: true, enclosure: "${enclosure}" },
        ],
      },
    },
  },
  formatCsvDefault as Partial<FormatterOptions>
) as FormatterOptions;

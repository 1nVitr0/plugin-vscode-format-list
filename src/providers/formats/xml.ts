import { FormatterOptions } from "../../types/Formatter";

export const formatXml: FormatterOptions = {
  simpleList: {
    delimiter: "",
    indentItems: -1,
    enclosure: {
      start: "<root>",
      end: "</root>",
    },
    valueEnclosure: {
      start: "<item>",
      end: "</item>",
    },
  },
  objectList: {
    delimiter: "",
    assignmentOperator: "",
    indentItems: -1,
    enclosure: {
      start: "<root>",
      end: "</root>",
    },
    valueEnclosure: {
      start: "",
      end: "</${key}>",
    },
    keyEnclosure: [
      {
        test: "/.*/",
        enclosure: {
          start: "<",
          end: ">",
        },
      },
    ],
    itemFormat: {
      delimiter: "",
      indentItems: -1,
      indentEnclosure: -1,
      enclosure: {
        start: "<item>",
        end: "</item>",
      },
    },
  },
};

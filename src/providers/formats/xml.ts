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
    indentItems: -1,
    enclosure: {
      start: "<root>",
      end: "</root>",
    },
    itemFormat: {
      delimiter: "",
      enclosure: {
        start: "<item>",
        end: "</item>",
      },
      keyEnclosure: [
        {
          id: "bracket-keys",
          test: "/.*/",
          enclosure: {
            start: "<",
            end: ">",
          },
        },
      ],
      valueEnclosure: {
        start: "",
        end: "</${key}>",
      },
      assignmentOperator: "",
      indentItems: -1,
      indentEnclosure: -1,
    },
  },
};

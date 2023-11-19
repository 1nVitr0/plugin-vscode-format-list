import { FormatterOptions, FormatterValueEscape } from "../../types/Formatter";

const xmlValueEscape: FormatterValueEscape[] = [
  {
    pattern: /</g,
    replace: "&lt;",
  },
  {
    pattern: />/g,
    replace: "&gt;",
  },
  {
    pattern: /&/g,
    replace: "&amp;",
  },
];

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
    valueEscape: xmlValueEscape,
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
      valueEscape: xmlValueEscape,
      assignmentOperator: "",
      indentItems: -1,
      indentEnclosure: -1,
    },
  },
};

import { FormatterOptions } from "../../types/Formatter";

export const formatSql: FormatterOptions = {
  objectList: {
    delimiter: ",",
    assignmentOperator: "",
    noKeys: true,
    indentItems: -1,
    valueEnclosure: {
      string: '"'
    },
    enclosure: {
      start: "VALUES",
      end: ";",
    },
    header: {
      enclosure: {
        start: "INSERT${ignore}INTO (",
        end: ")",
      },
      delimiter: ",",
      keyEnclosure: [{ test: "/.*/", enclosure: '`' }],
    },
    itemFormat: {
      delimiter: ",",
      indentItems: -1,
      indentEnclosure: -1,
      enclosure: {
        start: "(",
        end: ")",
      },
    },
    parameters: {
      ignore: {
        type: "string",
        default: "",
        query: {
          prompt: "Ignore",
          placeholder: "Ignore",
          options: {
            "Yes": " IGNORE ",
            "No": " ",
          },
        },
      }
    }
  },
};
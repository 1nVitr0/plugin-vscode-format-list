import { FormatterOptions } from "../../types/Formatter";

export const formatSql: FormatterOptions = {
  objectList: {
    delimiter: ",",
    indentItems: -1,
    indentEnclosure: 0,
    enclosure: {
      start: "VALUES",
      end: ";",
    },
    header: {
      delimiter: ",",
      enclosure: {
        start: "INSERT${ignore}INTO ${tableName} (",
        end: ")",
      },
      keyEnclosure: [{ id: "quote-columns", test: "/.*/", enclosure: "`" }],
      indentItems: -1,
    },
    itemFormat: {
      delimiter: ",",
      valueEnclosure: {
        string: '"',
      },
      assignmentOperator: "",
      noKeys: true,
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
          prompt: "Ignore duplicates?",
          placeholder: "Ignore",
          options: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Yes: " IGNORE ",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            No: " ",
          },
        },
      },
      tableName: {
        type: "string",
        default: "t",
        query: {
          prompt: "Table name",
          placeholder: "Table name",
          allowInput: true,
        },
      },
    },
  },
};
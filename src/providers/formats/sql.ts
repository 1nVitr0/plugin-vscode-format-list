import { FormatterOptions } from "../../types/Formatter";

export const formatSqlInsert: FormatterOptions = {
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
          placeholder: "IGNORE",
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
        default: "table",
        query: {
          prompt: "Table name",
          placeholder: "`table`",
          allowInput: true,
        },
      },
    },
  },
};

export const formatSqlUpdate: FormatterOptions = {
  objectList: {
    indentItems: 0,
    indentEnclosure: 0,
    itemFormat: {
      valueEnclosure: {
        string: '"',
      },
      delimiter: ",",
      assignmentOperator: "=",
      assignmentOperatorSpaced: " = ",
      indentItems: -1,
      indentEnclosure: -1,
      enclosure: {
        start: "UPDATE ${tableName} SET",
        end: "WHERE ${primaryKey} = ${item.$primaryKey};",
      },
    },
    parameters: {
      tableName: {
        type: "string",
        default: "table",
        query: {
          prompt: "Table name",
          placeholder: "`table`",
          allowInput: true,
        },
      },
      primaryKey: {
        type: "string",
        query: {
          prompt: "Primary key",
          placeholder: "`id`",
          options: "columns",
        },
      },
    },
  },
};
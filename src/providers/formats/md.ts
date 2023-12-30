/* eslint-disable @typescript-eslint/naming-convention */
import { FormatterOptions } from "../../types/Formatter";

export const formatMarkdown: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    itemPrefix: "- ",
    valueEscape: [{ pattern: "\n", replace: "\n  " }],
  },
  objectList: {
    delimiter: "\n",
    delimitLastItem: true,
    header: {
      afterEnclosure: true,
      delimiter: " | ",
      enclosure: {
        start: "| ",
        end: " |\n${columnTemplate}",
      },
    },
    itemFormat: {
      enclosure: {
        start: "| ",
        end: " |",
      },
      delimiter: " | ",
      valueAlias: { null: "" },
      assignmentOperator: "",
      noKeys: true,
    },
    parameters: {
      columnTemplate: {
        type: "string",
        query: {
          prompt: "Column template",
          allowInput: true,
          options: {
            Centered: "|$[columnCount]*{' :---: |'}",
            Left: "|$[columnCount]*{' :--- |'}",
            Right: "|$[columnCount]*{' ---: |'}",
            "Centered, first column right": "| ---: |$[columnCount-1]*{' :---: |'}",
            "Left, first column right": "| ---: |$[columnCount-1]*{' :--- |'}",
            Alternating: "|$[columnCount/2]*{':--- | ---: |'}$[columnCount%2]?{':-- |'}",
          },
        },
      },
    },
  },
};

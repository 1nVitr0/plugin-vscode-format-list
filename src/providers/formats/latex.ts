import * as deepMerge from "deepmerge";
import { FormatterOptions, FormatterSimpleListOptions, FormatterValueEscape } from "../../types/Formatter";
import { PartialDeep } from "type-fest";

const latexEscapes: FormatterValueEscape[] = [
  { pattern: /\\/g, replace: "\\textbackslash{}" },
  { pattern: /%/g, replace: "\\%" },
  { pattern: /&/g, replace: "\\&" },
  { pattern: /\$/g, replace: "\\$" },
  { pattern: /#/g, replace: "\\#" },
  { pattern: /_/g, replace: "\\_" },
  { pattern: /~/g, replace: "\\textasciitilde{}" },
  { pattern: /</g, replace: "\\textless{}" },
  { pattern: />/g, replace: "\\textgreater{}" },
  { pattern: /\^/g, replace: "\\textasciicircum{}" },
  { pattern: /{/g, replace: "\\{" },
  { pattern: /}/g, replace: "\\}" },
  { pattern: /"/g, replace: "\\textquotedbl{}" },
  { pattern: /'/g, replace: "\\textquotesingle{}" },
  { pattern: /@/g, replace: "\\@" },
  { pattern: /€/g, replace: "\\euro{}" },
  { pattern: /\r?\n/g, replace: "\\\\ " },
];

export const formatLatex: FormatterOptions = {
  pretty: 0,
  indent: 0,
  simpleList: {
    delimiter: "\n",
    itemPrefix: "\\item ",
    valueAlias: { null: "" },
    valueEscape: latexEscapes,
    enclosure: {
      start: "\\begin{${type}}",
      end: "\\end{${type}}",
    },
    parameters: {
      type: {
        type: "string",
        query: {
          prompt: "List type",
          allowInput: true,
          options: {
            ordered: "enumerate",
            unordered: "itemize",
          },
          placeholder: "type",
        },
      },
    },
  },
  objectList: {
    enclosure: {
      start: "\\begin{tabular}{${columnTemplate}}\n${separator}\n",
      end: "\n${separator}\\end{tabular}",
    },
    delimiter: "\\\\\n${separator}",
    delimitLastItem: true,
    header: {
      afterEnclosure: true,
      delimiter: " & ",
      keyEnclosure: [
        {
          id: "bold-header",
          test: "/.*/",
          enclosure: {
            start: "\\textbf{",
            end: "}",
          },
        },
      ],
    },
    itemFormat: {
      delimiter: " & ",
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
            "1 column": "c",
            "2 columns": "cc",
            "2 columns (separator)": "|c|c|",
            "3 columns": "ccc",
            "3 columns (separator)": "|c|c|c|",
            "4 columns": "cccc",
            "4 columns (separator)": "|c|c|c|c|",
            "5 columns": "ccccc",
            "5 columns (separator)": "|c|c|c|c|c|",
            "6 columns": "cccccc",
            "6 columns (separator)": "|c|c|c|c|c|c|",
            "7 columns": "ccccccc",
            "7 columns (separator)": "|c|c|c|c|c|c|c|",
            "8 columns": "cccccccc",
            "8 columns (separator)": "|c|c|c|c|c|c|c|c|",
            "9 columns": "ccccccccc",
            "9 columns (separator)": "|c|c|c|c|c|c|c|c|c|",
            "10 columns": "cccccccccc",
            "10 columns (separator)": "|c|c|c|c|c|c|c|c|c|c|",
          },
        },
      },
      separator: {
        type: "string",
        query: {
          prompt: "Add horizontal separators",
          options: {
            Yes: "\\hline\n",
            Double: "\\hline\\hline\n",
            No: "",
          },
        },
      },
    },
  },
};

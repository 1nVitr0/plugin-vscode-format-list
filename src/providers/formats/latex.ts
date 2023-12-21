/* eslint-disable @typescript-eslint/naming-convention */
import { FormatterOptions, FormatterValueEscape } from "../../types/Formatter";

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
      start: "\\begin{tabular}{${columnTemplate}}${separator}",
      end: "\\end{tabular}",
    },
    delimiter: " \\\\\n${separator}",
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
            Centered: "$[columnCount]*{'c'}",
            "Centered (separated)": "|$[columnCount]*{'c|'}",
            "Left-aligned": "$[columnCount]*{'l'}",
            "Left-aligned (separated)": "|$[columnCount]*{'l|'}",
            "Right-aligned": "$[columnCount]*{'r'}",
            "Right-aligned (separated)": "|$[columnCount]*{'r|'}",
            "Centered, first column right-aligned": "r$[columnCount-1]*{'c'}",
            "Centered, first column right-aligned (separated)": "|r|$[columnCount-1]*{'c|'}",
            "Left-aligned, first column right-aligned": "r$[columnCount-1]*{'l'}",
            "Left-aligned, first column right-aligned (separated)": "|r|$[columnCount-1]*{'l|'}",
            "Alternating left/right-aligned": "$[columnCount/2]*{lr}$[columnCount%2]?{'l'}",
            "Alternating left/right-aligned (separated)": "|$[columnCount/2]*{'l|r|'}$[columnCount%2]?{'l|'}",
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

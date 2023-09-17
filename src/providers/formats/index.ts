import { DefaultFormatterLanguages } from "../../types/Formatter";
import ListFormatProvider from "./ListFormatProvider";
import { formatCpp } from "./cpp";
import { formatCsv } from "./csv";
import { formatJson } from "./json";
import {
  formatCommaSeparatedList,
  formatSpaceSeparatedList,
  formatTabSeparatedList,
  formatNewLineSeparatedList,
  formatEnclosedCommaSeparatedList,
  formatEnclosedTabSeparatedList,
  formatEnclosedSpaceSeparatedList,
} from "./list";
import { formatMarkdown } from "./md";
import { formatPhp } from "./php";
import { formatRb } from "./rb";
import { formatYaml } from "./yaml";

export const listFormatProviders: Record<DefaultFormatterLanguages, ListFormatProvider> = {
  js: new ListFormatProvider("JavaScript", formatJson),
  json: new ListFormatProvider("JSON", formatJson),
  yaml: new ListFormatProvider("yaml", formatYaml),
  markdown: new ListFormatProvider("Markdown", formatMarkdown),
  php: new ListFormatProvider("PHP Array", formatPhp),
  cpp: new ListFormatProvider("C++ Array", formatCpp),
  csv: new ListFormatProvider("CSV", formatCsv),
  ruby: new ListFormatProvider("Ruby Array", formatRb),
  commaSeparatedList: new ListFormatProvider("Comma separated list", formatCommaSeparatedList),
  tabSeparatedList: new ListFormatProvider("Tab separated list", formatTabSeparatedList),
  spaceSeparatedList: new ListFormatProvider("Space separated list", formatSpaceSeparatedList),
  newLineSeparatedList: new ListFormatProvider("Newline separated list", formatNewLineSeparatedList),
  enclosedCommaSeparatedList: new ListFormatProvider("Enclosed comma separated list", formatEnclosedCommaSeparatedList),
  enclosedTabSeparatedList: new ListFormatProvider("Enclosed tab separated list", formatEnclosedTabSeparatedList),
  enclosedSpaceSeparatedList: new ListFormatProvider("Enclosed space separated list", formatEnclosedSpaceSeparatedList),
};

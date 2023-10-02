import { DefaultFormatterLanguages } from "../../types/Formatter";
import ListFormatProvider from "./ListFormatProvider";
import { formatC } from "./c";
import { formatCpp } from "./cpp";
import { formatCsvCustom, formatCsvDefault } from "./csv";
import { formatJava } from "./java";
import { formatJson } from "./json";
import { formatTextList } from "./list";
import { formatMarkdown } from "./md";
import { formatPhp } from "./php";
import { formatXml } from "./xml";
import { formatYaml } from "./yaml";

export const listFormatProviders: Record<DefaultFormatterLanguages, ListFormatProvider> = {
  csv: new ListFormatProvider("CSV (Default Options)", formatCsvDefault),
  csvCustom: new ListFormatProvider("CSV (Custom Options)", formatCsvCustom),
  json: new ListFormatProvider("JSON", formatJson),
  yaml: new ListFormatProvider("YAML", formatYaml),
  xml: new ListFormatProvider("XML", formatXml),
  textList: new ListFormatProvider("Separated list", formatTextList),
  markdown: new ListFormatProvider("Markdown", formatMarkdown),
  javascript: new ListFormatProvider("JavaScript", formatJson),
  php: new ListFormatProvider("PHP Array", formatPhp),
  c: new ListFormatProvider("C Array", formatC),
  cpp: new ListFormatProvider("C++ Array", formatCpp),
  java: new ListFormatProvider("Java Array", formatJava),
};

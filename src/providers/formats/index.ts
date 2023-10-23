import { DefaultFormatterLanguages } from "../../types/Formatter";
import ListFormatProvider from "./ListFormatProvider";
import { formatC } from "./c";
import { formatCpp } from "./cpp";
import { formatCsvCustom, formatCsvDefault } from "./csv";
import { formatJava } from "./java";
import { formatJavaScript } from "./javascript";
import { formatJson } from "./json";
import { formatTextList } from "./list";
import { formatMarkdown } from "./md";
import { formatPhp } from "./php";
import { formatSqlInsert, formatSqlUpdate } from "./sql";
import { formatXml } from "./xml";
import { formatYaml } from "./yaml";

export const listFormatProviders: Record<DefaultFormatterLanguages, ListFormatProvider> = {
  csv: new ListFormatProvider("CSV (Default Options)", formatCsvDefault),
  csvCustom: new ListFormatProvider("CSV (Custom Options)", formatCsvCustom),
  json: new ListFormatProvider("JSON", formatJson),
  yaml: new ListFormatProvider("YAML", formatYaml),
  xml: new ListFormatProvider("XML", formatXml),
  textList: new ListFormatProvider("Separated list", formatTextList),
  sql: new ListFormatProvider("SQL", formatSqlInsert),
  sqlUpdate: new ListFormatProvider("SQL Update", formatSqlUpdate),
  markdown: new ListFormatProvider("Markdown", formatMarkdown),
  javascript: new ListFormatProvider("JavaScript", formatJavaScript),
  php: new ListFormatProvider("PHP Array", formatPhp),
  c: new ListFormatProvider("C Array", formatC),
  cpp: new ListFormatProvider("C++ Array", formatCpp),
  java: new ListFormatProvider("Java Array", formatJava),
};

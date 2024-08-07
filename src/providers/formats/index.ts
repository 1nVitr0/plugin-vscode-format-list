import { l10n } from "vscode";
import { DefaultFormatterLanguages } from "../../types/Formatter";
import ListFormatProvider from "./ListFormatProvider";
import { formatC } from "./c";
import { formatCpp } from "./cpp";
import { formatCsvCustom, formatCsvDefault } from "./csv";
import { formatJava } from "./java";
import { formatJavaScript } from "./javascript";
import { formatJson } from "./json";
import { formatJsonLog } from "./jsonl";
import { formatLatex } from "./latex";
import { formatTextList } from "./list";
import { formatMarkdown } from "./md";
import { formatPhp } from "./php";
import { formatSqlInsert, formatSqlUpdate } from "./sql";
import { formatXml } from "./xml";
import { formatYaml } from "./yaml";

export const listFormatProviders: Record<DefaultFormatterLanguages, ListFormatProvider> = {
  csv: new ListFormatProvider(l10n.t("CSV (Default Options)"), formatCsvDefault),
  csvCustom: new ListFormatProvider(l10n.t("CSV (Custom Options)"), formatCsvCustom),
  json: new ListFormatProvider(l10n.t("JSON"), formatJson),
  jsonl: new ListFormatProvider(l10n.t("JSON Log (Newline separated JSON objects)"), formatJsonLog),
  yaml: new ListFormatProvider(l10n.t("YAML"), formatYaml),
  xml: new ListFormatProvider(l10n.t("XML"), formatXml),
  textList: new ListFormatProvider(l10n.t("Separated list"), formatTextList),
  sql: new ListFormatProvider(l10n.t("SQL Insert"), formatSqlInsert),
  sqlUpdate: new ListFormatProvider(l10n.t("SQL Update"), formatSqlUpdate),
  markdown: new ListFormatProvider(l10n.t("Markdown"), formatMarkdown),
  javascript: new ListFormatProvider(l10n.t("JavaScript"), formatJavaScript),
  php: new ListFormatProvider(l10n.t("PHP Array"), formatPhp),
  c: new ListFormatProvider(l10n.t("C Array"), formatC),
  cpp: new ListFormatProvider(l10n.t("C++ Array"), formatCpp),
  java: new ListFormatProvider(l10n.t("Java Array"), formatJava),
  latex: new ListFormatProvider(l10n.t("LaTeX"), formatLatex),
};

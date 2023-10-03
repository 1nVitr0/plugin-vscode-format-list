import { DefaultDataLanguages } from "../../types/Formatter";
import { ListDataParams } from "../../types/List";
import { ListDataProvider } from "../../types/Providers";
import CListDataProvider from "./CListDataProvider";
import CsvListDataProvider from "./CsvListDataProvider";
import JavaListDataProvider from "./JavaListDataProvider";
import JavaScriptListDataProvider from "./JavaScriptListDataProvider";
import JSONListDataProvider from "./JSONListDataProvider";
import PhpListDataProvider from "./PhpListDataProvider";
import TypeScriptListDataProvider from "./TypeScriptListDataProvider";
import YamlListDataProvider from "./YamlListDataProvider";

export const listDataProviders: Record<DefaultDataLanguages, ListDataProvider<any, ListDataParams<any>>> = {
  csv: new CsvListDataProvider(),
  json: new JSONListDataProvider(),
  javascript: new JavaScriptListDataProvider(),
  typescript: new TypeScriptListDataProvider(),
  php: new PhpListDataProvider(),
  c: new CListDataProvider(),
  cpp: new CListDataProvider(),
  java: new JavaListDataProvider(),
  yaml: new YamlListDataProvider(),
};

import { ListDataProvider } from "../../types/Providers";
import CsvListDataProvider from "./CsvListDataProvider";
import JavaScriptListDataProvider from "./JavaScriptListDataProvider";
import JSONListDataProvider from "./JSONListDataProvider";
import TypeScriptListDataProvider from "./TypeScriptListDataProvider";

export const listDataProviders: Record<string, ListDataProvider<any>> = {
  csv: new CsvListDataProvider(),
  json: new JSONListDataProvider(),
  javascript: new JavaScriptListDataProvider(),
  typescript: new TypeScriptListDataProvider(),
};

import { ListDataProvider } from "../../types/Providers";
import CsvListDataProvider from "./CsvListDataProvider";

export const listDataProviders: Record<string, ListDataProvider<any>> = {
  csv: new CsvListDataProvider(),
};

import { Primitive } from "type-fest";

/** Basic list of data */
export interface ListData {
  /** Key-value pair */
  [key: string | number]: Exclude<Primitive, undefined>;
}

/** List column */
export interface ListColumn {
  /** Column name */
  name: string;
  /** Column content example */
  example?: string;
}

/** List data params */
export interface ListDataContext<T = undefined> {
  /** List columns provided previously */
  columns: ListColumn[];
  parameters?: T;
}

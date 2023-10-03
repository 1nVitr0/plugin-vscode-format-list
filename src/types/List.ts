/** Basic list of data */
export interface ListData {
  /** Key-value pair */
  [key: string | number]: string | number | boolean | null;
}

/** List column */
export interface ListColumn {
  /** Column name */
  name: string;
  /** Column content example */
  example?: string;
}

/** List data params */
export interface ListDataParams<T = undefined> {
  /** List columns provided previously */
  columns: ListColumn[];
  parameters?: T;
}
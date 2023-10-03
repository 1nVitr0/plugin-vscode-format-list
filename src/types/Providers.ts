import { CancellationToken, ProviderResult, Selection, TextDocument } from "vscode";
import { ListColumn, ListData, ListDataParams } from "./List";

export interface ListDataProvider<P = undefined, T extends ListDataParams<P> = ListDataParams<P>> {
  provideColumns(
    document: TextDocument,
    selection: Selection,
    token: CancellationToken,
    parameters?: P
  ): ProviderResult<T>;
  provideListData(
    document: TextDocument,
    selection: Selection,
    parameters: T,
    token: CancellationToken
  ): ProviderResult<ListData[]>;
}

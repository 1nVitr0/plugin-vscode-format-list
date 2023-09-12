import { CancellationToken, ProviderResult, Selection, TextDocument } from "vscode";
import { ListColumn, ListData, ListDataParams } from "./List";

export interface ListDataProvider<T extends ListDataParams> {
  provideColumns(document: TextDocument, selection: Selection, token: CancellationToken): ProviderResult<T>;
  provideListData(
    document: TextDocument,
    selection: Selection,
    params: T,
    token: CancellationToken
  ): ProviderResult<ListData[]>;
}

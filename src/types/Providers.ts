import { CancellationToken, ProviderResult, Selection, TextDocument } from "vscode";
import { ListData, ListDataContext } from "./List";

export interface ListDataProvider<P = undefined, T extends ListDataContext<P> = ListDataContext<P>> {
  /**
   * Provide all columns for the list at the given selection.
   *
   * @param document The document in which the list is shown.
   * @param selection The selection for which the list is shown.
   * @param token A cancellation token.
   * @param parameters The parameters for the list.
   * @returns The columns for the list.
   */
  provideColumns(
    document: TextDocument,
    selection: Selection,
    token: CancellationToken,
    parameters?: P
  ): ProviderResult<T>;

  /**
   * Provide all data for the list at the given selection.
   *
   * @param document The document in which the list is shown.
   * @param selection The selection for which the list is shown.
   * @param context The context for the list. Contains the columns provided previously.
   * @param token A cancellation token.
   * @returns The data for the list.
   */
  provideListData(
    document: TextDocument,
    selection: Selection,
    context: T,
    token: CancellationToken
  ): ProviderResult<ListData[]>;
}

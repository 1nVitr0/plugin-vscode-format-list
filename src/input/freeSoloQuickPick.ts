import { SetOptional, Writable, WritableKeysOf } from "type-fest";
import { CancellationToken, QuickPick, QuickPickItem, QuickPickOptions, l10n, window } from "vscode";

type QuickPickProperties<I extends QuickPickItem | string> = Pick<
  QuickPick<I extends string ? QuickPickItem : I>,
  Exclude<WritableKeysOf<QuickPick<I extends string ? QuickPickItem : I>>, "items">
>;

export interface FreeSoloQuickPickOptions<I extends QuickPickItem | string> extends Partial<QuickPickProperties<I>> {
  /** Create an item for the input value */
  createInputItem: (value: string) => I extends string ? QuickPickItem : I;
}

export type FreeSoloStringQuickPickOptions<I extends QuickPickItem | string> = SetOptional<
  FreeSoloQuickPickOptions<I>,
  "createInputItem"
>;

const omitQuickQuickOptions: (keyof FreeSoloQuickPickOptions<QuickPickItem>)[] = [] as Exclude<
  keyof FreeSoloQuickPickOptions<QuickPickItem>,
  keyof Writable<QuickPick<QuickPickItem>>
>[];

/**
 * Show a quick pick with free solo input and multiple selection
 *
 * @param items The items to pick from
 * @param options The options for the quick pick
 * @param token A cancellation token
 * @returns The selected items or null if cancelled
 */
export function showFreeSoloQuickPick<I extends QuickPickItem | string>(
  items: I[],
  options: (I extends string ? FreeSoloStringQuickPickOptions<I> : FreeSoloQuickPickOptions<I>) & {
    canSelectMany: true;
  },
  token?: CancellationToken
): Promise<readonly I[] | null>;
/**
 * Show a quick pick with free solo input
 *
 * @param items The items to pick from
 * @param options The options for the quick pick
 * @param token A cancellation token
 * @returns The selected item or null if cancelled
 */
export function showFreeSoloQuickPick<I extends QuickPickItem | string>(
  items: I[],
  options: (I extends string ? FreeSoloStringQuickPickOptions<I> : FreeSoloQuickPickOptions<I>) & {
    canSelectMany?: false;
  },
  token?: CancellationToken
): Promise<I | null>;
/**
 * Show a quick pick with free solo input
 *
 * @param items The items to pick from
 * @param options The options for the quick pick
 * @param token A cancellation token
 * @returns The selected item or null if cancelled
 *          if canSelectMany is true returns an array of selected items
 */
export async function showFreeSoloQuickPick<I extends QuickPickItem | string>(
  items: I[],
  options: I extends string ? FreeSoloStringQuickPickOptions<I> : FreeSoloQuickPickOptions<I>,
  token?: CancellationToken
): Promise<readonly I[] | I | null> {
  return await new Promise<readonly I[] | I | null>((resolve) => {
    const labels = items.map((item) => (typeof item === "string" ? item : item.label));
    const quickPick = window.createQuickPick<I extends string ? QuickPickItem : I>();
    const extendedItems = items.map(
      (item) => (typeof item === "string" ? { label: item } : item) as I extends string ? QuickPickItem : I
    );

    quickPick.items = extendedItems;
    for (const key of Object.keys(options) as (keyof FreeSoloStringQuickPickOptions<I>)[])
      if (!omitQuickQuickOptions.includes(key)) quickPick[key as keyof QuickPickProperties<I>] = options[key] as never;

    quickPick.onDidChangeValue(() => {
      // Inject user values into proposed values
      const { value } = quickPick;
      if (!value) {
        quickPick.items = extendedItems;
      } else if (!labels.includes(value)) {
        const injectedItem = (options.createInputItem?.(value) ?? { label: value }) as I extends string
          ? QuickPickItem
          : I;
        injectedItem.picked = !options.canSelectMany;
        quickPick.items = [injectedItem, ...extendedItems];
      }
    });

    quickPick.onDidChangeSelection(([injectedItem]) => {
      // If an injected value is selected keep it permanently, only triggers if multiple is enabled
      if (options.canSelectMany && injectedItem && !labels.includes(injectedItem.label)) {
        extendedItems.push(injectedItem);
        labels.push(injectedItem.label);
      }
    });

    quickPick.onDidAccept(() => {
      const onlyStringItems = items.every((item) => typeof item === "string");
      if (options.canSelectMany) {
        const selectedItems = (
          onlyStringItems ? quickPick.activeItems.map((item) => item.label) : quickPick.activeItems
        ) as readonly I[];
        resolve(selectedItems);
      } else {
        const selectedItem = (onlyStringItems ? quickPick.activeItems[0]?.label : quickPick.activeItems[0]) as I;
        resolve(selectedItem);
      }
      quickPick.hide();
    });
    quickPick.onDidHide(() => {
      resolve(null);
      quickPick.dispose();
    });
    quickPick.show();

    token?.onCancellationRequested(() => {
      resolve(null);
      quickPick.hide();
    });
  });
}

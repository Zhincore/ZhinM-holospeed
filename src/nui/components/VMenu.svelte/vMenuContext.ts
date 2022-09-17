import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

export interface IVMenuItem {
  isAttached: boolean;
}

export interface IVMenuStore {
  activeItem: number;
  offset: number;
  itemsPerPage: number;
  selectableItems: Record<number, IVMenuItem>;
}
type IVMenuWritable = ReturnType<typeof VMenuWritable>;

export interface IVMenuContext {
  vMenu: IVMenuWritable;
  itemCount: number;
  selectableItemCount: number;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

function VMenuWritable(itemsPerPage: number) {
  const store = writable<IVMenuStore>({ activeItem: 0, offset: 0, itemsPerPage, selectableItems: {} });

  const update = (data: DeepPartial<IVMenuStore>) =>
    store.update((v) => ({ ...v, ...data, selectableItems: { ...v.selectableItems, ...data.selectableItems } }));

  return {
    ...store,
    update,
    updateItem(i: number, item: IVMenuItem) {
      update({ selectableItems: { [i]: item } });
    },
    setActive(i: number) {
      update({ activeItem: i });
    },
  };
}

const CONTEXT_KEY = Symbol("vMenu");
export const createVMenuContext = (itemsPerPage: number) =>
  setContext<IVMenuContext>(CONTEXT_KEY, { vMenu: VMenuWritable(itemsPerPage), itemCount: -1, selectableItemCount: 0 });
export const getVMenuContext = () => getContext<IVMenuContext>(CONTEXT_KEY);

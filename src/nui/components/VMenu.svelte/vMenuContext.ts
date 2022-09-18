import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

export interface IVMenuStore {
  activeItem: number;
  offset: number;
  itemsPerPage: number;
  itemCount: number;
  selectableItemCount: number;
}
type IVMenuWritable = ReturnType<typeof VMenuWritable>;

export interface IVMenuContext {
  vMenu: IVMenuWritable;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

function VMenuWritable(itemsPerPage: number) {
  let itemCount = -1;
  let selectableItemCount = 0;
  const store = writable<IVMenuStore>({
    activeItem: 0,
    offset: 0,
    itemCount,
    selectableItemCount,
    itemsPerPage,
  });

  const update = (data: DeepPartial<IVMenuStore>) =>
    store.update((v) => ({
      ...v,
      ...data,
    }));

  return {
    ...store,
    resetIds() {
      itemCount = selectableItemCount = 0;
      update({ selectableItemCount, itemCount });
    },
    getItemId() {
      const id = itemCount++;
      update({ itemCount });
      return id;
    },
    getSelectableItemId() {
      const id = selectableItemCount++;
      update({ selectableItemCount });
      return id;
    },
    update,
    setActive(i: number) {
      return update({ activeItem: i });
    },
  };
}

const CONTEXT_KEY = Symbol("vMenu");
export const createVMenuContext = (itemsPerPage: number) =>
  setContext<IVMenuContext>(CONTEXT_KEY, { vMenu: VMenuWritable(itemsPerPage) });
export const getVMenuContext = () => getContext<IVMenuContext>(CONTEXT_KEY);

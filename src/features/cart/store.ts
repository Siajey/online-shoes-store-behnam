import { createPersistedStore } from "@/lib/persisted-store";
import {
  addItem,
  parseStoredCart,
  removeItem,
  serializeCart,
  setQuantity,
  toCartItem,
} from "./cart";
import type { CartItem, CartableProduct } from "./types";

export const CART_STORAGE_KEY = "cart";

type StoreOptions = Parameters<typeof createPersistedStore<CartItem>>[0];

/**
 * فروشگاه سبد خرید. سبد مهمان فقط در مرورگر می‌ماند؛
 * ادغام با سبد سرور بعد از ورود کار مرحله‌ی بعد است (☐).
 */
export function createCartStore(options: Pick<StoreOptions, "getStorage" | "target">) {
  const store = createPersistedStore<CartItem>({
    key: CART_STORAGE_KEY,
    parse: parseStoredCart,
    serialize: serializeCart,
    ...options,
  });
  const empty = store.getServerSnapshot();

  return {
    getSnapshot: store.getSnapshot,
    getServerSnapshot: store.getServerSnapshot,
    subscribe: store.subscribe,
    add: (product: CartableProduct, quantity = 1) =>
      store.update((items) => addItem(items, toCartItem(product), quantity)),
    setQuantity: (id: string, quantity: number) =>
      store.update((items) => setQuantity(items, id, quantity)),
    remove: (id: string) => store.update((items) => removeItem(items, id)),
    clear: () => store.update(() => empty),
  };
}

export type CartStore = ReturnType<typeof createCartStore>;

/** نمونه‌ی اصلی برنامه. */
export const cartStore = createCartStore({
  getStorage: () => (typeof window === "undefined" ? null : window.localStorage),
  target: typeof window === "undefined" ? null : window,
});

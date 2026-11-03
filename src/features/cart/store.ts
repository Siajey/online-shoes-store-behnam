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

type StorageLike = Pick<Storage, "getItem" | "setItem">;
type EventTargetLike = Pick<Window, "addEventListener" | "removeEventListener">;

type Options = {
  /** حافظه‌ی مرورگر؛ روی سرور null است. ممکن است خودش خطا بدهد (حالت خصوصی). */
  getStorage: () => StorageLike | null;
  /** برای هم‌گام شدن تب‌ها (رویداد storage). */
  target?: EventTargetLike | null;
};

const EMPTY: readonly CartItem[] = Object.freeze([]);

/**
 * فروشگاه ساده‌ی سبد خرید، سازگار با useSyncExternalStore.
 * سبد مهمان فقط در مرورگر می‌ماند؛ بعد از ورود، ادغام با سبد سرور کار مرحله‌ی بعد است (☐).
 */
export function createCartStore({ getStorage, target = null }: Options) {
  let items: readonly CartItem[] = EMPTY;
  let loaded = false;
  const listeners = new Set<() => void>();

  const storage = (): StorageLike | null => {
    try {
      return getStorage();
    } catch {
      return null;
    }
  };

  const read = (): readonly CartItem[] => {
    try {
      const list = parseStoredCart(storage()?.getItem(CART_STORAGE_KEY) ?? null);
      return list.length > 0 ? list : EMPTY;
    } catch {
      return EMPTY;
    }
  };

  const emit = () => listeners.forEach((l) => l());

  function ensureLoaded() {
    if (loaded) return;
    loaded = true;
    items = read();
  }

  function commit(next: readonly CartItem[]) {
    ensureLoaded();
    if (next === items) return;
    items = next.length > 0 ? next : EMPTY;
    try {
      storage()?.setItem(CART_STORAGE_KEY, serializeCart(items));
    } catch {
      // پر بودن یا بسته بودن حافظه: سبد همچنان تا بستن صفحه در حافظه‌ی برنامه کار می‌کند.
    }
    emit();
  }

  const onStorage = (event: Event) => {
    const key = (event as StorageEvent).key;
    if (key !== null && key !== CART_STORAGE_KEY) return;
    loaded = true;
    items = read();
    emit();
  };

  return {
    getSnapshot(): readonly CartItem[] {
      ensureLoaded();
      return items;
    },
    /** روی سرور (و هنگام هیدریت) همیشه خالی است تا HTML سرور و مرورگر یکی باشد. */
    getServerSnapshot(): readonly CartItem[] {
      return EMPTY;
    },
    subscribe(listener: () => void) {
      if (listeners.size === 0) target?.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) target?.removeEventListener("storage", onStorage);
      };
    },
    add(product: CartableProduct, quantity = 1) {
      ensureLoaded();
      commit(addItem(items, toCartItem(product), quantity));
    },
    setQuantity(id: string, quantity: number) {
      ensureLoaded();
      commit(setQuantity(items, id, quantity));
    },
    remove(id: string) {
      ensureLoaded();
      commit(removeItem(items, id));
    },
    clear() {
      ensureLoaded();
      commit(EMPTY);
    },
  };
}

export type CartStore = ReturnType<typeof createCartStore>;

/** نمونه‌ی اصلی برنامه. */
export const cartStore = createCartStore({
  getStorage: () => (typeof window === "undefined" ? null : window.localStorage),
  target: typeof window === "undefined" ? null : window,
});

import type { Product } from "@/features/products/types";
import { createPersistedStore } from "@/lib/persisted-store";
import { parseStoredFavourites, serializeFavourites, toggleFavourite } from "./favourites";

export const FAVOURITES_STORAGE_KEY = "favourites";

type Options = Pick<Parameters<typeof createPersistedStore<Product>>[0], "getStorage" | "target">;

/**
 * علاقه‌مندی‌های مهمان در مرورگر. خود محصول (برای نمایش بدون API) ذخیره می‌شود؛
 * قیمت و موجودی ممکن است کهنه باشد. ☐ بعد از ورود، لیست حساب از API می‌آید و ادغام می‌شود.
 */
export function createFavouritesStore(options: Options) {
  const store = createPersistedStore<Product>({
    key: FAVOURITES_STORAGE_KEY,
    parse: parseStoredFavourites,
    serialize: serializeFavourites,
    ...options,
  });
  return {
    getSnapshot: store.getSnapshot,
    getServerSnapshot: store.getServerSnapshot,
    subscribe: store.subscribe,
    toggle: (product: Product) => store.update((items) => toggleFavourite(items, product)),
  };
}

export const favouritesStore = createFavouritesStore({
  getStorage: () => (typeof window === "undefined" ? null : window.localStorage),
  target: typeof window === "undefined" ? null : window,
});

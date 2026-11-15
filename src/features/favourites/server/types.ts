import type { Product } from "@/features/products/types";

export type FavouritesPage = { items: Product[]; nextCursor: string | null };

export type FavouritesMerge = { added: number; skippedProductIds: string[] };

/** درگاه علاقه‌مندی‌های سرور؛ برای تست جایگزین می‌شود. */
export type FavouritesServerApi = {
  list(cursor?: string): Promise<FavouritesPage>;
  ids(): Promise<string[]>;
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
  merge(productIds: string[]): Promise<FavouritesMerge>;
};

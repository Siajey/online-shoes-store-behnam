/** شکل پاسخ API علاقه‌مندی‌های بک‌اند (قیمت‌ها به ریال). فقط mapper این‌ها را می‌خواند. */
export type FavoriteItemDto = {
  productId: string;
  name: string;
  slug: string;
  imageKey: string | null;
  imageUrl?: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  favoritedAt: string;
};

export type FavoritesPageDto = { items: FavoriteItemDto[]; nextCursor: string | null };
export type FavoriteIdsDto = { productIds: string[] };
export type MergeFavoritesDto = { added: number; skippedProductIds: string[] };

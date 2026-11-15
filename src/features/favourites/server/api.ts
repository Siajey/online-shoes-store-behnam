import { api } from "@/lib/api";
import type { FavoriteIdsDto, FavoritesPageDto, MergeFavoritesDto } from "./dto";
import { toFavouriteProduct } from "./mappers";
import type { FavouritesServerApi } from "./types";

/** مثل سبد: بک‌اند CSRF را روی همه‌ی مسیرها (حتی GET) می‌خواهد. */
const withCsrf = { csrf: true } as const;

/** سقف علاقه‌مندی‌ها و تعداد شناسه در یک ادغام (قرارداد بک‌اند). */
export const SERVER_MAX_FAVOURITES = 200;
export const PAGE_SIZE = 20;

const one = (id: string) => `/favorites/${encodeURIComponent(id)}`;

export const favouritesServerApi: FavouritesServerApi = {
  list: async (cursor) => {
    const { data } = await api.get<FavoritesPageDto>("/favorites", {
      ...withCsrf,
      query: { pageSize: PAGE_SIZE, nextCursor: cursor },
    });
    return { items: data.items.map(toFavouriteProduct), nextCursor: data.nextCursor ?? null };
  },
  ids: async () => (await api.get<FavoriteIdsDto>("/favorites/ids", withCsrf)).data.productIds,
  add: async (productId) => {
    await api.put(one(productId), withCsrf);
  },
  remove: async (productId) => {
    await api.delete(one(productId), withCsrf);
  },
  merge: async (productIds) =>
    (await api.post<MergeFavoritesDto>("/favorites/merge", { ...withCsrf, body: { productIds } }))
      .data,
};

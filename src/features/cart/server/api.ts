import { api } from "@/lib/api";
import type { CartDto, MergeCartDto } from "./dto";
import { toServerCart } from "./mappers";
import type { CartServerApi } from "./types";

/** سبد در بک‌اند CSRF را روی GET هم می‌خواهد، پس توکن همیشه فرستاده می‌شود. */
const withCsrf = { csrf: true } as const;

/** سقف تعداد ردیف در یک ادغام (قرارداد بک‌اند). */
export const MERGE_MAX_LINES = 50;

export const cartServerApi: CartServerApi = {
  get: async () => toServerCart((await api.get<CartDto>("/cart", withCsrf)).data),
  add: async (variantId, quantity) =>
    toServerCart(
      (await api.post<CartDto>("/cart/items", { ...withCsrf, body: { variantId, quantity } })).data,
    ),
  setQuantity: async (variantId, quantity) =>
    toServerCart(
      (
        await api.patch<CartDto>(`/cart/items/${encodeURIComponent(variantId)}`, {
          ...withCsrf,
          body: { quantity },
        })
      ).data,
    ),
  remove: async (variantId) =>
    toServerCart(
      (await api.delete<CartDto>(`/cart/items/${encodeURIComponent(variantId)}`, withCsrf)).data,
    ),
  clear: async () => toServerCart((await api.delete<CartDto>("/cart", withCsrf)).data),
  merge: async (items) => {
    const { data } = await api.post<MergeCartDto>("/cart/merge", {
      ...withCsrf,
      body: { items },
    });
    return { cart: toServerCart(data.cart), skippedVariantIds: data.skippedVariantIds };
  },
};

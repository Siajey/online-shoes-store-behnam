import { api, type Page } from "@/lib/api";
import type { CouponDto, CouponUsageDto, DiscountDto, OfferPageDto } from "./dto";
import { toAdminCoupon, toAdminDiscount, toCouponUsage } from "./mappers";
import type { AdminCoupon, AdminDiscount, CouponUsage } from "./types";

export type OfferFilter = { isActive?: boolean };

const one = (base: string, id: string) => `${base}/${encodeURIComponent(id)}`;

function resource<Dto, Item>(base: string, map: (dto: Dto) => Item) {
  return {
    async list(
      filter: OfferFilter = {},
      opts: { cursor?: string; limit?: number; signal?: AbortSignal } = {},
    ): Promise<Page<Item>> {
      const res = await api.get<OfferPageDto<Dto>>(base, {
        query: {
          isActive: filter.isActive === undefined ? undefined : String(filter.isActive),
          nextCursor: opts.cursor,
          pageSize: opts.limit,
          sort: "createdAt:desc",
        },
        signal: opts.signal,
      });
      return { items: res.data.items.map(map), nextCursor: res.data.nextCursor ?? null };
    },
    async get(id: string, signal?: AbortSignal): Promise<Item> {
      return map((await api.get<Dto>(one(base, id), { signal })).data);
    },
    async create(body: Record<string, unknown>): Promise<Item> {
      return map((await api.post<Dto>(base, { body })).data);
    },
    async update(id: string, body: Record<string, unknown>): Promise<Item> {
      return map((await api.patch<Dto>(one(base, id), { body })).data);
    },
    async remove(id: string): Promise<void> {
      await api.delete(one(base, id));
    },
  };
}

export const discountsApi = resource<DiscountDto, AdminDiscount>(
  "/admin/discounts",
  toAdminDiscount,
);
export const couponsApi = resource<CouponDto, AdminCoupon>("/admin/coupons", toAdminCoupon);

export async function fetchCouponUsage(id: string, signal?: AbortSignal): Promise<CouponUsage> {
  const res = await api.get<CouponUsageDto>(`${one("/admin/coupons", id)}/usage`, { signal });
  return toCouponUsage(res.data);
}

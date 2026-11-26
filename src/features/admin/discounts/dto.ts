import type { DiscountKind, DiscountScope } from "./types";

/** شکل پاسخ API تخفیف و کوپن بک‌اند (مبالغ به تومان). فقط mapper این‌ها را می‌خواند. */
export type DiscountDto = {
  id: string;
  name: string;
  kind: DiscountKind;
  value: number;
  maxDiscountPerUnit: number | null;
  scope: DiscountScope;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CouponDto = {
  id: string;
  code: string;
  name: string;
  kind: DiscountKind;
  value: number;
  maxDiscount: number | null;
  minOrderAmount: number | null;
  scope: DiscountScope;
  applyToDiscountedItems: boolean;
  startsAt: string | null;
  endsAt: string | null;
  usageLimitTotal: number | null;
  usageLimitPerUser: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CouponUsageDto = {
  reserved: number;
  committed: number;
  released: number;
  totalDiscount: number;
};

export type OfferPageDto<T> = { items: T[]; nextCursor: string | null };

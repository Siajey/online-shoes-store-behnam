export const DISCOUNT_KINDS = ["percent", "fixed"] as const;
export type DiscountKind = (typeof DISCOUNT_KINDS)[number];

export const SCOPE_TYPES = ["all", "category", "brand", "product", "variant"] as const;
export type ScopeType = (typeof SCOPE_TYPES)[number];

export type DiscountScope = { type: ScopeType; targetIds: string[] };

/** مبالغ این مدل‌ها «تومان» هستند. value برای نوع percent درصد است. */
export type AdminDiscount = {
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
};

export type AdminCoupon = {
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
};

export type CouponUsage = {
  reserved: number;
  committed: number;
  released: number;
  /** تومان */
  totalDiscount: number;
};

export type OfferKind = "discount" | "coupon";

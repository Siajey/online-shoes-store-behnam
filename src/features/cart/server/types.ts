import type { CartCoupon, CartItem } from "../types";

export type ServerCart = {
  items: CartItem[];
  hasUnavailable: boolean;
  coupon: CartCoupon;
  /** مبلغ تخفیف کد، به تومان */
  couponDiscount: number;
};

export type MergeResult = { cart: ServerCart; skippedVariantIds: string[] };

export type MergeLine = { variantId: string; quantity: number };

/** درگاه سبد سرور؛ برای تست جایگزین می‌شود. */
export type CartServerApi = {
  get(): Promise<ServerCart>;
  add(variantId: string, quantity: number): Promise<ServerCart>;
  setQuantity(variantId: string, quantity: number): Promise<ServerCart>;
  remove(variantId: string): Promise<ServerCart>;
  clear(): Promise<ServerCart>;
  merge(lines: MergeLine[]): Promise<MergeResult>;
  applyCoupon(code: string): Promise<ServerCart>;
  removeCoupon(): Promise<ServerCart>;
};

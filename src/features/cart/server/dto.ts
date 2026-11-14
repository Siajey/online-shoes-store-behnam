/** شکل پاسخ API سبد بک‌اند (قیمت‌ها به ریال). فقط mapper این‌ها را می‌خواند. */
export type CartUnavailableReasonDto =
  "variantUnavailable" | "productUnavailable" | "outOfStock" | "insufficientStock";

export type CartLineDto = {
  variantId: string;
  quantity: number;
  available: boolean;
  unavailableReason: CartUnavailableReasonDto | null;
  /** کمینه‌ی موجودی و سقف هر ردیف؛ برای ترکیب حذف‌شده ۰ است. */
  maxQuantity: number;
  /** برای ترکیبی که از سیستم حذف شده null است. */
  product: { id: string; name: string; slug: string; imageKey: string | null } | null;
  attributes: { name: string; value: string }[];
  originalUnitPrice: number | null;
  unitPrice: number | null;
  lineTotal: number | null;
};

export type CartDto = {
  items: CartLineDto[];
  coupon: { code: string | null; status: string };
  totals: {
    itemCount: number;
    subtotal: number;
    productDiscountTotal: number;
    couponDiscount: number;
    total: number;
  };
  hasUnavailableLines: boolean;
};

export type MergeCartDto = { cart: CartDto; skippedVariantIds: string[] };

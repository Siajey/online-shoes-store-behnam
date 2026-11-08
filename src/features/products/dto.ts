/**
 * شکل محصول در GET /products — از نمونه‌ی واقعی بک‌اند (__fixtures__/products.json).
 * اگر بک‌اند عوض شد، فقط این فایل و mappers.ts عوض می‌شوند.
 */
/** ☐ حدس از دامنه‌ی بک‌اند (sku, price, stock, attributes, isActive)؛ با پاسخ HTTP واقعی تطبیق داده شود. */
export type VariantDto = {
  id: string;
  sku?: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  attributes: { name: string; value: string }[];
};

export type ProductDto = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  thumbnail: string | null;
  pricing: {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    /** در نمونه: "TOMAN" */
    currency: string;
    discount: {
      /** مثل PERCENTAGE یا FIXED_AMOUNT */
      type: string;
      value: number;
      /** متن آماده برای نمایش، مثل «۲۰٪ تخفیف» */
      label: string;
    } | null;
  };
  isAvailable: boolean;
  badges: { type: string; label: string }[];
  category: { id: string; name: string; slug: string } | null;
  variants?: VariantDto[];
};

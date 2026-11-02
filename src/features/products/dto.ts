/**
 * شکل محصول در GET /products — از نمونه‌ی واقعی بک‌اند (__fixtures__/products.json).
 * اگر بک‌اند عوض شد، فقط این فایل و mappers.ts عوض می‌شوند.
 */
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
};

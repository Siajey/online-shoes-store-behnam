/** یک ترکیب سایز/رنگ از محصول. options مثل { "سایز": "۴۲", "رنگ": "مشکی" }. */
export type ProductVariant = {
  id: string;
  sku?: string;
  /** قیمت نهایی این ترکیب، به تومان */
  price: number;
  originalPrice?: number;
  available: boolean;
  options: Readonly<Record<string, string>>;
};

/** مدل داخلی فرانت. UI فقط با همین کار می‌کند و از شکل API خبر ندارد. */
export type Product = {
  id: string;
  /** شناسه‌ی خوانا برای آدرس صفحه، مثل nike-air-max-90 */
  slug: string;
  name: string;
  /** کد کالا */
  sku?: string;
  /** قیمت نهایی (بعد از تخفیف)، عدد صحیح به تومان */
  price: number;
  /** قیمت قبل از تخفیف؛ فقط وقتی تخفیف واقعی دارد */
  originalPrice?: number;
  /** متن آماده‌ی تخفیف مثل «۲۰٪ تخفیف» */
  discountLabel?: string;
  /** برچسب اصلی مثل «پرفروش» */
  tag?: string;
  imageUrl?: string;
  available: boolean;
  categoryName?: string;
  categorySlug?: string;
  /** ترکیب‌های سایز/رنگ؛ اگر نبود، محصول انتخاب ندارد. ☐ منتظر variantها در API HTTP. */
  variants?: readonly ProductVariant[];
};

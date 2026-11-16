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
  /** توضیحات (فقط در صفحه‌ی محصول) */
  description?: string;
  /** همه‌ی تصاویر گالری (فقط در صفحه‌ی محصول) */
  images?: readonly string[];
  /** نام رنگ‌های موجود (از options محصول)؛ اگر بک‌اند نفرستد نیست */
  colors?: readonly string[];
  /** مشخصات فنی برای تب «مشخصات»؛ فقط مقدارهایی که بک‌اند داده */
  specs?: readonly { label: string; value: string }[];
  /** بیشترین قیمت ترکیب‌ها؛ فقط وقتی با قیمت پایه فرق دارد */
  maxPrice?: number;
  /** ترکیب‌های سایز/رنگ؛ اگر نبود، محصول انتخاب ندارد. ☐ منتظر variantها در API HTTP. */
  variants?: readonly ProductVariant[];
};

export type FacetValue = { value: string; count: number };

/** گزینه‌های فیلتر کاتالوگ برای نوار کناری (از /products/filters). */
export type CatalogFacets = {
  brands: { id: string; name: string; slug: string; count: number }[];
  /** به تومان؛ null اگر محصولی نیست */
  priceRange: { min: number; max: number } | null;
  /** نام دقیق ویژگی در بک‌اند (برای پارامتر attributes) */
  colorAttribute: string;
  colors: FacetValue[];
  sizeAttribute: string;
  sizes: FacetValue[];
};

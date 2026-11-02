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
};

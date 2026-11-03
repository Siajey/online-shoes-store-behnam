/**
 * یک ردیف سبد خرید.
 * نام، قیمت و تصویر هنگام افزودن «عکس‌برداری» می‌شوند تا سبد بدون درخواست به API نمایش داده شود.
 * ⚠ این قیمت فقط برای نمایش است؛ در مرحله‌ی پرداخت، قیمت واقعی را سرور دوباره حساب می‌کند.
 */
export type CartItem = {
  /** شناسه‌ی محصول (UUID) */
  id: string;
  slug: string;
  name: string;
  /** قیمت نهایی هر عدد، به تومان */
  price: number;
  /** قیمت قبل از تخفیف؛ فقط وقتی تخفیف دارد */
  originalPrice?: number;
  imageUrl?: string;
  quantity: number;
};

/** بخشی از محصول که برای افزودن به سبد لازم است (بدون وابستگی به فیچر محصولات). */
export type CartableProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
};

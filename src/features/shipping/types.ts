export type ShippingOption = {
  /** کد روش ارسال؛ همین در ثبت سفارش به‌عنوان shippingMethod فرستاده می‌شود. */
  code: string;
  name: string;
  description: string | null;
  /** برای آدرس و سبد فعلی قابل ارائه است. */
  available: boolean;
  /** هزینه‌ی ارسال به تومان؛ برای رایگان یا ناموجود صفر. */
  fee: number;
  isFree: boolean;
  days: { min: number; max: number } | null;
};

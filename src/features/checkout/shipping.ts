/**
 * شیوه‌های ارسال فروشگاه: فقط پست پیشتاز و تیپاکس (پیک موتوری و پرداخت در محل نداریم).
 * قیمت‌ها را فقط بک‌اند از شرکت‌های حمل می‌گیرد؛ تا آماده شدن آن، گزینه‌ها غیرفعال‌اند.
 * ☐ وقتی POST /shipping/quotes آماده شد: قیمت و بازه‌ی تحویل از پاسخ سرور بیاید و جمع نهایی هم از سرور.
 */
export type ShippingMethodId = "post-pishtaz" | "tipax";

export type ShippingMethod = {
  id: ShippingMethodId;
  label: string;
  description: string;
};

export const SHIPPING_METHODS: readonly ShippingMethod[] = [
  { id: "post-pishtaz", label: "پست پیشتاز", description: "ارسال با اداره‌ی پست، همراه کد رهگیری" },
  { id: "tipax", label: "تیپاکس", description: "ارسال با تیپاکس، همراه کد رهگیری" },
];

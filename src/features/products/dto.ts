/**
 * شکل محصول در پاسخ API.
 * ⚠ فرض موقت و حداقلی است. وقتی Swagger یا نمونه‌ی واقعی بک‌اند رسید،
 * این فایل (یا تایپ تولیدشده با pnpm api:gen) و mappers.ts تنها جاهایی‌اند که عوض می‌شوند.
 */
export type ProductDto = {
  id: string;
  name: string;
  /** عدد صحیح، به تومان */
  price: number;
  imageUrl?: string | null;
  badge?: string | null;
};

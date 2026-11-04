import { z } from "zod";

/** آدرس تصویر ذخیره‌شده در مرورگر: فقط http(s) مطلق یا مسیر داخلی پذیرفته می‌شود. */
export const safeUrl = z
  .string()
  .max(2000)
  .refine((u) => /^(https?:\/\/|\/)/.test(u));

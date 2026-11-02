import { env } from "@/config/env";
import { createApiClient } from "./client";

/** نمونه‌ی آماده برای کل برنامه. آدرس فقط هنگام اولین درخواست از env خوانده می‌شود. */
export const api = createApiClient({
  baseUrl: () => env.NEXT_PUBLIC_API_URL,
  // ☐ بعد از ساخت صفحه‌ی ورود: هدایت به /login
});

export { ApiRequestError, isApiRequestError } from "./errors";
export type { ApiSuccess, CursorMeta, Page } from "./types";

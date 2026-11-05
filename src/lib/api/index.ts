import { env } from "@/config/env";
import { emitAuthLost } from "./auth-events";
import { createApiClient } from "./client";

/** نمونه‌ی آماده برای کل برنامه. آدرس فقط هنگام اولین درخواست از env خوانده می‌شود. */
export const api = createApiClient({
  baseUrl: () => env.NEXT_PUBLIC_API_URL,
  onAuthLost: emitAuthLost,
});

export { ApiRequestError, isApiRequestError } from "./errors";
export type { ApiSuccess, CursorMeta, Page } from "./types";

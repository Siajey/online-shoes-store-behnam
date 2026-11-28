import { ordersCopy as t } from "./copy";

/** برچسب فارسی وضعیت مرسوله؛ مقدار ناشناخته همان‌طور که هست نشان داده می‌شود. */
export const trackingStatusLabel = (s: string): string => t.trackingStatuses[s] ?? s;

/** فقط لینک http(s) برای href پذیرفته می‌شود. */
export const safeTrackingUrl = (u: string | null): string | null =>
  u && /^https?:\/\//i.test(u) ? u : null;

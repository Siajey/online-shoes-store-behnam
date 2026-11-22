import { toPersianDigits } from "@/lib/format";
import type { ProductStatsRefreshDto } from "./dto";

export const IN_PROGRESS_CODE = "INSIGHTS_REFRESH_IN_PROGRESS";

export const insightsCopy = {
  title: "برچسب‌های پرفروش و محبوب",
  description:
    "برچسب‌ها هر ساعت خودکار از روی فروش و علاقه‌مندی‌های ۳۰ روز اخیر بروز می‌شوند. برای دیدن اثر یک سفارش یا علاقه‌مندی جدید، همین حالا بروزرسانی کنید.",
  cta: "بروزرسانی برچسب‌ها",
  running: "در حال بروزرسانی…",
  inProgress: "بروزرسانی در حال انجام است. کمی بعد دوباره تلاش کنید.",
  genericError: "بروزرسانی برچسب‌ها انجام نشد. دوباره تلاش کنید.",
  summary: (r: ProductStatsRefreshDto) =>
    `${toPersianDigits(r.products)} محصول بررسی شد؛ ${toPersianDigits(r.bestSellers)} پرفروش و ${toPersianDigits(r.popular)} محبوب (${toPersianDigits(r.windowDays)} روز اخیر)`,
} as const;

/** پیام خطا بر اساس code سرور؛ هرگز بر متن پیام تکیه نمی‌کند. */
export const refreshErrorMessage = (code: string | undefined): string =>
  code === IN_PROGRESS_CODE ? insightsCopy.inProgress : insightsCopy.genericError;

import { api } from "@/lib/api";
import type { ProductStatsRefreshDto } from "./dto";

/**
 * بروزرسانی فوری برچسب‌های «پرفروش» و «محبوب». درخواست تا پایان بروزرسانی منتظر می‌ماند،
 * پس نیازی به polling نیست. بدنه ندارد؛ CSRF را کلاینت برای درخواست‌های تغییردهنده می‌فرستد.
 */
export async function refreshProductStats(): Promise<ProductStatsRefreshDto> {
  const res = await api.post<ProductStatsRefreshDto>("/admin/insights/product-stats/refresh");
  return res.data;
}

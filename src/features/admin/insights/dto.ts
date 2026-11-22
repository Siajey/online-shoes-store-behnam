/** پاسخ POST /admin/insights/product-stats/refresh (داخل data). */
export type ProductStatsRefreshDto = {
  windowDays: number;
  products: number;
  bestSellers: number;
  popular: number;
  durationMs: number;
};

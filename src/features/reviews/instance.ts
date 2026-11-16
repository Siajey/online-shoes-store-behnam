import { createFakeReviewsGateway, createLocalReviewsStore } from "./fake-gateway";
import { createReviewsService } from "./service";

/** ☐ ذخیره‌ی نظرهای فیک در مرورگر؛ با API واقعی حذف می‌شود. */
const localStore = createLocalReviewsStore({
  getStorage: () => (typeof window === "undefined" ? null : window.localStorage),
  target: typeof window === "undefined" ? null : window,
});

/** نمونه‌ی اصلی برنامه: همه‌ی بخش‌های سایت نظرها را فقط از اینجا می‌گیرند. */
export const reviewsService = createReviewsService(createFakeReviewsGateway({ store: localStore }));

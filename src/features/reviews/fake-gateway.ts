import { ReviewError, type ReviewsGateway } from "./gateway";
import { reviewsCopy } from "./copy";
import { buildReview, newestFirst, parseStoredReviews, serializeReviews } from "./reviews";
import { seededReviews } from "./seed";
import { createPersistedStore } from "@/lib/persisted-store";
import type { Review } from "./types";

export const REVIEWS_STORAGE_KEY = "reviews";

type StoreOptions = Pick<
  Parameters<typeof createPersistedStore<Review>>[0],
  "getStorage" | "target"
>;

/** نظرهای ثبت‌شده توسط کاربر در مرورگر (فقط تا وجود API) */
export function createLocalReviewsStore(options: StoreOptions) {
  return createPersistedStore<Review>({
    key: REVIEWS_STORAGE_KEY,
    parse: parseStoredReviews,
    serialize: serializeReviews,
    ...options,
  });
}

type Deps = {
  store: ReturnType<typeof createLocalReviewsStore>;
  now?: () => Date;
  newId?: () => string;
};

/**
 * ☐ منبع داده‌ی موقت: نظرهای نمونه + نظرهای ثبت‌شده در مرورگر کاربر.
 * با آماده شدن API بک‌اند با یک gateway واقعی (HTTP) جایگزین شود.
 */
export function createFakeReviewsGateway({
  store,
  now = () => new Date(),
  newId = () => `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
}: Deps): ReviewsGateway {
  return {
    async listForProduct(productId) {
      const mine = store.getSnapshot().filter((r) => r.productId === productId);
      // نام و slug کالا برای نظرهای نمونه فقط برای «نظرات من» لازم است؛ اینجا خالی می‌ماند.
      const seeded = seededReviews({ id: productId, name: "", slug: "" });
      return newestFirst([...mine, ...seeded]);
    },
    async create(input) {
      const duplicate = store
        .getSnapshot()
        .some((r) => r.productId === input.productId && r.authorId === input.author.id);
      if (duplicate) throw new ReviewError(reviewsCopy.errors.duplicate);
      const review = buildReview(input, newId(), now());
      store.update((items) => [review, ...items]);
      return review;
    },
    async listMine(userId) {
      return newestFirst(store.getSnapshot().filter((r) => r.authorId === userId));
    },
  };
}

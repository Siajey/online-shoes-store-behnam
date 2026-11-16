import type { NewReview, Review } from "./types";

/** پیام خطای قابل‌نمایش به کاربر (مثل نظر تکراری). خطاهای دیگر پیام عمومی می‌گیرند. */
export class ReviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewError";
  }
}

/**
 * مرز بین فرانت و منبع داده‌ی نظرات. فعلاً fake-gateway.ts پیاده‌سازی می‌کند؛
 * وقتی API بک‌اند آماده شد فقط یک پیاده‌سازی HTTP با همین سه تابع نوشته و در instance.ts جایگزین می‌شود.
 * قرارداد پیشنهادی endpointها: docs/REVIEWS_API.md
 */
export interface ReviewsGateway {
  /** نظرهای تأییدشده‌ی یک کالا، تازه‌ترین اول */
  listForProduct(productId: string, signal?: AbortSignal): Promise<readonly Review[]>;
  /** ثبت نظر کاربر وارد‌شده؛ نظر تکراری ReviewError می‌دهد */
  create(input: NewReview): Promise<Review>;
  /** نظرهای خود کاربر در همه‌ی کالاها، تازه‌ترین اول */
  listMine(userId: string, signal?: AbortSignal): Promise<readonly Review[]>;
}

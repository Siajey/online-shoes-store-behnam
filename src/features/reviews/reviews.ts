import type { NewReview, Rating, Review, ReviewSummary } from "./types";

export const REVIEW_LIMITS = { bodyMin: 10, bodyMax: 1000, titleMax: 80 } as const;

export const RATINGS: readonly Rating[] = [5, 4, 3, 2, 1];

export type ReviewFieldErrors = Partial<Record<"rating" | "title" | "body", string>>;

export function isRating(value: unknown): value is Rating {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

/** اعتبارسنجی ورودی فرم. اگر خطایی نبود null برمی‌گرداند. پیام‌ها از copy می‌آید (ورودی messages). */
export function validateReview(
  input: { rating: number | null; title: string; body: string },
  messages: {
    rating: string;
    bodyShort: string;
    bodyLong: string;
    titleLong: string;
  },
): ReviewFieldErrors | null {
  const errors: ReviewFieldErrors = {};
  if (!isRating(input.rating)) errors.rating = messages.rating;
  const body = input.body.trim();
  if (body.length < REVIEW_LIMITS.bodyMin) errors.body = messages.bodyShort;
  else if (body.length > REVIEW_LIMITS.bodyMax) errors.body = messages.bodyLong;
  if (input.title.trim().length > REVIEW_LIMITS.titleMax) errors.title = messages.titleLong;
  return Object.keys(errors).length > 0 ? errors : null;
}

export function summarizeReviews(reviews: readonly Review[]): ReviewSummary {
  const distribution: Record<Rating, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  for (const r of reviews) {
    distribution[r.rating] += 1;
    total += r.rating;
  }
  const count = reviews.length;
  return {
    count,
    average: count === 0 ? 0 : Math.round((total / count) * 10) / 10,
    distribution,
  };
}

export const newestFirst = (reviews: readonly Review[]): Review[] =>
  [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

/** ورودی را به Review تبدیل می‌کند (فقط برای منبع داده‌ی موقت؛ بک‌اند خودش می‌سازد). */
export function buildReview(input: NewReview, id: string, now: Date): Review {
  const title = input.title?.trim();
  return {
    id,
    productId: input.productId,
    productName: input.productName,
    productSlug: input.productSlug,
    authorId: input.author.id,
    authorName: input.author.name,
    rating: input.rating,
    title: title ? title : undefined,
    body: input.body.trim(),
    createdAt: now.toISOString(),
    verifiedPurchase: false,
  };
}

/** نمایش تاریخ فارسی؛ مقدار نامعتبر رشته‌ی خالی می‌دهد. */
export function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long", timeZone: "UTC" }).format(date);
}

/** ذخیره‌شده‌ی مرورگر را امن به لیست Review تبدیل می‌کند؛ هرگز خطا نمی‌دهد. */
export function parseStoredReviews(raw: string | null): Review[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(isStoredReview);
  } catch {
    return [];
  }
}

export const serializeReviews = (reviews: readonly Review[]): string => JSON.stringify(reviews);

function isStoredReview(value: unknown): value is Review {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.productId === "string" &&
    typeof r.productName === "string" &&
    typeof r.productSlug === "string" &&
    typeof r.authorName === "string" &&
    isRating(r.rating) &&
    typeof r.body === "string" &&
    typeof r.createdAt === "string" &&
    typeof r.verifiedPurchase === "boolean"
  );
}

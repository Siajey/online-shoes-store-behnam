"use client";

import { toPersianDigits } from "@/lib/format";
import { reviewsCopy as t } from "../copy";
import { useProductReviews } from "../use-reviews";
import { RatingStars } from "./rating-stars";

/** خط امتیاز کنار عنوان محصول؛ لینک به بخش نظرها. */
export function ProductRating({ productId }: { productId: string }) {
  const { summary, status } = useProductReviews(productId);
  if (status === "idle" || status === "loading") return <span className="h-5" aria-hidden="true" />;
  if (summary.count === 0) {
    return (
      <a href="#reviews" className="text-fg-muted text-sm hover:underline">
        {t.noReviewsYet}
      </a>
    );
  }
  return (
    <a href="#reviews" className="text-fg-secondary inline-flex items-center gap-2 text-sm">
      <RatingStars value={summary.average} />
      <span>
        {toPersianDigits(summary.average.toFixed(1))} {t.outOfFive}
      </span>
      <span className="text-fg-muted">· {t.countText(toPersianDigits(summary.count))}</span>
    </a>
  );
}

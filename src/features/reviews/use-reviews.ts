"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { reviewsService } from "./instance";
import { summarizeReviews } from "./reviews";
import { IDLE_ENTRY, type ReviewsEntry } from "./service";
import type { ReviewSummary } from "./types";

/** نظرهای یک کالا؛ بار اول از منبع داده می‌خواند و بین همه‌ی کامپوننت‌ها مشترک است. */
export function useProductReviews(productId: string): ReviewsEntry & { summary: ReviewSummary } {
  const entry = useSyncExternalStore(
    reviewsService.subscribe,
    () => reviewsService.getProduct(productId),
    () => IDLE_ENTRY,
  );
  useEffect(() => {
    void reviewsService.loadProduct(productId);
  }, [productId]);
  const summary = useMemo(() => summarizeReviews(entry.reviews), [entry.reviews]);
  return { ...entry, summary };
}

/** نظرهای خود کاربر (برای صفحه‌ی «نظرات من») */
export function useMyReviews(userId: string | undefined): ReviewsEntry {
  const entry = useSyncExternalStore(
    reviewsService.subscribe,
    () => (userId ? reviewsService.getMine(userId) : IDLE_ENTRY),
    () => IDLE_ENTRY,
  );
  useEffect(() => {
    if (userId) void reviewsService.loadMine(userId);
  }, [userId]);
  return entry;
}

"use client";

import Link from "next/link";
import { StateMessage } from "@/components/ui/state-message";
import { AccountError, AccountSkeleton } from "@/features/auth/components/account-views";
import { authStore } from "@/features/auth/auth-store";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { reviewsCopy as t } from "../copy";
import { reviewsService } from "../instance";
import { useMyReviews } from "../use-reviews";
import { ReviewList } from "./review-list";

/** «نظرات من» در حساب کاربری. مهمان به /login می‌رود. */
export function MyReviewsContent() {
  const auth = useRequireAuth("/account/reviews");
  const userId = auth.status === "authenticated" ? auth.user.id : undefined;
  const entry = useMyReviews(userId);

  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  if (!userId) return <AccountSkeleton />;
  if (entry.status === "error") {
    return (
      <StateMessage tone="error">
        {entry.error}{" "}
        <button
          type="button"
          onClick={() => void reviewsService.loadMine(userId, true)}
          className="text-brand underline underline-offset-4"
        >
          {t.retry}
        </button>
      </StateMessage>
    );
  }
  if (entry.status !== "ready") return <AccountSkeleton />;
  if (entry.reviews.length === 0) {
    return (
      <StateMessage>
        <p>{t.mine.empty}</p>
        <Link
          href="/products"
          className="text-brand mt-3 inline-block underline underline-offset-4"
        >
          {t.mine.goShopping}
        </Link>
      </StateMessage>
    );
  }
  return <ReviewList reviews={entry.reviews} showProduct />;
}

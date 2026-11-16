"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { useAuth } from "@/features/auth/use-auth";
import { reviewsCopy as t } from "../copy";
import { reviewsService } from "../instance";
import { useProductReviews } from "../use-reviews";
import { ReviewForm, type ReviewFormValues } from "./review-form";
import { ReviewList } from "./review-list";
import { ReviewSummaryView } from "./review-summary";

export type ReviewProduct = { id: string; name: string; slug: string };

/** بخش نظرات صفحه‌ی محصول: خلاصه‌ی امتیاز، فرم ثبت نظر (برای کاربر وارد‌شده) و فهرست نظرها. */
export function ProductReviews({ product }: { product: ReviewProduct }) {
  const entry = useProductReviews(product.id);
  const auth = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [thanks, setThanks] = useState(false);

  const user = auth.status === "authenticated" ? auth.user : null;
  const alreadyReviewed = user ? entry.reviews.some((r) => r.authorId === user.id) : false;

  async function submit(values: ReviewFormValues) {
    if (!user) return { ok: false as const, message: t.loginToWrite };
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || t.anonymous;
    const result = await reviewsService.submit({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      rating: values.rating,
      title: values.title || undefined,
      body: values.body,
      author: { id: user.id, name },
    });
    if (result.ok) {
      setFormOpen(false);
      setThanks(true);
      return { ok: true as const };
    }
    return result;
  }

  const loginHref = `/login?next=${encodeURIComponent(`/products/${product.slug}#reviews`)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-8">
      <div className="flex flex-col gap-4">
        {entry.summary.count > 0 && <ReviewSummaryView summary={entry.summary} />}

        <div className="rounded-card bg-surface flex flex-col gap-3 p-6">
          {auth.status === "guest" && (
            <>
              <p className="text-fg-secondary text-sm leading-7">{t.loginToWrite}</p>
              <Link
                href={loginHref}
                className="bg-brand text-on-brand focus-visible:outline-brand inline-flex h-13 items-center justify-center rounded-full px-6 text-base font-medium hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {t.loginButton}
              </Link>
            </>
          )}
          {user && alreadyReviewed && (
            <p role="status" className="text-fg-secondary text-sm leading-7">
              {thanks ? t.thanks : t.alreadyReviewed}
            </p>
          )}
          {user && !alreadyReviewed && !formOpen && (
            <Button onClick={() => setFormOpen(true)}>{t.write}</Button>
          )}
          {(auth.status === "unknown" || auth.status === "error") && (
            <p className="text-fg-muted text-sm">{t.write}</p>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        {user && formOpen && !alreadyReviewed && (
          <ReviewForm onSubmit={submit} onCancel={() => setFormOpen(false)} />
        )}

        {entry.status === "error" && (
          <StateMessage tone="error">
            {entry.error}{" "}
            <button
              type="button"
              onClick={() => void reviewsService.loadProduct(product.id, true)}
              className="text-brand underline underline-offset-4"
            >
              {t.retry}
            </button>
          </StateMessage>
        )}
        {(entry.status === "idle" || entry.status === "loading") && entry.reviews.length === 0 && (
          <StateMessage>{t.loading}</StateMessage>
        )}
        {entry.status === "ready" && entry.reviews.length === 0 && (
          <StateMessage>{t.empty}</StateMessage>
        )}
        {entry.reviews.length > 0 && <ReviewList reviews={entry.reviews} />}
      </div>
    </div>
  );
}

"use client";

import { useId, useState, type FormEvent } from "react";
import { StarIcon } from "@/components/layout/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { reviewsCopy as t } from "../copy";
import { REVIEW_LIMITS, isRating, validateReview, type ReviewFieldErrors } from "../reviews";
import type { Rating } from "../types";

export type ReviewFormValues = { rating: Rating; title: string; body: string };

type Props = {
  onSubmit: (values: ReviewFormValues) => Promise<{ ok: true } | { ok: false; message: string }>;
  onCancel?: () => void;
};

/** فرم ثبت نظر: انتخاب ستاره، عنوان اختیاری و متن. اعتبارسنجی قبل از ارسال انجام می‌شود. */
export function ReviewForm({ onSubmit, onCancel }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<ReviewFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const bodyId = useId();
  const bodyMessageId = `${bodyId}-message`;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const found = validateReview(
      { rating, title, body },
      {
        rating: t.errors.rating,
        bodyShort: t.errors.bodyShort(toPersianDigits(REVIEW_LIMITS.bodyMin)),
        bodyLong: t.errors.bodyLong(toPersianDigits(REVIEW_LIMITS.bodyMax)),
        titleLong: t.errors.titleLong(toPersianDigits(REVIEW_LIMITS.titleMax)),
      },
    );
    setErrors(found ?? {});
    setFormError(null);
    if (found || !isRating(rating)) return;
    setSubmitting(true);
    const result = await onSubmit({ rating, title: title.trim(), body: body.trim() });
    setSubmitting(false);
    if (!result.ok) setFormError(result.message);
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      noValidate
      className="rounded-card bg-surface flex flex-col gap-5 p-6"
    >
      <h3 className="text-lg font-medium">{t.writeTitle}</h3>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-fg-secondary mb-2 text-sm">{t.ratingField}</legend>
        <div role="radiogroup" aria-label={t.ratingField} className="flex gap-1">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={t.ratingOption(toPersianDigits(n))}
              onClick={() => setRating(n)}
              className="focus-visible:outline-brand rounded-full p-1 focus-visible:outline-2"
            >
              <StarIcon
                fill={rating !== null && n <= rating ? "currentColor" : "none"}
                className={cn(
                  "size-8",
                  rating !== null && n <= rating ? "text-warn" : "text-fg-muted",
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p role="alert" className="text-danger px-2 text-sm">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <Input
        label={t.titleField}
        value={title}
        maxLength={REVIEW_LIMITS.titleMax + 20}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor={bodyId} className="text-fg-secondary text-sm">
          {t.bodyField}
        </label>
        <textarea
          id={bodyId}
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={bodyMessageId}
          className={cn(
            "bg-surface-2 text-fg w-full resize-y rounded-3xl border px-5 py-4 text-base leading-8",
            "placeholder:text-fg-muted focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2",
            errors.body ? "border-danger" : "border-line",
          )}
        />
        <p
          id={bodyMessageId}
          role={errors.body ? "alert" : undefined}
          className={cn("px-2 text-sm", errors.body ? "text-danger" : "text-fg-muted")}
        >
          {errors.body ??
            t.bodyHint(
              toPersianDigits(REVIEW_LIMITS.bodyMin),
              toPersianDigits(REVIEW_LIMITS.bodyMax),
            )}
        </p>
      </div>

      {formError && (
        <p role="alert" className="text-danger text-sm">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" loading={submitting}>
          {t.submit}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t.cancel}
          </Button>
        )}
      </div>
    </form>
  );
}

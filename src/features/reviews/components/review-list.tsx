import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { reviewsCopy as t } from "../copy";
import { formatReviewDate } from "../reviews";
import type { Review } from "../types";
import { RatingStars } from "./rating-stars";

/** فهرست نظرها. showProduct: نام کالا (با لینک) بالای هر نظر، برای «نظرات من». */
export function ReviewList({
  reviews,
  showProduct = false,
}: {
  reviews: readonly Review[];
  showProduct?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-4">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-card bg-surface flex flex-col gap-3 p-5">
          {showProduct && (
            <p className="text-fg-muted text-sm">
              {t.mine.forProduct}{" "}
              <Link
                href={`/products/${r.productSlug}`}
                className="text-brand underline underline-offset-4"
              >
                {r.productName}
              </Link>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <RatingStars value={r.rating} />
            {r.title && <h3 className="text-base font-medium">{r.title}</h3>}
          </div>
          <p className="text-fg-secondary text-sm leading-8">{r.body}</p>
          <div className="text-fg-muted flex flex-wrap items-center gap-3 text-xs">
            <span>{r.authorName || t.anonymous}</span>
            <time dateTime={r.createdAt}>{formatReviewDate(r.createdAt)}</time>
            {r.verifiedPurchase && (
              <Badge variant="success" size="sm">
                {t.verified}
              </Badge>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

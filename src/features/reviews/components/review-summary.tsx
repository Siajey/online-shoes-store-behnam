import { toPersianDigits } from "@/lib/format";
import { reviewsCopy as t } from "../copy";
import { RATINGS } from "../reviews";
import type { ReviewSummary } from "../types";
import { RatingStars } from "./rating-stars";

/** میانگین امتیاز و نمودار میله‌ای پراکندگی ۱ تا ۵ ستاره. */
export function ReviewSummaryView({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="rounded-card bg-surface flex flex-col gap-5 p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-5xl font-semibold">{toPersianDigits(summary.average.toFixed(1))}</p>
        <RatingStars value={summary.average} starClassName="size-5" />
        <p className="text-fg-muted text-sm">{t.basedOn(toPersianDigits(summary.count))}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {RATINGS.map((n) => {
          const count = summary.distribution[n];
          const percent = summary.count === 0 ? 0 : Math.round((count / summary.count) * 100);
          return (
            <li key={n} className="flex items-center gap-3 text-sm">
              <span className="text-fg-secondary w-14 flex-none">
                {t.starRow(toPersianDigits(n))}
              </span>
              <span
                aria-hidden="true"
                className="bg-surface-2 h-2 flex-1 overflow-hidden rounded-full"
              >
                <span
                  className="bg-warn block h-full rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="text-fg-muted w-8 flex-none text-end">{toPersianDigits(count)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

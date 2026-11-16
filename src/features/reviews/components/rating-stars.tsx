import { StarIcon } from "@/components/layout/icons";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { reviewsCopy } from "../copy";

/** پنج ستاره‌ی فقط‌نمایشی. مقدار به نزدیک‌ترین عدد صحیح گرد می‌شود. */
export function RatingStars({
  value,
  className,
  starClassName = "size-4",
}: {
  value: number;
  className?: string;
  starClassName?: string;
}) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span
      role="img"
      aria-label={reviewsCopy.ratingLabel(toPersianDigits(value))}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          fill={n <= filled ? "currentColor" : "none"}
          className={cn(starClassName, n <= filled ? "text-warn" : "text-fg-muted")}
        />
      ))}
    </span>
  );
}

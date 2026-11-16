import Link from "next/link";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { productCopy as t } from "../copy";
import { productsHref, type ProductFilters } from "../filters";

/** شماره‌ی صفحه‌هایی که نشان داده می‌شوند: حداکثر ۵ تا، حول صفحه‌ی فعلی؛ صفحه‌ی بعد فقط اگر وجود دارد. */
export function pageWindow(page: number, hasNext: boolean): number[] {
  const last = hasNext ? page + 1 : page;
  const start = Math.max(1, Math.min(page - 2, last - 4));
  const out: number[] = [];
  for (let n = start; n <= last && out.length < 5; n += 1) out.push(n);
  return out;
}

const base =
  "focus-visible:outline-brand inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2";

/** صفحه‌بندی لینکی (بدون JavaScript). بک‌اند تعداد کل نمی‌دهد، پس فقط تا صفحه‌ی بعد نشان داده می‌شود. */
export function ProductsPagination({
  filters,
  page,
  hasNext,
}: {
  filters: ProductFilters;
  page: number;
  hasNext: boolean;
}) {
  if (page <= 1 && !hasNext) return null;
  const href = (n: number) => productsHref(filters, { page: n });
  return (
    <nav
      aria-label={t.pagination}
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={href(page - 1)}
          rel="prev"
          className={cn(base, "bg-surface-2 text-fg-secondary hover:text-fg")}
        >
          {t.previousPage}
        </Link>
      )}
      {pageWindow(page, hasNext).map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-label={t.pageN(toPersianDigits(n))}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            base,
            n === page
              ? "bg-brand text-on-brand font-medium"
              : "bg-surface-2 text-fg-secondary hover:text-fg",
          )}
        >
          {toPersianDigits(n)}
        </Link>
      ))}
      {hasNext && (
        <Link
          href={href(page + 1)}
          rel="next"
          className={cn(base, "bg-surface-2 text-fg-secondary hover:text-fg")}
        >
          {t.nextPage}
        </Link>
      )}
    </nav>
  );
}

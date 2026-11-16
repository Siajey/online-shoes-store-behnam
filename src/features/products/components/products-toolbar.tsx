import Link from "next/link";
import { ChevronDownIcon } from "@/components/layout/icons";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { productCopy as t } from "../copy";
import { activeFilterCount, productsHref, type ProductFilters, type ProductSort } from "../filters";
import type { CatalogFacets } from "../types";
import { ProductsFilterForm } from "./products-filter-form";

const SORT_OPTIONS: { value: ProductSort | undefined; label: string }[] = [
  { value: undefined, label: t.sortDefault },
  { value: "price-asc", label: t.sortPriceAsc },
  { value: "price-desc", label: t.sortPriceDesc },
];

/**
 * مرتب‌سازی (چیپ‌های لینکی) و فیلتر قیمت/موجودی (فرم GET). همه‌چیز در آدرس می‌ماند؛
 * بدون JavaScript هم کار می‌کند و صفحه قابل اشتراک‌گذاری است.
 */
export function ProductsToolbar({
  filters,
  facets,
}: {
  filters: ProductFilters;
  facets?: CatalogFacets | null;
}) {
  const count = activeFilterCount(filters);
  return (
    <div className="mt-5 flex flex-col gap-4">
      <nav
        aria-label={t.sortLabel}
        className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0"
      >
        <span className="text-fg-muted flex-none text-sm">{t.sortLabel}</span>
        {SORT_OPTIONS.map((o) => {
          const active = filters.sort === o.value;
          return (
            <Link
              key={o.label}
              href={productsHref(filters, { sort: o.value })}
              aria-current={active ? "true" : undefined}
              className={cn(
                "focus-visible:outline-brand inline-flex h-10 flex-none items-center rounded-full px-4 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2",
                active
                  ? "bg-brand text-on-brand font-medium"
                  : "bg-surface-2 text-fg-secondary hover:text-fg",
              )}
            >
              {o.label}
            </Link>
          );
        })}
      </nav>

      <details className="rounded-card bg-surface group xl:hidden" open={count > 0}>
        <summary className="focus-visible:outline-brand flex cursor-pointer list-none items-center justify-between gap-2 rounded-full px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
          <span>{count > 0 ? t.filtersCount(toPersianDigits(count)) : t.filtersTitle}</span>
          <ChevronDownIcon
            aria-hidden
            className="text-fg-muted size-5 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <div className="p-5 pt-2">
          <ProductsFilterForm filters={filters} facets={facets} />
        </div>
      </details>
    </div>
  );
}

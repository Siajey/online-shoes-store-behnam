import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { productCopy as t } from "../copy";
import { activeFilterCount, productsHref, type ProductFilters, type ProductSort } from "../filters";

const SORT_OPTIONS: { value: ProductSort | undefined; label: string }[] = [
  { value: undefined, label: t.sortDefault },
  { value: "price-asc", label: t.sortPriceAsc },
  { value: "price-desc", label: t.sortPriceDesc },
];

/**
 * مرتب‌سازی (چیپ‌های لینکی) و فیلتر قیمت/موجودی (فرم GET). همه‌چیز در آدرس می‌ماند؛
 * بدون JavaScript هم کار می‌کند و صفحه قابل اشتراک‌گذاری است.
 */
export function ProductsToolbar({ filters }: { filters: ProductFilters }) {
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

      <details className="rounded-card bg-surface group" open={count > 0}>
        <summary className="focus-visible:outline-brand cursor-pointer list-none rounded-full px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
          {count > 0 ? t.filtersCount(toPersianDigits(count)) : t.filtersTitle}
        </summary>
        <form method="get" action="/products" className="flex flex-col gap-4 p-5 pt-2">
          {filters.category && <input type="hidden" name="category" value={filters.category} />}
          {filters.q && <input type="hidden" name="q" value={filters.q} />}
          {filters.sort && <input type="hidden" name="sort" value={filters.sort} />}
          <fieldset className="flex flex-col gap-3">
            <legend className="text-fg-secondary mb-2 text-sm">{t.priceRange}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={t.minPrice}
                name="minPrice"
                inputMode="numeric"
                ltr
                maxLength={14}
                defaultValue={filters.minPrice ?? ""}
              />
              <Input
                label={t.maxPrice}
                name="maxPrice"
                inputMode="numeric"
                ltr
                maxLength={14}
                defaultValue={filters.maxPrice ?? ""}
              />
            </div>
          </fieldset>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="inStock"
              value="1"
              defaultChecked={filters.inStock}
              className="accent-brand size-4"
            />
            {t.inStockOnly}
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">{t.applyFilters}</Button>
            {count > 0 && (
              <Link
                href={productsHref(filters, {
                  minPrice: undefined,
                  maxPrice: undefined,
                  inStock: undefined,
                })}
                className="text-brand inline-flex h-13 items-center px-4 text-sm underline underline-offset-4"
              >
                {t.clearFilters}
              </Link>
            )}
          </div>
        </form>
      </details>
    </div>
  );
}

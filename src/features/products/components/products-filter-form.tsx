import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { colorHex } from "../colors";
import { productCopy as t } from "../copy";
import { activeFilterCount, filterFields, productsHref, type ProductFilters } from "../filters";
import type { CatalogFacets } from "../types";

const FORM_OWNED = ["minPrice", "maxPrice", "inStock", "brand", "color", "size"] as const;

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-fg-secondary mb-2 text-sm font-medium">{title}</legend>
      {children}
    </fieldset>
  );
}

const rowClass = "flex items-center gap-3 text-sm";
const boxClass = "accent-brand size-4";

/**
 * فرم فیلتر (قیمت، موجودی، برند، رنگ، سایز). فرم GET است و بدون جاوااسکریپت کار می‌کند.
 * هم در آکاردئون موبایل و هم در نوار کناری دسکتاپ استفاده می‌شود. اگر facets نباشد، فقط قیمت و موجودی دارد.
 */
export function ProductsFilterForm({
  filters,
  facets,
}: {
  filters: ProductFilters;
  facets?: CatalogFacets | null;
}) {
  const count = activeFilterCount(filters);
  const range = facets?.priceRange;
  return (
    <form method="get" action="/products" className="flex flex-col gap-5">
      {filterFields(filters, FORM_OWNED).map((f) => (
        <input key={f.name} type="hidden" name={f.name} value={f.value} />
      ))}

      <Group title={t.priceRange}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Input
            label={t.minPrice}
            name="minPrice"
            inputMode="numeric"
            ltr
            maxLength={14}
            defaultValue={filters.minPrice ?? ""}
            hint={
              range
                ? t.priceBetween(
                    formatPrice(range.min, { unit: false }),
                    formatPrice(range.max, { unit: false }),
                  )
                : undefined
            }
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
      </Group>

      <label className={rowClass}>
        <input
          type="checkbox"
          name="inStock"
          value="1"
          defaultChecked={filters.inStock}
          className={boxClass}
        />
        {t.inStockOnly}
      </label>

      {facets && facets.brands.length > 0 && (
        <Group title={t.brandTitle}>
          <label className={rowClass}>
            <input
              type="radio"
              name="brand"
              value=""
              defaultChecked={!filters.brand}
              className={boxClass}
            />
            {t.allBrands}
          </label>
          {facets.brands.map((b) => (
            <label key={b.id} className={rowClass}>
              <input
                type="radio"
                name="brand"
                value={b.slug}
                defaultChecked={filters.brand === b.slug}
                className={boxClass}
              />
              <span>{b.name}</span>
              <span className="text-fg-muted text-xs">({toPersianDigits(b.count)})</span>
            </label>
          ))}
        </Group>
      )}

      {facets && facets.colors.length > 0 && (
        <Group title={t.colorTitle}>
          {facets.colors.map((c) => (
            <label key={c.value} className={rowClass}>
              <input
                type="checkbox"
                name="color"
                value={c.value}
                defaultChecked={filters.colors?.includes(c.value)}
                className={boxClass}
              />
              <span
                aria-hidden
                className="border-line size-4 flex-none rounded-full border"
                style={{ backgroundColor: colorHex(c.value) ?? "var(--color-surface-2)" }}
              />
              <span>{c.value}</span>
              <span className="text-fg-muted text-xs">({toPersianDigits(c.count)})</span>
            </label>
          ))}
        </Group>
      )}

      {facets && facets.sizes.length > 0 && (
        <Group title={t.sizeTitle}>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <label key={s.value} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="size"
                  value={s.value}
                  defaultChecked={filters.sizes?.includes(s.value)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "bg-surface-2 text-fg-secondary inline-flex h-10 min-w-12 items-center justify-center rounded-full px-3 text-sm",
                    "peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                  )}
                >
                  {toPersianDigits(s.value)}
                </span>
              </label>
            ))}
          </div>
        </Group>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit">{t.applyFilters}</Button>
        {count > 0 && (
          <Link
            href={productsHref(filters, {
              minPrice: undefined,
              maxPrice: undefined,
              inStock: undefined,
              brand: undefined,
              colors: undefined,
              sizes: undefined,
            })}
            className="text-brand inline-flex h-13 items-center px-4 text-sm underline underline-offset-4"
          >
            {t.clearFilters}
          </Link>
        )}
      </div>
    </form>
  );
}

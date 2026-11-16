import Link from "next/link";
import type { Category } from "@/features/categories/types";
import { cn } from "@/lib/cn";
import { productCopy as t } from "../copy";
import { productsHref, type ProductFilters } from "../filters";
import type { CatalogFacets } from "../types";
import { ProductsFilterForm } from "./products-filter-form";

function CategoryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "focus-visible:outline-brand rounded-lg px-3 py-2 text-sm focus-visible:outline-2",
        active ? "bg-surface-2 text-fg font-medium" : "text-fg-secondary hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

/** نوار کناری فیلتر در دسکتاپ: دسته‌بندی‌ها و فرم فیلتر. در موبایل پنهان است (آکاردئون جای آن را می‌گیرد). */
export function ProductsSidebar({
  filters,
  facets,
  categories,
  activeCategoryId,
}: {
  filters: ProductFilters;
  facets?: CatalogFacets | null;
  categories: readonly Category[];
  activeCategoryId?: string;
}) {
  return (
    <aside aria-label={t.filtersSidebar} className="hidden xl:block">
      <div className="rounded-card bg-surface sticky top-24 flex flex-col gap-6 p-5">
        {categories.length > 0 && (
          <nav aria-label={t.categoryTitle} className="flex flex-col gap-1">
            <h2 className="text-fg-secondary mb-1 text-sm font-medium">{t.categoryTitle}</h2>
            <CategoryLink
              href={productsHref(filters, { category: undefined })}
              active={!filters.category}
            >
              {t.allCategories}
            </CategoryLink>
            {categories.map((c) => {
              const open =
                c.slug === filters.category ||
                c.children.some((x) => x.id === activeCategoryId) ||
                c.id === activeCategoryId;
              return (
                <div key={c.id} className="flex flex-col gap-1">
                  <CategoryLink
                    href={productsHref(filters, { category: c.slug })}
                    active={c.slug === filters.category}
                  >
                    {c.name}
                  </CategoryLink>
                  {open && c.children.length > 0 && (
                    <div className="ms-3 flex flex-col gap-1">
                      {c.children.map((x) => (
                        <CategoryLink
                          key={x.id}
                          href={productsHref(filters, { category: x.slug })}
                          active={x.slug === filters.category}
                        >
                          {x.name}
                        </CategoryLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}
        <ProductsFilterForm filters={filters} facets={facets} />
      </div>
    </aside>
  );
}

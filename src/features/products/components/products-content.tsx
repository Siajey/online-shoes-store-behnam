import { SearchBar } from "@/components/layout/search-bar";
import { StateMessage } from "@/components/ui/state-message";
import { fetchCategories } from "@/features/categories/api";
import { CategoryFilter } from "@/features/categories/components/category-filter";
import { findCategoryTrail } from "@/features/categories/trail";
import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { MIN_SEARCH_LENGTH, fetchCatalogFacets, fetchProductsPage } from "../api";
import { PRODUCTS_PAGE_SIZE } from "../constants";
import { productCopy } from "../copy";
import { filterFields, parseProductFilters, productsHref, type RawSearchParams } from "../filters";
import { ProductGrid } from "./product-grid";
import { ProductsPagination } from "./products-pagination";
import { ProductsSidebar } from "./products-sidebar";
import { ProductsToolbar } from "./products-toolbar";

/** محتوای صفحه‌ی /products. باید داخل <Suspense> باشد (چون searchParams داده‌ی زمان درخواست است). */
export async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const filters = parseProductFilters(await searchParams);

  // اگر دسته‌ها یا گزینه‌های فیلتر نیامدند، فقط همان بخش پنهان می‌شود؛ خود لیست کار می‌کند.
  const categories = await fetchCategories().catch(() => []);
  const trail = findCategoryTrail(categories, filters.category);
  const facets = await fetchCatalogFacets(trail.active?.id).catch(() => null);

  const brandId = filters.brand
    ? facets?.brands.find((b) => b.slug === filters.brand)?.id
    : undefined;

  const productsResult = await fetchProductsPage(
    {
      ...filters,
      brandId,
      colorAttribute: facets?.colorAttribute,
      sizeAttribute: facets?.sizeAttribute,
      limit: PRODUCTS_PAGE_SIZE,
    },
    filters.page ?? 1,
  ).then(
    (value) => ({ ok: true as const, value }),
    (reason: unknown) => ({ ok: false as const, reason }),
  );

  const title = filters.q
    ? productCopy.searchResults(filters.q)
    : (trail.active?.name ?? productCopy.allProducts);

  return (
    <>
      <h1 className="text-2xl font-medium lg:text-[28px]">{title}</h1>

      <SearchBar
        className="mt-4 lg:hidden"
        defaultValue={filters.q}
        minLength={MIN_SEARCH_LENGTH}
        clearHref={productsHref(filters, { q: undefined })}
        hidden={filterFields(filters, ["q", "page"])}
      />

      {categories.length > 0 && (
        <div className="xl:hidden">
          <CategoryFilter categories={categories} trail={trail} />
        </div>
      )}

      <div className="xl:mt-6 xl:grid xl:grid-cols-[16rem_minmax(0,1fr)] xl:items-start xl:gap-8">
        <ProductsSidebar
          filters={filters}
          facets={facets}
          categories={categories}
          activeCategoryId={trail.active?.id}
        />

        <div>
          <ProductsToolbar filters={filters} facets={facets} />

          <div className="mt-6">
            {!productsResult.ok ? (
              <StateMessage tone="error">
                {isApiRequestError(productsResult.reason)
                  ? productsResult.reason.message
                  : apiCopy.unknown}
              </StateMessage>
            ) : productsResult.value.items.length === 0 ? (
              <StateMessage>{productCopy.emptyFiltered}</StateMessage>
            ) : (
              <>
                <ProductGrid products={productsResult.value.items} columns="auto" />
                <ProductsPagination
                  filters={filters}
                  page={productsResult.value.page}
                  hasNext={productsResult.value.hasNext}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchProducts } from "../api";
import { PRODUCTS_PAGE_SIZE } from "../constants";
import { productCopy } from "../copy";
import type { ProductFilters } from "../filters";
import { mergeProducts } from "../merge";
import type { Product } from "../types";
import { ProductGrid } from "./product-grid";

type Props = {
  initialItems: Product[];
  initialCursor: string | null;
  filters: ProductFilters;
};

/** لیست محصولات با دکمه‌ی «نمایش بیشتر» (cursor). برای هر فیلتر جدید، با key تازه دوباره ساخته شود. */
export function ProductList({ initialItems, initialCursor, filters }: Props) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true);
    setError(null);
    try {
      const page = await fetchProducts({ ...filters, cursor, limit: PRODUCTS_PAGE_SIZE });
      setItems((previous) => mergeProducts(previous, page.items));
      setCursor(page.nextCursor);
    } catch (err) {
      setError(isApiRequestError(err) ? err.message : apiCopy.unknown);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) return <StateMessage>{productCopy.emptyFiltered}</StateMessage>;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full">
        <ProductGrid products={items} />
      </div>
      {error && (
        <StateMessage tone="error" className="w-full">
          {error}
        </StateMessage>
      )}
      {cursor && (
        <Button variant="outline" loading={loading} onClick={loadMore}>
          {productCopy.loadMore}
        </Button>
      )}
    </div>
  );
}

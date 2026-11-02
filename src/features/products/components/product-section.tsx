import { StateMessage } from "@/components/ui/state-message";
import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchProducts, type ProductListParams } from "../api";
import { productCopy } from "../copy";
import type { Product } from "../types";
import { ProductGrid } from "./product-grid";

/**
 * بخش محصولات: خودش داده را می‌گیرد و سه حالت «خطا»، «خالی» و «لیست» را نشان می‌دهد.
 * باید داخل <Suspense> استفاده شود.
 */
export async function ProductSection({ params }: { params?: ProductListParams }) {
  let products: Product[];
  try {
    products = (await fetchProducts(params)).items;
  } catch (error) {
    return (
      <StateMessage tone="error">
        {isApiRequestError(error) ? error.message : apiCopy.unknown}
      </StateMessage>
    );
  }

  if (products.length === 0) return <StateMessage>{productCopy.empty}</StateMessage>;
  return <ProductGrid products={products} />;
}

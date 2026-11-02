import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StateMessage } from "@/components/ui/state-message";
import { apiCopy } from "@/lib/api/copy";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchProduct } from "../api";
import type { Product } from "../types";
import { ProductDetail } from "./product-detail";
import { ProductGridSkeleton } from "./product-grid";
import { RelatedProducts } from "./related-products";

const SLUG_PATTERN = /^[a-z0-9-]{1,120}$/i;

/** محتوای صفحه‌ی تک‌محصول. باید داخل <Suspense> باشد (params داده‌ی زمان درخواست است). */
export async function ProductDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUG_PATTERN.test(slug)) notFound();

  let product: Product | null;
  try {
    product = await fetchProduct(slug);
  } catch (error) {
    return (
      <StateMessage tone="error">
        {isApiRequestError(error) ? error.message : apiCopy.unknown}
      </StateMessage>
    );
  }
  if (!product) notFound();

  return (
    <>
      <ProductDetail product={product} />
      {product.categorySlug && (
        <Suspense fallback={<ProductGridSkeleton />}>
          <RelatedProducts categorySlug={product.categorySlug} excludeId={product.id} />
        </Suspense>
      )}
    </>
  );
}

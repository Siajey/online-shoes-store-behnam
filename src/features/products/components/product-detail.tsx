import { Badge } from "@/components/ui/badge";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { categoryHref } from "@/features/categories/routes";
import { siteConfig } from "@/config/site";
import { StateMessage } from "@/components/ui/state-message";
import { ProductRating } from "@/features/reviews/components/product-rating";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { productCopy } from "../copy";
import type { Product } from "../types";
import { ProductGallery } from "./product-gallery";
import { ProductPurchase } from "./product-purchase";
import { ProductSpecs } from "./product-specs";
import { ProductTabs } from "./product-tabs";

export function ProductDetail({ product }: { product: Product }) {
  const crumbs: BreadcrumbItem[] = [
    { label: productCopy.home, href: "/" },
    { label: productCopy.allProducts, href: "/products" },
    ...(product.categoryName && product.categorySlug
      ? [{ label: product.categoryName, href: categoryHref(product.categorySlug) }]
      : []),
    { label: product.name },
  ];

  const images = product.images ?? (product.imageUrl ? [product.imageUrl] : []);

  return (
    <>
      <Breadcrumb items={crumbs} label={productCopy.breadcrumb} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <ProductGallery images={images} name={product.name} />

        <div className="flex flex-col gap-5">
          {product.tag && (
            <div>
              <Badge variant="brand">{product.tag}</Badge>
            </div>
          )}

          <h1 className="text-3xl leading-snug font-semibold lg:text-4xl">{product.name}</h1>

          <div className="text-fg-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <ProductRating productId={product.id} />
            {product.sku && (
              <span>
                {productCopy.sku}: <span dir="ltr">{product.sku}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <div className="text-3xl font-medium">
              {formatPrice(product.price, { unit: false })}{" "}
              <span className="text-fg-muted text-sm font-light">{siteConfig.currency.unit}</span>
            </div>
            {product.originalPrice && (
              <span className="text-fg-muted text-base line-through">
                {formatPrice(product.originalPrice, { unit: false })}
              </span>
            )}
            {product.discountLabel && <Badge variant="danger">{product.discountLabel}</Badge>}
          </div>

          {product.description && (
            <p className="text-fg-secondary line-clamp-3 text-sm leading-8">
              {product.description}
            </p>
          )}

          <div>
            <Badge variant={product.available ? "success" : "neutral"} dot>
              {product.available ? productCopy.inStock : productCopy.unavailable}
            </Badge>
          </div>

          <ProductPurchase product={product} />

          <ul
            aria-label={productCopy.shippingTitle}
            className="rounded-card bg-surface text-fg-secondary flex flex-col gap-3 p-5 text-sm leading-7"
          >
            <li>{productCopy.shippingNote}</li>
            <li>{productCopy.returnNote(toPersianDigits(siteConfig.policies.returnWindowDays))}</li>
            <li>{productCopy.authenticityNote}</li>
          </ul>
        </div>
      </div>

      <ProductTabs
        product={{ id: product.id, name: product.name, slug: product.slug }}
        specs={<ProductSpecs specs={product.specs} />}
        description={
          product.description ? (
            <p className="text-fg-secondary max-w-3xl text-base leading-9 whitespace-pre-line">
              {product.description}
            </p>
          ) : (
            <StateMessage>{productCopy.noDescription}</StateMessage>
          )
        }
      />
    </>
  );
}

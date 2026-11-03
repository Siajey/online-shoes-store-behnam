import Image from "next/image";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { categoryHref } from "@/features/categories/routes";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { productCopy } from "../copy";
import type { Product } from "../types";
import { ProductPurchase } from "./product-purchase";

export function ProductDetail({ product }: { product: Product }) {
  const crumbs: BreadcrumbItem[] = [
    { label: productCopy.home, href: "/" },
    { label: productCopy.allProducts, href: "/products" },
    ...(product.categoryName && product.categorySlug
      ? [{ label: product.categoryName, href: categoryHref(product.categorySlug) }]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <Breadcrumb items={crumbs} label={productCopy.breadcrumb} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="bg-surface relative flex h-80 items-center justify-center overflow-hidden rounded-[40px] lg:h-120">
          {product.imageUrl ? (
            // unoptimized: تا دامنه‌ی تصاویر نهایی نشده، تنظیم images.remotePatterns لازم نیست.
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          ) : (
            <ShoeIllustration className="w-64 -rotate-8" />
          )}
        </div>

        <div className="flex flex-col gap-5">
          {product.tag && (
            <div>
              <Badge variant="brand">{product.tag}</Badge>
            </div>
          )}

          <h1 className="text-3xl leading-snug font-semibold lg:text-4xl">{product.name}</h1>

          {product.sku && (
            <div className="text-fg-muted text-sm">
              {productCopy.sku}: <span dir="ltr">{product.sku}</span>
            </div>
          )}

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

          <div>
            <Badge variant={product.available ? "success" : "neutral"} dot>
              {product.available ? productCopy.inStock : productCopy.unavailable}
            </Badge>
          </div>

          <ProductPurchase product={product} />
        </div>
      </div>
    </>
  );
}

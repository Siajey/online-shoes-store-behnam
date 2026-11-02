import Image from "next/image";
import { cn } from "@/lib/cn";
import { productHref } from "../routes";
import type { Product } from "../types";
import { ProductCard } from "./product-card";

const grid = "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          href={productHref(product.id)}
          price={product.price}
          tag={product.tag}
          image={
            product.imageUrl ? (
              // unoptimized: تا آدرس دامنه‌ی تصاویر مشخص نشده، تنظیم images.remotePatterns لازم نیست.
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                unoptimized
                sizes="(min-width: 1024px) 270px, 50vw"
                className="object-contain p-4"
              />
            ) : undefined
          }
        />
      ))}
    </div>
  );
}

/** جای‌نگهدار هم‌اندازه‌ی کارت‌ها تا صفحه هنگام بارگذاری نپرد. */
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={grid} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn("rounded-card bg-surface h-80 animate-pulse motion-reduce:animate-none")}
        />
      ))}
    </div>
  );
}

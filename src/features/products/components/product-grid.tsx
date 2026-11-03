"use client";

import Image from "next/image";
import { useState } from "react";
import { cartCopy } from "@/features/cart/copy";
import { cartStore } from "@/features/cart/store";
import { cn } from "@/lib/cn";
import { productHref } from "../routes";
import type { Product } from "../types";
import { ProductCard } from "./product-card";

const grid = "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5";

export function ProductGrid({ products }: { products: Product[] }) {
  // پیام برای صفحه‌خوان؛ کلید تازه باعث می‌شود افزودن پشت‌سرهم‌ی همان کالا هم اعلام شود.
  const [announcement, setAnnouncement] = useState({ id: 0, text: "" });

  function addToCart(product: Product) {
    cartStore.add(product);
    setAnnouncement((a) => ({ id: a.id + 1, text: cartCopy.added(product.name) }));
  }

  return (
    <div className={grid}>
      <span key={announcement.id} role="status" className="sr-only">
        {announcement.text}
      </span>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          href={productHref(product.slug)}
          price={product.price}
          originalPrice={product.originalPrice}
          discountLabel={product.discountLabel}
          tag={product.tag}
          unavailable={!product.available}
          onAddToCart={() => addToCart(product)}
          image={
            product.imageUrl ? (
              // unoptimized: تا دامنه‌ی تصاویر نهایی نشده، تنظیم images.remotePatterns لازم نیست.
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                unoptimized
                sizes="(min-width: 1024px) 270px, 50vw"
                className="object-cover"
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

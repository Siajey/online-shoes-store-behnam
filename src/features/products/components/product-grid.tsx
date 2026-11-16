"use client";

import Image from "next/image";
import { useState } from "react";
import { favouritesCopy } from "@/features/favourites/copy";
import { favouritesStore } from "@/features/favourites/instance";
import { useFavouriteIds } from "@/features/favourites/use-favourites";
import { cn } from "@/lib/cn";
import { productHref } from "../routes";
import type { Product } from "../types";
import { ProductCard } from "./product-card";

const grid = "grid grid-cols-2 gap-3 lg:gap-5";
const COLUMNS = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  // ستون‌های خودکار: هر کارت حداقل ۱۵rem (در دسکتاپ ۱۶rem) عرض دارد و جای خالی بین ستون‌ها تقسیم می‌شود
  auto: "sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]",
} as const;

/** columns: تعداد ستون در دسکتاپ؛ auto یعنی هر قدر کارت با حداقل عرض جا شود (برای صفحه‌ی دارای سایدبار). */
export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: keyof typeof COLUMNS;
}) {
  // پیام برای صفحه‌خوان؛ کلید تازه باعث می‌شود افزودن پشت‌سرهم‌ی همان کالا هم اعلام شود.
  const [announcement, setAnnouncement] = useState({ id: 0, text: "" });

  const favouriteIds = useFavouriteIds();

  function toggleFavourite(product: Product) {
    const was = favouriteIds.has(product.id);
    const text = was ? favouritesCopy.removed(product.name) : favouritesCopy.added(product.name);
    setAnnouncement((a) => ({ id: a.id + 1, text }));
    void favouritesStore.toggle(product).then((r) => {
      if (!r.ok) setAnnouncement((a) => ({ id: a.id + 1, text: r.message }));
    });
  }

  return (
    <div className={cn(grid, COLUMNS[columns])}>
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
          colors={product.colors}
          unavailable={!product.available}
          favourite={favouriteIds.has(product.id)}
          onToggleFavourite={() => toggleFavourite(product)}
          addToCartHref={productHref(product.slug)}
          image={
            product.imageUrl ? (
              // unoptimized: تا دامنه‌ی تصاویر نهایی نشده، تنظیم images.remotePatterns لازم نیست.
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                unoptimized
                sizes="(min-width: 1280px) 270px, (min-width: 640px) 33vw, 50vw"
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
    <div className={cn(grid, "lg:grid-cols-4")} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn("rounded-card bg-surface h-80 animate-pulse motion-reduce:animate-none")}
        />
      ))}
    </div>
  );
}

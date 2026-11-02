"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { productCopy } from "../copy";

export type ProductCardProps = {
  name: string;
  /** صفحه‌ی محصول */
  href: string;
  /** قیمت به عدد صحیح (واحد: تومان) */
  price: number;
  /** برچسب کوچک بالای نام، مثل «پرفروش» */
  tag?: string;
  /** تصویر محصول (مثلاً <Image />)؛ برنامه تصمیم می‌گیرد چه بگذارد. */
  image?: ReactNode;
  favourite?: boolean;
  onToggleFavourite?: () => void;
  onAddToCart?: () => void;
  className?: string;
};

export function ProductCard({
  name,
  href,
  price,
  tag,
  image,
  favourite = false,
  onToggleFavourite,
  onAddToCart,
  className,
}: ProductCardProps) {
  return (
    <article className={cn("rounded-card bg-surface flex flex-col gap-3 p-4", className)}>
      <div className="bg-surface-2 relative flex h-48 items-center justify-center overflow-hidden rounded-[22px]">
        <button
          type="button"
          onClick={onToggleFavourite}
          aria-pressed={favourite}
          aria-label={favourite ? productCopy.removeFromFavourites : productCopy.addToFavourites}
          className="bg-surface text-fg focus-visible:outline-brand absolute start-2.5 top-2.5 flex size-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <HeartIcon filled={favourite} />
        </button>
        {image}
      </div>

      <div className="text-brand min-h-5 text-xs font-medium">{tag}</div>

      <Link
        href={href}
        className="focus-visible:outline-brand text-[17px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {name}
      </Link>

      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {formatPrice(price, { unit: false })}{" "}
          <span className="text-fg-muted text-xs font-light">{siteConfig.currency.unit}</span>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          aria-label={productCopy.addToCart}
          className="bg-brand text-on-brand focus-visible:outline-brand flex size-11 items-center justify-center rounded-2xl transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
        >
          <PlusIcon />
        </button>
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

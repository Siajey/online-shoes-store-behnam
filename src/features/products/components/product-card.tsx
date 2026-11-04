"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { productCopy } from "../copy";

export type ProductCardProps = {
  name: string;
  /** صفحه‌ی محصول */
  href: string;
  /** قیمت نهایی، به عدد صحیح (واحد: تومان) */
  price: number;
  /** قیمت قبل از تخفیف؛ فقط وقتی تخفیف دارد */
  originalPrice?: number;
  /** متن تخفیف مثل «۲۰٪ تخفیف» */
  discountLabel?: string;
  /** برچسب کوچک بالای نام، مثل «پرفروش» */
  tag?: string;
  /** تصویر محصول (مثلاً <Image />)؛ برنامه تصمیم می‌گیرد چه بگذارد. */
  image?: ReactNode;
  /** ناموجود بودن: دکمه‌ی سبد غیرفعال و نشان «ناموجود» نمایش داده می‌شود. */
  unavailable?: boolean;
  favourite?: boolean;
  onToggleFavourite?: () => void;
  onAddToCart?: () => void;
  className?: string;
};

export function ProductCard({
  name,
  href,
  price,
  originalPrice,
  discountLabel,
  tag,
  image,
  unavailable = false,
  favourite = false,
  onToggleFavourite,
  onAddToCart,
  className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        "rounded-card bg-surface flex min-w-0 flex-col gap-2 p-3 lg:gap-3 lg:p-4",
        className,
      )}
    >
      <div className="bg-surface-2 relative flex h-36 items-center justify-center overflow-hidden rounded-[18px] sm:h-44 lg:h-48 lg:rounded-[22px]">
        <button
          type="button"
          onClick={onToggleFavourite}
          aria-pressed={favourite}
          aria-label={favourite ? productCopy.removeFromFavourites : productCopy.addToFavourites}
          className="bg-surface text-fg focus-visible:outline-brand absolute start-2 top-2 z-10 flex size-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <HeartIcon filled={favourite} />
        </button>
        {unavailable ? (
          <Badge
            size="sm"
            variant="neutral"
            className="absolute end-2 bottom-2 z-10 lg:top-2 lg:bottom-auto"
          >
            {productCopy.unavailable}
          </Badge>
        ) : (
          discountLabel && (
            <Badge
              size="sm"
              variant="danger"
              className="absolute end-2 bottom-2 z-10 lg:top-2 lg:bottom-auto"
            >
              {discountLabel}
            </Badge>
          )
        )}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            unavailable && "opacity-50",
          )}
        >
          {image}
        </div>
      </div>

      <div className="text-brand min-h-4 truncate text-xs font-medium lg:min-h-5">{tag}</div>

      <Link
        href={href}
        className="focus-visible:outline-brand line-clamp-2 min-h-12 text-[15px] leading-6 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 lg:text-[17px]"
      >
        {name}
      </Link>

      <div className="flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="text-fg-muted h-4 text-xs line-through">
            {originalPrice ? formatPrice(originalPrice, { unit: false }) : null}
          </span>
          <div className="text-base font-medium lg:text-lg">
            {formatPrice(price, { unit: false })}{" "}
            <span className="text-fg-muted block text-xs font-light lg:inline">
              {siteConfig.currency.unit}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={unavailable}
          aria-label={productCopy.addToCart}
          className="bg-brand text-on-brand focus-visible:outline-brand flex size-10 shrink-0 items-center justify-center rounded-2xl transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none lg:size-11"
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

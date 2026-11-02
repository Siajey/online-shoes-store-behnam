"use client";

import { useState } from "react";
import { HeartIcon } from "@/components/layout/icons";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/format";
import { productCopy } from "../copy";

/** ☐ سقف تعداد را بعد از مشخص شدن موجودی انبار از API بگیرید. */
const MAX_QUANTITY = 10;

/**
 * بخش خرید: تعداد، افزودن به سبد و علاقه‌مندی.
 * ⚠ هنوز به سبد وصل نیست (PR بعدی: cart-store)؛ فقط حالت‌های ظاهری کار می‌کنند.
 */
export function ProductPurchase({ available }: { available: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const [favourite, setFavourite] = useState(false);

  const stepButton =
    "flex size-11 items-center justify-center rounded-full text-xl text-fg transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        role="group"
        aria-label={productCopy.quantity}
        className="bg-surface-2 flex h-13 items-center rounded-full px-1"
      >
        <button
          type="button"
          aria-label={productCopy.increaseQuantity}
          disabled={!available || quantity >= MAX_QUANTITY}
          onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
          className={stepButton}
        >
          +
        </button>
        <span aria-live="polite" className="w-8 text-center font-medium">
          {toPersianDigits(quantity)}
        </span>
        <button
          type="button"
          aria-label={productCopy.decreaseQuantity}
          disabled={!available || quantity <= 1}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className={stepButton}
        >
          −
        </button>
      </div>

      <Button size="lg" disabled={!available} className="min-w-40 flex-1">
        {available ? productCopy.addToCartFull : productCopy.unavailable}
      </Button>

      <button
        type="button"
        aria-pressed={favourite}
        aria-label={favourite ? productCopy.removeFromFavourites : productCopy.addToFavourites}
        onClick={() => setFavourite((f) => !f)}
        className="bg-surface-2 text-fg focus-visible:outline-brand flex size-13 items-center justify-center rounded-full transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
      >
        <HeartIcon className="size-[22px]" fill={favourite ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartIcon } from "@/components/layout/icons";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { MAX_QUANTITY } from "@/features/cart/cart";
import { cartCopy } from "@/features/cart/copy";
import { cartStore } from "@/features/cart/store";
import { productCopy } from "../copy";
import type { Product } from "../types";

/** مدت نمایش پیام «به سبد اضافه شد» */
const ADDED_MESSAGE_MS = 4000;

/** بخش خرید: تعداد، افزودن به سبد و علاقه‌مندی. (علاقه‌مندی‌ها هنوز ذخیره نمی‌شوند؛ PR جداگانه.) */
export function ProductPurchase({ product }: { product: Product }) {
  const available = product.available;
  const [quantity, setQuantity] = useState(1);
  const [favourite, setFavourite] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), ADDED_MESSAGE_MS);
    return () => clearTimeout(timer);
  }, [added]);

  function addToCart() {
    cartStore.add(product, quantity);
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={MAX_QUANTITY}
          disabled={!available}
          labels={{
            group: productCopy.quantity,
            increase: productCopy.increaseQuantity,
            decrease: productCopy.decreaseQuantity,
          }}
        />

        <Button size="lg" disabled={!available} onClick={addToCart} className="min-w-40 flex-1">
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

      <div role="status" className="min-h-6 text-sm">
        {added && (
          <>
            <span className="text-ok">{cartCopy.addedShort}</span>{" "}
            <Link href="/cart" className="text-brand underline underline-offset-4">
              {cartCopy.viewCart}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

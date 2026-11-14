"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HeartIcon } from "@/components/layout/icons";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { MAX_QUANTITY } from "@/features/cart/cart";
import { cartCopy } from "@/features/cart/copy";
import { cartStore } from "@/features/cart/instance";
import { useCartMeta } from "@/features/cart/use-cart";
import { favouritesStore } from "@/features/favourites/store";
import { useIsFavourite } from "@/features/favourites/use-favourites";
import { productCopy } from "../copy";
import type { Product } from "../types";
import {
  findVariant,
  missingGroups,
  optionGroups,
  toggleSelection,
  variantLabel,
  type Selection,
} from "../variants";
import { VariantPicker } from "./variant-picker";

/** مدت نمایش پیام «به سبد اضافه شد» */
const ADDED_MESSAGE_MS = 4000;

/** بخش خرید: تعداد، افزودن به سبد و علاقه‌مندی. */
export function ProductPurchase({ product }: { product: Product }) {
  const variants = product.variants;
  const hasVariants = Boolean(variants?.length);
  const [selection, setSelection] = useState<Selection>({});
  const groups = useMemo(() => optionGroups(variants ?? [], selection), [variants, selection]);
  const variant = hasVariants ? findVariant(variants ?? [], selection) : undefined;
  const missing = hasVariants ? missingGroups(variants ?? [], selection) : [];
  const canBuy = hasVariants ? Boolean(variant?.available) : product.available;
  const [quantity, setQuantity] = useState(1);
  const favourite = useIsFavourite(product.id);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const { pending } = useCartMeta();

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), ADDED_MESSAGE_MS);
    return () => clearTimeout(timer);
  }, [added]);

  async function addToCart() {
    if (hasVariants && (!variant || !variant.available)) return;
    setAddError(null);
    const result =
      hasVariants && variant
        ? await cartStore.add(product, quantity, {
            id: variant.id,
            label: variantLabel(variant),
            price: variant.price,
            originalPrice: variant.originalPrice,
          })
        : await cartStore.add(product, quantity);
    if (result.ok) setAdded(true);
    else setAddError(result.message);
  }

  return (
    <div className="flex flex-col gap-3">
      {hasVariants && (
        <VariantPicker
          groups={groups}
          selection={selection}
          onToggle={(name, value) =>
            setSelection((s) => toggleSelection(variants ?? [], s, name, value))
          }
        />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={MAX_QUANTITY}
          disabled={!canBuy}
          labels={{
            group: productCopy.quantity,
            increase: productCopy.increaseQuantity,
            decrease: productCopy.decreaseQuantity,
          }}
        />

        <Button
          size="lg"
          disabled={!canBuy || pending}
          onClick={() => void addToCart()}
          className="min-w-40 flex-1"
        >
          {product.available ? productCopy.addToCartFull : productCopy.unavailable}
        </Button>

        <button
          type="button"
          aria-pressed={favourite}
          aria-label={favourite ? productCopy.removeFromFavourites : productCopy.addToFavourites}
          onClick={() => favouritesStore.toggle(product)}
          className="bg-surface-2 text-fg focus-visible:outline-brand flex size-13 items-center justify-center rounded-full transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
        >
          <HeartIcon className="size-[22px]" fill={favourite ? "currentColor" : "none"} />
        </button>
      </div>

      {hasVariants && missing.length > 0 && (
        <p className="text-fg-muted text-sm">{productCopy.selectFirst(missing.join(" و "))}</p>
      )}
      {hasVariants && missing.length === 0 && variant && !variant.available && (
        <p className="text-danger text-sm">{productCopy.selectedVariantUnavailable}</p>
      )}
      {addError && (
        <p role="alert" className="text-danger text-sm">
          {addError}
        </p>
      )}
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

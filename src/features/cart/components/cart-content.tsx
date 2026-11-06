"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { TrashIcon } from "@/components/layout/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { StateMessage } from "@/components/ui/state-message";
import { siteConfig } from "@/config/site";
import { productHref } from "@/features/products/routes";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { MAX_QUANTITY, cartCount, cartSavings, cartTotal, lineTotal } from "../cart";
import { cartCopy } from "../copy";
import { cartStore } from "../store";
import type { CartItem } from "../types";
import { useCartItems, useCartReady } from "../use-cart";

const price = (amount: number) => (
  <>
    {formatPrice(amount, { unit: false })}{" "}
    <span className="text-fg-muted text-xs font-light">{siteConfig.currency.unit}</span>
  </>
);

type ViewProps = {
  items: readonly CartItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

/** نمای خالص سبد (بدون وابستگی به حافظه‌ی مرورگر)؛ برای تست و استفاده‌ی مجدد. */
export function CartView({ items, onQuantityChange, onRemove, onClear }: ViewProps) {
  if (items.length === 0) {
    return (
      <StateMessage>
        <p className="text-fg text-base font-medium">{cartCopy.empty}</p>
        <p className="mt-1">{cartCopy.emptyHint}</p>
        <Link href="/products" className={buttonVariants({ className: "mt-5" })}>
          {cartCopy.startShopping}
        </Link>
      </StateMessage>
    );
  }

  const savings = cartSavings(items);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8">
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-card bg-surface flex gap-4 p-4">
            <Link
              href={productHref(item.slug)}
              tabIndex={-1}
              aria-hidden="true"
              className="bg-surface-2 relative size-24 shrink-0 overflow-hidden rounded-[22px]"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center">
                  <ShoeIllustration className="w-16 -rotate-8" />
                </span>
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={productHref(item.slug)}
                  className="focus-visible:outline-brand text-base leading-7 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  aria-label={cartCopy.removeItem(item.name)}
                  onClick={() => onRemove(item.id)}
                  className="text-fg-muted hover:text-danger focus-visible:outline-brand flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-3">
                <QuantityStepper
                  value={item.quantity}
                  max={MAX_QUANTITY}
                  onChange={(q) => onQuantityChange(item.id, q)}
                  labels={{
                    group: cartCopy.quantity,
                    increase: cartCopy.increaseQuantity,
                    decrease: cartCopy.decreaseQuantity,
                  }}
                />
                <div className="flex flex-col items-end">
                  <span className="text-fg-muted h-4 text-xs line-through">
                    {item.originalPrice
                      ? formatPrice(item.originalPrice * item.quantity, { unit: false })
                      : null}
                  </span>
                  <div className="text-lg font-medium">{price(lineTotal(item))}</div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside
        aria-label={cartCopy.summary}
        className="rounded-card bg-surface flex flex-col gap-4 p-5 lg:sticky lg:top-6"
      >
        <h2 className="text-lg font-medium">{cartCopy.summary}</h2>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-fg-muted">{cartCopy.itemCount}</dt>
            <dd>{toPersianDigits(cartCount(items))}</dd>
          </div>
          {savings > 0 && (
            <div className="text-ok flex justify-between">
              <dt>{cartCopy.savings}</dt>
              <dd>{price(savings)}</dd>
            </div>
          )}
          <div className="border-line flex items-baseline justify-between border-t pt-3 text-base font-medium">
            <dt>{cartCopy.total}</dt>
            <dd className="text-lg">{price(cartTotal(items))}</dd>
          </div>
        </dl>
        <p className="text-fg-muted text-xs leading-6">{cartCopy.shippingNote}</p>
        <Link href="/checkout" className={buttonVariants({ size: "lg", fullWidth: true })}>
          {cartCopy.checkout}
        </Link>
        <Button variant="ghost" size="sm" onClick={onClear}>
          {cartCopy.clear}
        </Button>
      </aside>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-3">
      <span className="sr-only">{cartCopy.loading}</span>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-card bg-surface h-36 animate-pulse motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

/** صفحه‌ی سبد: تا خواندن حافظه‌ی مرورگر، اسکلت نشان می‌دهد تا «سبد خالی» اشتباهی دیده نشود. */
export function CartContent() {
  const ready = useCartReady();
  const items = useCartItems();
  if (!ready) return <CartSkeleton />;
  return (
    <CartView
      items={items}
      onQuantityChange={cartStore.setQuantity}
      onRemove={cartStore.remove}
      onClear={cartStore.clear}
    />
  );
}

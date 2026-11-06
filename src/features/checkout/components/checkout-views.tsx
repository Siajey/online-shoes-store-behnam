import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { siteConfig } from "@/config/site";
import type { Address } from "@/features/addresses/types";
import { cartCount, cartSavings, cartTotal } from "@/features/cart/cart";
import type { CartItem } from "@/features/cart/types";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { checkoutCopy as t } from "../copy";

export type AddressesState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: readonly Address[] };

const price = (amount: number) => (
  <>
    {formatPrice(amount, { unit: false })}{" "}
    <span className="text-fg-muted text-xs font-light">{siteConfig.currency.unit}</span>
  </>
);

type AddressSectionProps = {
  state: AddressesState;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
};

/** انتخاب آدرس تحویل از میان آدرس‌های ذخیره‌شده. */
export function AddressSection({ state, selectedId, onSelect, onRetry }: AddressSectionProps) {
  if (state.status === "loading") {
    return (
      <div role="status" aria-busy="true" className="grid gap-3">
        <span className="sr-only">{t.loading}</span>
        <div
          aria-hidden="true"
          className="rounded-card bg-surface h-28 animate-pulse motion-reduce:animate-none"
        />
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <StateMessage tone="error">
        <p>{state.message}</p>
        <Button className="mt-4" variant="secondary" onClick={onRetry}>
          {t.retry}
        </Button>
      </StateMessage>
    );
  }
  if (state.items.length === 0) {
    return (
      <StateMessage>
        <p className="text-fg text-base font-medium">{t.noAddress}</p>
        <p className="mt-1">{t.noAddressHint}</p>
        <Link href="/account/addresses" className={buttonVariants({ className: "mt-5" })}>
          {t.addAddress}
        </Link>
      </StateMessage>
    );
  }
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">{t.addressTitle}</legend>
      {state.items.map((a) => (
        <label
          key={a.id}
          className="rounded-card bg-surface has-checked:border-brand has-focus-visible:outline-brand flex cursor-pointer items-start gap-3 border-2 border-transparent p-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
        >
          <input
            type="radio"
            name="address"
            value={a.id}
            checked={a.id === selectedId}
            onChange={() => onSelect(a.id)}
            className="accent-brand mt-2 size-4"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex items-start justify-between gap-2">
              <span className="text-base leading-7 font-medium">
                {a.province}، {a.city}
              </span>
              {a.isDefault && (
                <span className="bg-surface-2 text-fg-secondary shrink-0 rounded-full px-3 py-1 text-xs">
                  {t.defaultBadge}
                </span>
              )}
            </span>
            <span className="text-fg-secondary text-sm leading-7">{a.street}</span>
            <span className="text-fg-muted text-sm">
              {t.postalLine(toPersianDigits(a.postalCode))}
            </span>
          </span>
        </label>
      ))}
      <Link
        href="/account/addresses"
        className="text-brand self-start text-sm underline underline-offset-4"
      >
        {t.manageAddresses}
      </Link>
    </fieldset>
  );
}

/** خلاصه‌ی سفارش با دکمه‌ی ثبت (فعلاً غیرفعال تا آماده شدن API سفارش). */
export function OrderSummary({
  items,
  hasAddress,
}: {
  items: readonly CartItem[];
  hasAddress: boolean;
}) {
  const savings = cartSavings(items);
  return (
    <aside
      aria-label={t.summary}
      className="rounded-card bg-surface flex flex-col gap-4 p-5 lg:sticky lg:top-6"
    >
      <h2 className="text-lg font-medium">{t.summary}</h2>
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-fg-muted">{t.itemCount}</dt>
          <dd>{toPersianDigits(cartCount(items))}</dd>
        </div>
        {savings > 0 && (
          <div className="text-ok flex justify-between">
            <dt>{t.savings}</dt>
            <dd>{price(savings)}</dd>
          </div>
        )}
        <div className="border-line flex items-baseline justify-between border-t pt-3 text-base font-medium">
          <dt>{t.total}</dt>
          <dd className="text-lg">{price(cartTotal(items))}</dd>
        </div>
      </dl>
      <p className="text-fg-muted text-xs leading-6">{t.shippingNote}</p>
      {/* ☐ وقتی API سفارش/پرداخت آماده شد، این دکمه سفارش را ثبت کند. */}
      <Button size="lg" fullWidth disabled>
        {t.placeOrder}
      </Button>
      <p className="text-fg-muted text-center text-xs">
        {hasAddress ? t.placeOrderSoon : t.needAddress}
      </p>
      <Link href="/cart" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        {t.backToCart}
      </Link>
    </aside>
  );
}

type ViewProps = {
  items: readonly CartItem[];
  addresses: AddressesState;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
};

/** نمای خالص صفحه‌ی تسویه. */
export function CheckoutView({ items, addresses, selectedId, onSelect, onRetry }: ViewProps) {
  if (items.length === 0) {
    return (
      <StateMessage>
        <p className="text-fg text-base font-medium">{t.emptyCart}</p>
        <p className="mt-1">{t.emptyCartHint}</p>
        <Link href="/products" className={buttonVariants({ className: "mt-5" })}>
          {t.startShopping}
        </Link>
      </StateMessage>
    );
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8">
      <section aria-labelledby="checkout-address" className="flex flex-col gap-4">
        <h2 id="checkout-address" className="text-lg font-medium">
          {t.addressTitle}
        </h2>
        <AddressSection
          state={addresses}
          selectedId={selectedId}
          onSelect={onSelect}
          onRetry={onRetry}
        />
      </section>
      <OrderSummary items={items} hasAddress={selectedId !== null} />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ShoeIllustration } from "@/components/illustrations/shoe-illustration";
import { TicketIcon, TrashIcon } from "@/components/layout/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { StateMessage } from "@/components/ui/state-message";
import { siteConfig } from "@/config/site";
import { productHref } from "@/features/products/routes";
import { formatPrice, toPersianDigits } from "@/lib/format";
import {
  MAX_QUANTITY,
  cartCount,
  cartSavings,
  cartTotal,
  hasUnavailable,
  lineTotal,
  maxFor,
} from "../cart";
import { cartCopy } from "../copy";
import type { CartResult } from "../service";
import type { CartCoupon, CartItem } from "../types";

const price = (amount: number) => (
  <>
    {formatPrice(amount, { unit: false })}{" "}
    <span className="text-fg-muted text-xs font-light">{siteConfig.currency.unit}</span>
  </>
);

type CouponProps = {
  coupon: CartCoupon | null;
  /** مبلغ تخفیف کد (تومان) */
  discount: number;
  /** فقط کاربر واردشده می‌تواند کد ثبت کند */
  enabled: boolean;
  pending: boolean;
  onApply: (code: string) => Promise<CartResult>;
  onRemove: () => void;
};

/** ورود و نمایش کد تخفیف سبد. مهمان به ورود هدایت می‌شود؛ کد نامعتبر با دلیلش نشان داده می‌شود. */
export function DiscountCodeBox({
  coupon,
  discount,
  enabled,
  pending,
  onApply,
  onRemove,
}: CouponProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!enabled) {
    return (
      <p className="text-fg-muted text-xs leading-6">
        {cartCopy.couponLoginRequired}{" "}
        <Link href="/login?next=%2Fcart" className="text-brand underline underline-offset-4">
          {cartCopy.couponLogin}
        </Link>
      </p>
    );
  }

  if (coupon && coupon.status !== "none" && coupon.code) {
    const invalid = coupon.status === "invalid";
    return (
      <div className="flex flex-col gap-2">
        <div className="bg-surface-2 flex items-center justify-between gap-2 rounded-xl px-4 py-3">
          <span dir="ltr" className="flex items-center gap-2 text-sm font-medium">
            <TicketIcon className={`size-5 ${invalid ? "text-danger" : "text-ok"}`} />
            {coupon.code}
          </span>
          <button
            type="button"
            disabled={pending}
            onClick={onRemove}
            className="text-fg-muted hover:text-danger focus-visible:outline-brand text-xs focus-visible:outline-2 disabled:opacity-40"
          >
            {cartCopy.couponRemove}
          </button>
        </div>
        {invalid ? (
          <p role="alert" className="text-danger text-xs leading-6">
            {cartCopy.couponReasons[coupon.invalidReason as keyof typeof cartCopy.couponReasons] ??
              cartCopy.couponReasonFallback}
          </p>
        ) : (
          <p role="status" className="text-ok text-xs leading-6">
            {cartCopy.couponApplied(coupon.code)}
            {discount > 0 && <> — {price(discount)}</>}
          </p>
        )}
      </div>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await onApply(code);
    setBusy(false);
    if (result.ok) setCode("");
    else setError(result.message);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2" noValidate>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={cartCopy.discountLabel}
            ltr
            placeholder="CODE"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={error ?? undefined}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          loading={busy}
          disabled={pending}
          className="h-13"
        >
          {cartCopy.discountApply}
        </Button>
      </div>
    </form>
  );
}

type ViewProps = {
  items: readonly CartItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  /** یک تغییر در حال ارسال به سرور است؛ کنترل‌ها موقتاً غیرفعال می‌شوند. */
  pending?: boolean;
  /** خطای آخرین تغییر (مثلاً موجودی کافی نیست) */
  error?: string | null;
  /** پیام اطلاع‌رسانی (مثلاً بعد از ادغام سبد) */
  notice?: string | null;
  /** کد تخفیف سبد سرور (برای مهمان null) و مبلغ تخفیفش */
  coupon?: CartCoupon | null;
  couponDiscount?: number;
  /** کاربر واردشده می‌تواند کد ثبت کند */
  couponEnabled?: boolean;
  onApplyCoupon?: (code: string) => Promise<CartResult>;
  onRemoveCoupon?: () => void;
};

function Message({ tone, children }: { tone: "error" | "info"; children: string }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-card bg-surface p-4 text-sm leading-7 ${tone === "error" ? "text-danger" : "text-fg-secondary"}`}
    >
      {children}
    </p>
  );
}

/** نام کالا؛ ردیف کالای حذف‌شده لینک ندارد. */
function ItemName({ item }: { item: CartItem }) {
  const content = (
    <>
      {item.name}
      {item.variantLabel && (
        <span className="text-fg-muted block text-sm font-normal">{item.variantLabel}</span>
      )}
    </>
  );
  const className = "text-base leading-7 font-medium";
  if (!item.slug) return <span className={className}>{content}</span>;
  return (
    <Link
      href={productHref(item.slug)}
      className={`focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      {content}
    </Link>
  );
}

function Thumb({ item }: { item: CartItem }) {
  const inner = item.imageUrl ? (
    <Image src={item.imageUrl} alt="" fill unoptimized sizes="96px" className="object-cover" />
  ) : (
    <span className="flex size-full items-center justify-center">
      <ShoeIllustration className="w-16 -rotate-8" />
    </span>
  );
  const className = "bg-surface-2 relative size-24 shrink-0 overflow-hidden rounded-[22px]";
  if (!item.slug) return <span className={className}>{inner}</span>;
  return (
    <Link href={productHref(item.slug)} tabIndex={-1} aria-hidden="true" className={className}>
      {inner}
    </Link>
  );
}

function CartRow({
  item,
  pending,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  pending: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const max = maxFor(item);
  return (
    <li className="rounded-card bg-surface flex gap-4 p-4">
      <Thumb item={item} />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <ItemName item={item} />
          <button
            type="button"
            aria-label={cartCopy.removeItem(item.name)}
            disabled={pending}
            onClick={() => onRemove(item.id)}
            className="text-fg-muted hover:text-danger focus-visible:outline-brand flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 motion-reduce:transition-none"
          >
            <TrashIcon />
          </button>
        </div>

        {item.unavailable ? (
          <p className="text-danger text-sm leading-7">
            {item.slug ? cartCopy.unavailable[item.unavailable] : cartCopy.removedProduct}
          </p>
        ) : (
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <QuantityStepper
                value={item.quantity}
                max={max}
                disabled={pending}
                onChange={(q) => onQuantityChange(item.id, q)}
                labels={{
                  group: cartCopy.quantity,
                  increase: cartCopy.increaseQuantity,
                  decrease: cartCopy.decreaseQuantity,
                }}
              />
              {item.quantity >= max && max < MAX_QUANTITY && (
                <span className="text-fg-muted text-xs">
                  {cartCopy.stockLimit(toPersianDigits(max))}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-fg-muted h-4 text-xs line-through">
                {item.originalPrice
                  ? formatPrice(item.originalPrice * item.quantity, { unit: false })
                  : null}
              </span>
              <div className="text-lg font-medium">{price(lineTotal(item))}</div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

/** نمای خالص سبد (بدون وابستگی به حافظه‌ی مرورگر)؛ برای تست و استفاده‌ی مجدد. */
export function CartView({
  items,
  onQuantityChange,
  onRemove,
  onClear,
  pending = false,
  error = null,
  notice = null,
  coupon = null,
  couponDiscount = 0,
  couponEnabled = false,
  onApplyCoupon = async () => ({ ok: false, message: "" }) as CartResult,
  onRemoveCoupon = () => {},
}: ViewProps) {
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
  const blocked = hasUnavailable(items);
  const couponInvalid = coupon?.status === "invalid";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8">
      <div className="flex flex-col gap-3">
        {notice && <Message tone="info">{notice}</Message>}
        {error && <Message tone="error">{error}</Message>}
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <CartRow
              key={item.id}
              item={item}
              pending={pending}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
            />
          ))}
        </ul>
      </div>

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
          {couponDiscount > 0 && (
            <div className="text-ok flex justify-between">
              <dt>{cartCopy.discountRow}</dt>
              <dd>{price(couponDiscount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-fg-muted">{cartCopy.shipping}</dt>
            <dd className="text-fg-muted">{cartCopy.shippingLater}</dd>
          </div>
          <div className="border-line flex items-baseline justify-between border-t pt-3 text-base font-medium">
            <dt>{cartCopy.total}</dt>
            <dd className="text-lg">{price(cartTotal(items, couponDiscount))}</dd>
          </div>
        </dl>
        <DiscountCodeBox
          coupon={coupon}
          discount={couponDiscount}
          enabled={couponEnabled}
          pending={pending}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
        {blocked || couponInvalid ? (
          <>
            <Button size="lg" fullWidth disabled>
              {cartCopy.checkout}
            </Button>
            <p role="status" className="text-danger text-xs leading-6">
              {blocked ? cartCopy.unavailableBlock : cartCopy.couponInvalidBlock}
            </p>
          </>
        ) : (
          <Link href="/checkout" className={buttonVariants({ size: "lg", fullWidth: true })}>
            {cartCopy.checkout}
          </Link>
        )}
        <Button variant="ghost" size="sm" disabled={pending} onClick={onClear}>
          {cartCopy.clear}
        </Button>
      </aside>
    </div>
  );
}

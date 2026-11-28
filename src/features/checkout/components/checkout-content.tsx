"use client";

import { useEffect, useState } from "react";
import { listAddresses } from "@/features/addresses/api";
import { cartTotal } from "@/features/cart/cart";
import { useCartItems, useCartMeta, useCartReady } from "@/features/cart/use-cart";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { usePlaceOrder } from "@/features/orders/use-place-order";
import { resolveShippingCode } from "@/features/shipping/choice";
import { useShippingOptions } from "@/features/shipping/use-shipping-options";
import { isApiRequestError } from "@/lib/api/errors";
import { resolveSelectedAddressId } from "../address-choice";
import { checkoutCopy } from "../copy";
import { CheckoutView, type AddressesState, type Recipient } from "./checkout-views";

function Skeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-3">
      <span className="sr-only">{checkoutCopy.loading}</span>
      <div
        aria-hidden="true"
        className="rounded-card bg-surface h-40 animate-pulse motion-reduce:animate-none"
      />
    </div>
  );
}

/** صفحه‌ی تسویه: سبد از حافظه‌ی مرورگر، آدرس‌ها از سرور. مهمان به /login می‌رود. */
export function CheckoutContent() {
  const auth = useRequireAuth("/checkout");
  const cartReady = useCartReady();
  const items = useCartItems();
  const meta = useCartMeta();
  const [addresses, setAddresses] = useState<AddressesState>({ status: "loading" });
  const [chosen, setChosen] = useState<string | null>(null);
  const [chosenShipping, setChosenShipping] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const order = usePlaceOrder();

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    let cancelled = false;
    listAddresses()
      .then((list) => {
        if (!cancelled) setAddresses({ status: "ready", items: list });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setAddresses({
            status: "error",
            message: isApiRequestError(e) ? e.message : checkoutCopy.addressLoadError,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [auth.status, reloadKey]);

  const selectedId =
    addresses.status === "ready" ? resolveSelectedAddressId(addresses.items, chosen) : null;
  // هزینه‌ی ارسال به آدرس و سبد بستگی دارد؛ با تغییر هرکدام دوباره گرفته می‌شود.
  const cartKey = `${items.map((i) => `${i.id}:${i.quantity}`).join(",")}|${meta.couponDiscount}`;
  const shipping = useShippingOptions(selectedId, cartKey);
  const shippingCode =
    shipping.state.status === "ready"
      ? resolveShippingCode(shipping.state.options, chosenShipping)
      : null;

  // مبلغی که به مشتری نشان داده شد؛ فقط برای بررسی هم‌خوانی است و قیمت را سرور حساب می‌کند.
  // بعد از «مبلغ تغییر کرد» مشتری مبلغ جدید را تأیید می‌کند، پس دیگر فرستاده نمی‌شود.
  const fee =
    shipping.state.status === "ready"
      ? (shipping.state.options.find((o) => o.code === shippingCode)?.fee ?? 0)
      : 0;
  const accepted = order.state.status === "failed" && order.state.failure.kind === "priceChanged";
  const expectedTotal = accepted ? undefined : cartTotal(items, meta.couponDiscount) + fee;

  if (!cartReady || auth.status === "unknown") return <Skeleton />;
  if (auth.status !== "authenticated") return <Skeleton />;

  const name = [auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ");
  const recipient: Recipient | null = name ? { name, phone: auth.user.phoneNumber } : null;

  return (
    <CheckoutView
      items={items}
      addresses={addresses}
      selectedId={selectedId}
      recipient={recipient}
      couponDiscount={meta.couponDiscount}
      placeState={order.state}
      onPlace={
        selectedId && shippingCode
          ? () => void order.place(selectedId, shippingCode, expectedTotal)
          : undefined
      }
      shipping={{
        state: shipping.state,
        selectedCode: shippingCode,
        onSelect: (code) => {
          order.reset();
          setChosenShipping(code);
        },
        onRetry: shipping.retry,
      }}
      onSelect={(id) => {
        order.reset();
        setChosen(id);
      }}
      onRetry={() => {
        setAddresses({ status: "loading" });
        setReloadKey((k) => k + 1);
      }}
    />
  );
}

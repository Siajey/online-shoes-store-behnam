"use client";

import { useEffect, useState } from "react";
import { listAddresses } from "@/features/addresses/api";
import { useCartItems, useCartReady } from "@/features/cart/use-cart";
import { useRequireAuth } from "@/features/auth/use-require-auth";
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
  const [addresses, setAddresses] = useState<AddressesState>({ status: "loading" });
  const [chosen, setChosen] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

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

  if (!cartReady || auth.status === "unknown") return <Skeleton />;
  if (auth.status !== "authenticated") return <Skeleton />;

  const name = [auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ");
  const recipient: Recipient | null = name ? { name, phone: auth.user.phoneNumber } : null;

  const selectedId =
    addresses.status === "ready" ? resolveSelectedAddressId(addresses.items, chosen) : null;

  return (
    <CheckoutView
      items={items}
      addresses={addresses}
      selectedId={selectedId}
      recipient={recipient}
      onSelect={setChosen}
      onRetry={() => {
        setAddresses({ status: "loading" });
        setReloadKey((k) => k + 1);
      }}
    />
  );
}

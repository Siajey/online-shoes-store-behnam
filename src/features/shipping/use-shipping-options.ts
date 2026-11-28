"use client";

import { useEffect, useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { fetchShippingOptions } from "./api";
import { shippingCopy } from "./copy";
import type { ShippingOption } from "./types";

export type ShippingOptionsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; options: readonly ShippingOption[] };

type Result = { key: string; options: readonly ShippingOption[] } | { key: string; error: string };

/**
 * روش‌های ارسال برای آدرس انتخاب‌شده. cartKey با عوض‌شدن سبد (تعداد، کوپن) دوباره محاسبه را راه می‌اندازد.
 * بدون آدرس: idle.
 */
export function useShippingOptions(addressId: string | null, cartKey: string) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const key = addressId ? `${addressId}|${cartKey}|${attempt}` : null;

  useEffect(() => {
    if (!addressId || !key) return;
    let cancelled = false;
    fetchShippingOptions(addressId)
      .then((options) => {
        if (!cancelled) setResult({ key, options });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setResult({
            key,
            error: isApiRequestError(e) && e.message ? e.message : shippingCopy.loadError,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [addressId, key]);

  let state: ShippingOptionsState = { status: "idle" };
  if (key) {
    if (result && result.key === key) {
      state =
        "error" in result
          ? { status: "error", message: result.error }
          : { status: "ready", options: result.options };
    } else {
      state = { status: "loading" };
    }
  }
  return { state, retry: () => setAttempt((a) => a + 1) };
}

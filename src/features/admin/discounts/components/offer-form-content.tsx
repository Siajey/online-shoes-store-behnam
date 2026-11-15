"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { formatPrice } from "@/lib/format";
import { fetchAdminBrands, fetchAdminCategories } from "../../taxonomy/api";
import { toCategoryRows } from "../../taxonomy/tree";
import { couponsApi, discountsApi, fetchCouponUsage } from "../api";
import { offerCopy as c } from "../copy";
import { isDuplicateCode, offerErrorMessage } from "../errors";
import {
  EMPTY_OFFER,
  fromCoupon,
  fromDiscount,
  validateOffer,
  type OfferErrors,
  type OfferFormInput,
} from "../form";
import type { AdminCoupon, AdminDiscount, CouponUsage, OfferKind } from "../types";
import { CouponUsageCard, OfferFormView } from "./offer-form-view";

type Option = { value: string; label: string };
type Load =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; categories: Option[]; brands: Option[]; usage: CouponUsage | null };

const base = { discount: "/admin/discounts", coupon: "/admin/coupons" } as const;

/** id نبود یعنی «جدید». */
export function OfferFormContent({ kind, id }: { kind: OfferKind; id?: string }) {
  const router = useRouter();
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [values, setValues] = useState<OfferFormInput>(EMPTY_OFFER);
  const [errors, setErrors] = useState<OfferErrors>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchAdminCategories(),
      fetchAdminBrands(),
      id ? (kind === "coupon" ? couponsApi.get(id) : discountsApi.get(id)) : Promise.resolve(null),
      id && kind === "coupon" ? fetchCouponUsage(id).catch(() => null) : Promise.resolve(null),
    ])
      .then(([categories, brands, item, usage]) => {
        if (cancelled) return;
        if (item) {
          setValues(
            kind === "coupon"
              ? fromCoupon(item as AdminCoupon)
              : fromDiscount(item as AdminDiscount),
          );
        }
        setLoad({
          status: "ready",
          categories: toCategoryRows(categories).map((r) => ({
            value: r.category.id,
            label: `${"— ".repeat(r.depth)}${r.category.name}`,
          })),
          brands: brands.map((b) => ({ value: b.id, label: b.name })),
          usage,
        });
      })
      .catch((e: unknown) => {
        if (!cancelled) setLoad({ status: "error", message: offerErrorMessage(e, c.loadError) });
      });
    return () => {
      cancelled = true;
    };
  }, [kind, id, reloadKey]);

  const usageCard = useMemo(
    () =>
      load.status === "ready" && load.usage ? (
        <CouponUsageCard
          usage={{ ...load.usage, totalDiscount: formatPrice(load.usage.totalDiscount) }}
        />
      ) : null,
    [load],
  );

  async function submit() {
    setFormError(undefined);
    const result = validateOffer(values, kind, { editing: Boolean(id) });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const api = kind === "coupon" ? couponsApi : discountsApi;
      if (id) await api.update(id, result.payload);
      else await api.create(result.payload);
      router.push(base[kind]);
    } catch (e) {
      if (isDuplicateCode(e)) setErrors({ code: "duplicate" });
      else setFormError(offerErrorMessage(e));
      setPending(false);
    }
  }

  if (load.status === "loading") {
    return (
      <div
        role="status"
        aria-busy="true"
        className="rounded-card bg-surface h-64 animate-pulse motion-reduce:animate-none"
      >
        <span className="sr-only">{c.loading}</span>
      </div>
    );
  }
  if (load.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4">
        <StateMessage tone="error" className="w-full">
          {load.message}
        </StateMessage>
        <Button
          variant="outline"
          onClick={() => {
            setLoad({ status: "loading" });
            setReloadKey((k) => k + 1);
          }}
        >
          {c.retry}
        </Button>
      </div>
    );
  }
  return (
    <OfferFormView
      kind={kind}
      mode={id ? "edit" : "create"}
      values={values}
      errors={errors}
      categories={load.categories}
      brands={load.brands}
      pending={pending}
      formError={formError}
      backHref={base[kind]}
      usage={usageCard}
      onChange={(v) => {
        setValues(v);
        setErrors({});
      }}
      onSubmit={() => void submit()}
    />
  );
}

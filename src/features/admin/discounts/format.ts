import { formatPrice, toPersianDigits } from "@/lib/format";
import { offerCopy as t } from "./copy";
import type { AdminCoupon, AdminDiscount, DiscountKind, DiscountScope } from "./types";

export type OfferRow = {
  id: string;
  title: string;
  /** کد کوپن */
  code?: string;
  value: string;
  scope: string;
  period: string;
  active: boolean;
};

const date = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(iso)) : "";

export const valueText = (kind: DiscountKind, value: number) =>
  kind === "percent" ? t.percentOff(toPersianDigits(value)) : formatPrice(value);

export const scopeText = (scope: DiscountScope) =>
  scope.type === "all"
    ? t.scopeType.all
    : t.scopeSummary(t.scopeType[scope.type], toPersianDigits(scope.targetIds.length));

export const periodText = (startsAt: string | null, endsAt: string | null) =>
  startsAt || endsAt ? t.periodText(date(startsAt), date(endsAt)) : t.unlimited;

export const discountRow = (d: AdminDiscount): OfferRow => ({
  id: d.id,
  title: d.name,
  value: valueText(d.kind, d.value),
  scope: scopeText(d.scope),
  period: periodText(d.startsAt, d.endsAt),
  active: d.isActive,
});

export const couponRow = (c: AdminCoupon): OfferRow => ({
  id: c.id,
  title: c.name,
  code: c.code,
  value: valueText(c.kind, c.value),
  scope: scopeText(c.scope),
  period: periodText(c.startsAt, c.endsAt),
  active: c.isActive,
});

export const offerRow = (x: AdminDiscount | AdminCoupon): OfferRow =>
  "code" in x ? couponRow(x) : discountRow(x);

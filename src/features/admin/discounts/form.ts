import { toEnglishDigits } from "@/lib/format";
import { tomanToRial } from "@/lib/money";
import type {
  AdminCoupon,
  AdminDiscount,
  DiscountKind,
  DiscountScope,
  OfferKind,
  ScopeType,
} from "./types";

export const MAX_NAME = 120;
export const MAX_TARGETS = 500;
const CODE_PATTERN = /^[A-Z0-9_-]{3,30}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** همه‌ی فیلدها رشته‌اند تا فرم ساده بماند؛ مبالغ به تومان تایپ می‌شوند. */
export type OfferFormInput = {
  name: string;
  code: string;
  kind: DiscountKind;
  value: string;
  cap: string;
  minOrder: string;
  scopeType: ScopeType;
  /** انتخاب‌شده‌ها برای دسته‌بندی و برند */
  targetIds: string[];
  /** شناسه‌های محصول یا ترکیب، جدا شده با فاصله، خط جدید یا ویرگول */
  idsText: string;
  /** مقدار datetime-local: «۲۰۲۶-۰۷-۰۱T۰۰:۰۰» (لاتین) */
  startsAt: string;
  endsAt: string;
  usageTotal: string;
  usagePerUser: string;
  applyToDiscounted: boolean;
  isActive: boolean;
};

export const EMPTY_OFFER: OfferFormInput = {
  name: "",
  code: "",
  kind: "percent",
  value: "",
  cap: "",
  minOrder: "",
  scopeType: "all",
  targetIds: [],
  idsText: "",
  startsAt: "",
  endsAt: "",
  usageTotal: "",
  usagePerUser: "",
  applyToDiscounted: false,
  isActive: true,
};

export type OfferError =
  | "required"
  | "tooLong"
  | "code"
  | "duplicate"
  | "number"
  | "percentMax"
  | "scope"
  | "uuid"
  | "tooMany"
  | "date"
  | "period";

export type OfferErrors = Partial<Record<keyof OfferFormInput, OfferError>>;

export type OfferValidation =
  { ok: true; payload: Record<string, unknown> } | { ok: false; errors: OfferErrors };

/** رشته‌ی خالی: null. عدد صحیح مثبت (با ارقام فارسی هم): عدد. غیر از این: "bad". */
function positiveInt(raw: string): number | null | "bad" {
  const s = toEnglishDigits(raw).replace(/[,٬\s]/g, "");
  if (s === "") return null;
  if (!/^\d+$/.test(s)) return "bad";
  const n = Number(s);
  return Number.isSafeInteger(n) && n > 0 ? n : "bad";
}

/** «ca » و ارقام فارسی را یکدست می‌کند، مثل بک‌اند. */
export const normalizeCode = (raw: string) => toEnglishDigits(raw.trim()).toUpperCase();

const pad = (n: number) => String(n).padStart(2, "0");

/** ISO سرور را به مقدار datetime-local (ساعت محلی) تبدیل می‌کند. */
export function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toIso(local: string): string | null | "bad" {
  if (!local) return null;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "bad" : d.toISOString();
}

export const splitIds = (text: string): string[] => [
  ...new Set(text.split(/[\s,،;]+/).filter(Boolean)),
];

function scopeOf(raw: OfferFormInput): { scope?: DiscountScope; error?: OfferError } {
  const { scopeType } = raw;
  if (scopeType === "all") return { scope: { type: "all", targetIds: [] } };
  const ids =
    scopeType === "category" || scopeType === "brand"
      ? [...new Set(raw.targetIds)]
      : splitIds(raw.idsText);
  if (ids.length === 0) return { error: "scope" };
  if (ids.length > MAX_TARGETS) return { error: "tooMany" };
  if (!ids.every((id) => UUID_PATTERN.test(id))) return { error: "uuid" };
  return { scope: { type: scopeType, targetIds: ids } };
}

type Options = { editing?: boolean };

/**
 * فرم را بررسی می‌کند و بدنه‌ی درخواست (به ریال) می‌سازد.
 * در ویرایش کوپن، code فرستاده نمی‌شود (بک‌اند نمی‌پذیرد).
 */
export function validateOffer(
  raw: OfferFormInput,
  offer: OfferKind,
  { editing = false }: Options = {},
): OfferValidation {
  const errors: OfferErrors = {};
  const name = raw.name.trim().replace(/\s+/g, " ");
  if (!name) errors.name = "required";
  else if (name.length > MAX_NAME) errors.name = "tooLong";

  const code = normalizeCode(raw.code);
  if (offer === "coupon" && !editing && !CODE_PATTERN.test(code)) errors.code = "code";

  const value = positiveInt(raw.value);
  if (value === null) errors.value = "required";
  else if (value === "bad") errors.value = "number";
  else if (raw.kind === "percent" && value > 100) errors.value = "percentMax";

  const cap = positiveInt(raw.cap);
  if (cap === "bad") errors.cap = "number";
  const minOrder = offer === "coupon" ? positiveInt(raw.minOrder) : null;
  if (minOrder === "bad") errors.minOrder = "number";
  const usageTotal = offer === "coupon" ? positiveInt(raw.usageTotal) : null;
  if (usageTotal === "bad") errors.usageTotal = "number";
  const usagePerUser = offer === "coupon" ? positiveInt(raw.usagePerUser) : null;
  if (usagePerUser === "bad") errors.usagePerUser = "number";

  const { scope, error: scopeError } = scopeOf(raw);
  if (scopeError)
    errors[raw.scopeType === "category" || raw.scopeType === "brand" ? "targetIds" : "idsText"] =
      scopeError;

  const startsAt = toIso(raw.startsAt);
  const endsAt = toIso(raw.endsAt);
  if (startsAt === "bad") errors.startsAt = "date";
  if (endsAt === "bad") errors.endsAt = "date";
  if (
    typeof startsAt === "string" &&
    startsAt !== "bad" &&
    typeof endsAt === "string" &&
    endsAt !== "bad" &&
    new Date(startsAt) >= new Date(endsAt)
  ) {
    errors.endsAt = "period";
  }

  if (Object.keys(errors).length > 0 || !scope) return { ok: false, errors };

  const rial = (n: number | null | "bad") => (typeof n === "number" ? tomanToRial(n) : null);
  const amount = raw.kind === "fixed" ? tomanToRial(value as number) : (value as number);
  const common = {
    name,
    kind: raw.kind,
    value: amount,
    scope,
    startsAt: startsAt as string | null,
    endsAt: endsAt as string | null,
    isActive: raw.isActive,
  };

  if (offer === "discount") {
    return { ok: true, payload: { ...common, maxDiscountPerUnit: rial(cap) } };
  }
  return {
    ok: true,
    payload: {
      ...(editing ? {} : { code }),
      ...common,
      maxDiscount: rial(cap),
      minOrderAmount: rial(minOrder),
      applyToDiscountedItems: raw.applyToDiscounted,
      usageLimitTotal: usageTotal as number | null,
      usageLimitPerUser: usagePerUser as number | null,
    },
  };
}

const text = (n: number | null) => (n === null ? "" : String(n));

function scopeFields(
  scope: DiscountScope,
): Pick<OfferFormInput, "scopeType" | "targetIds" | "idsText"> {
  const pick = scope.type === "category" || scope.type === "brand";
  return {
    scopeType: scope.type,
    targetIds: pick ? scope.targetIds : [],
    idsText: pick ? "" : scope.targetIds.join("\n"),
  };
}

export function fromDiscount(d: AdminDiscount): OfferFormInput {
  return {
    ...EMPTY_OFFER,
    name: d.name,
    kind: d.kind,
    value: String(d.value),
    cap: text(d.maxDiscountPerUnit),
    ...scopeFields(d.scope),
    startsAt: toLocalInput(d.startsAt),
    endsAt: toLocalInput(d.endsAt),
    isActive: d.isActive,
  };
}

export function fromCoupon(c: AdminCoupon): OfferFormInput {
  return {
    ...EMPTY_OFFER,
    name: c.name,
    code: c.code,
    kind: c.kind,
    value: String(c.value),
    cap: text(c.maxDiscount),
    minOrder: text(c.minOrderAmount),
    ...scopeFields(c.scope),
    startsAt: toLocalInput(c.startsAt),
    endsAt: toLocalInput(c.endsAt),
    usageTotal: text(c.usageLimitTotal),
    usagePerUser: text(c.usageLimitPerUser),
    applyToDiscounted: c.applyToDiscountedItems,
    isActive: c.isActive,
  };
}

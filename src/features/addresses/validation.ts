import { toEnglishDigits } from "@/lib/format";
import type { AddressInput } from "./types";

export const MAX_FIELD_LENGTH = 100;
export const POSTAL_CODE_LENGTH = 10;

export type AddressErrors = Partial<
  Record<keyof AddressInput, "required" | "tooLong" | "postalCode">
>;

export type AddressValidation =
  { ok: true; value: AddressInput } | { ok: false; errors: AddressErrors };

/** همه‌ی فیلدها الزامی؛ هر کدام حداکثر ۱۰۰ حرف؛ کدپستی ۱۰ رقم (ارقام فارسی هم پذیرفته می‌شود). */
export function validateAddress(raw: AddressInput): AddressValidation {
  const clean = (s: string) => s.trim().replace(/\s+/g, " ");
  const value: AddressInput = {
    province: clean(raw.province),
    city: clean(raw.city),
    street: clean(raw.street),
    postalCode: toEnglishDigits(raw.postalCode).replace(/\s+/g, ""),
  };
  const errors: AddressErrors = {};
  for (const key of ["province", "city", "street"] as const) {
    if (!value[key]) errors[key] = "required";
    else if (value[key].length > MAX_FIELD_LENGTH) errors[key] = "tooLong";
  }
  if (!value.postalCode) errors.postalCode = "required";
  else if (!new RegExp(`^\\d{${POSTAL_CODE_LENGTH}}$`).test(value.postalCode)) {
    errors.postalCode = "postalCode";
  }
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value };
}

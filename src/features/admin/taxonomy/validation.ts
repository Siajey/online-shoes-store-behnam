import { toEnglishDigits } from "@/lib/format";
import type { BrandInput, CategoryInput } from "./types";

export const MAX_NAME = 120;
export const MAX_SLUG = 150;
export const MAX_LOGO_KEY = 255;
export const MAX_SORT_ORDER = 10_000;

/** مثل slugSchema بک‌اند: حرف و عدد، با خط تیره بین بخش‌ها، بدون فاصله. */
const SLUG_PATTERN = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

export type FieldError = "required" | "tooLong" | "slug" | "sortOrder";
export type Errors<T> = Partial<Record<keyof T, FieldError>>;
export type Validation<TIn, TOut> = { ok: true; value: TOut } | { ok: false; errors: Errors<TIn> };

const clean = (s: string) => s.trim().replace(/\s+/g, " ");

function checkNameAndSlug(name: string, slug: string, errors: Errors<{ name: 1; slug: 1 }>) {
  if (!name) errors.name = "required";
  else if (name.length > MAX_NAME) errors.name = "tooLong";
  if (!slug) errors.slug = "required";
  else if (slug.length > MAX_SLUG) errors.slug = "tooLong";
  else if (!SLUG_PATTERN.test(slug)) errors.slug = "slug";
}

export type CategoryPayload = {
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
};

export function validateCategory(raw: CategoryInput): Validation<CategoryInput, CategoryPayload> {
  const name = clean(raw.name);
  const slug = clean(raw.slug).toLowerCase();
  const errors: Errors<CategoryInput> = {};
  checkNameAndSlug(name, slug, errors);

  const orderText = toEnglishDigits(raw.sortOrder).trim();
  let sortOrder = 0;
  if (orderText !== "") {
    sortOrder = /^\d+$/.test(orderText) ? Number(orderText) : -1;
    if (sortOrder < 0 || sortOrder > MAX_SORT_ORDER) errors.sortOrder = "sortOrder";
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, slug, parentId: raw.parentId || null, sortOrder } };
}

export type BrandPayload = { name: string; slug: string; logoKey: string | null };

export function validateBrand(raw: BrandInput): Validation<BrandInput, BrandPayload> {
  const name = clean(raw.name);
  const slug = clean(raw.slug).toLowerCase();
  const logoKey = raw.logoKey.trim();
  const errors: Errors<BrandInput> = {};
  checkNameAndSlug(name, slug, errors);
  if (logoKey.length > MAX_LOGO_KEY) errors.logoKey = "tooLong";
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, slug, logoKey: logoKey || null } };
}

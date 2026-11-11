export const GENDERS = ["men", "women", "unisex", "kids"] as const;
export type Gender = (typeof GENDERS)[number];

export const GENDER_LABEL: Record<Gender, string> = {
  men: "مردانه",
  women: "زنانه",
  unisex: "یونیسکس",
  kids: "بچگانه",
};

export const MAX_NAME = 200;
export const MAX_SLUG = 220;
export const MAX_DESCRIPTION = 5000;
export const MAX_MATERIAL = 100;

export type ProductFormInput = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  gender: string;
  material: string;
};

export type ProductFormError = "required" | "tooLong" | "slug";
export type ProductFormErrors = Partial<Record<keyof ProductFormInput, ProductFormError>>;

/** مثل slugSchema بک‌اند: حرف و عدد، با خط تیره بین بخش‌ها. */
const SLUG_PATTERN = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

export type ProductFormValidation =
  { ok: true; value: ProductPayload } | { ok: false; errors: ProductFormErrors };

export type ProductPayload = {
  name: string;
  slug: string;
  description: string;
  categoryId: string | null;
  brandId: string | null;
  gender: Gender;
  material: string | null;
};

const clean = (s: string) => s.trim().replace(/\s+/g, " ");

/** slugLocked: بعد از اولین انتشار، slug قابل تغییر نیست و بررسی نمی‌شود. */
export function validateProductForm(
  raw: ProductFormInput,
  opts: { slugLocked?: boolean } = {},
): ProductFormValidation {
  const name = clean(raw.name);
  const slug = clean(raw.slug).toLowerCase();
  const description = raw.description.trim();
  const material = clean(raw.material);
  const errors: ProductFormErrors = {};

  if (!name) errors.name = "required";
  else if (name.length > MAX_NAME) errors.name = "tooLong";

  if (!opts.slugLocked) {
    if (!slug) errors.slug = "required";
    else if (slug.length > MAX_SLUG) errors.slug = "tooLong";
    else if (!SLUG_PATTERN.test(slug)) errors.slug = "slug";
  }

  if (description.length > MAX_DESCRIPTION) errors.description = "tooLong";
  if (!(GENDERS as readonly string[]).includes(raw.gender)) errors.gender = "required";
  if (material.length > MAX_MATERIAL) errors.material = "tooLong";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    value: {
      name,
      slug,
      description,
      categoryId: raw.categoryId || null,
      brandId: raw.brandId || null,
      gender: raw.gender as Gender,
      material: material || null,
    },
  };
}

export const EMPTY_FORM: ProductFormInput = {
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  brandId: "",
  gender: "",
  material: "",
};

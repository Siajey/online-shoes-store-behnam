import { describe, expect, it } from "vitest";
import { toFormInput, toProductDetail, type AdminProductDetailDto } from "./detail";
import { EMPTY_FORM, validateProductForm } from "./form";
import { toStatus } from "./mappers";

const ok = {
  name: " کتونی  نایک ",
  slug: " Nike-Air ",
  description: " توضیح ",
  categoryId: "c1",
  brandId: "",
  gender: "men",
  material: " ",
};

describe("validateProductForm", () => {
  it("تمیز می‌کند و مقدارهای خالی را null می‌کند", () => {
    expect(validateProductForm(ok)).toEqual({
      ok: true,
      value: {
        name: "کتونی نایک",
        slug: "nike-air",
        description: "توضیح",
        categoryId: "c1",
        brandId: null,
        gender: "men",
        material: null,
      },
    });
  });
  it("فرم خالی: نام، slug و جنسیت الزامی‌اند", () => {
    const r = validateProductForm(EMPTY_FORM);
    expect(r).toEqual({
      ok: false,
      errors: { name: "required", slug: "required", gender: "required" },
    });
  });
  it("slug نامعتبر و طول‌های زیاد", () => {
    expect(validateProductForm({ ...ok, slug: "a b" })).toMatchObject({
      ok: false,
      errors: { slug: "slug" },
    });
    expect(validateProductForm({ ...ok, name: "x".repeat(201) }).ok).toBe(false);
    expect(validateProductForm({ ...ok, description: "x".repeat(5001) }).ok).toBe(false);
    expect(validateProductForm({ ...ok, material: "x".repeat(101) }).ok).toBe(false);
    expect(validateProductForm({ ...ok, gender: "alien" }).ok).toBe(false);
  });
  it("وقتی slug قفل است بررسی نمی‌شود", () => {
    expect(validateProductForm({ ...ok, slug: "" }, { slugLocked: true }).ok).toBe(true);
  });
});

const dto: AdminProductDetailDto = {
  id: "1",
  type: "shoe",
  name: "کتونی",
  slug: "nike",
  description: "d",
  status: "published",
  categoryId: "c1",
  brandId: null,
  details: { gender: "women", material: "چرم" },
  publishedAt: "2026-11-10T00:00:00.000Z",
  variants: [
    {
      id: "v1",
      title: null,
      sku: "S-1",
      price: 1000,
      stock: 3,
      isActive: true,
      attributes: { size: "42" },
    },
  ],
};

describe("toProductDetail", () => {
  it("نگاشت، قفل slug بعد از انتشار و واریانت‌ها", () => {
    const p = toProductDetail(dto, toStatus);
    expect(p).toMatchObject({
      status: "published",
      slugLocked: true,
      categoryId: "c1",
      brandId: "",
      gender: "women",
      material: "چرم",
    });
    expect(p.variants[0]).toMatchObject({ title: "S-1", price: 100, stock: 3 });
    expect(toFormInput(p)).toMatchObject({ slug: "nike", gender: "women", brandId: "" });
  });
  it("پیش‌نویس منتشرنشده slug قفل ندارد و واریانت اختیاری است", () => {
    const p = toProductDetail(
      { ...dto, publishedAt: null, variants: undefined, details: null },
      toStatus,
    );
    expect(p.slugLocked).toBe(false);
    expect(p.variants).toEqual([]);
    expect(p.gender).toBe("");
  });
});

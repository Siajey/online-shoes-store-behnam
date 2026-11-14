import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiSuccess } from "@/lib/api/types";
import type { ProductDetailDto, ProductsPageDto } from "./dto";
import sample from "./__fixtures__/products.json";
import { toProduct, toProductDetail } from "./mappers";

const items = (sample as unknown as ApiSuccess<ProductsPageDto>).data.items;

describe("toProduct (شکل ماژول محصول بک‌اند)", () => {
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "https://cdn.example.com"));
  afterEach(() => vi.unstubAllEnvs());

  it("هر شش محصول تبدیل می‌شود", () => {
    expect(items.map((i) => toProduct(i))).toHaveLength(6);
  });
  it("قیمت پایه = کمترین قیمت و بیشینه فقط وقتی فرق دارد", () => {
    expect(toProduct(items[0]).price).toBe(360_000);
    expect(toProduct(items[0]).maxPrice).toBeUndefined();
    expect(toProduct(items[4]).maxPrice).toBe(310_000);
  });
  it("تصویر از کلید و آدرس CDN", () => {
    expect(toProduct(items[0]).imageUrl).toBe(
      "https://cdn.example.com/seed/nike-air-max-90-0.webp",
    );
  });
  it("بدون آدرس CDN تصویر ندارد", () => {
    vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "");
    expect(toProduct(items[0]).imageUrl).toBeUndefined();
  });
  it("ناموجود (inStock=false)", () => {
    expect(toProduct(items[5]).available).toBe(false);
    expect(toProduct(items[0]).available).toBe(true);
  });
  it("نام و slug دسته از lookup", () => {
    const lookup = new Map([
      [items[0].categoryId as string, { name: "کفش اسپرت مردانه", slug: "mens-sports-shoes" }],
    ]);
    const p = toProduct(items[0], lookup);
    expect(p.categoryName).toBe("کفش اسپرت مردانه");
    expect(p.categorySlug).toBe("mens-sports-shoes");
    expect(toProduct(items[0]).categorySlug).toBeUndefined();
  });
  it("بدون قیمت (بدون ترکیب فعال): ناموجود", () => {
    expect(toProduct({ ...items[0], minPrice: null, maxPrice: null }).available).toBe(false);
  });
});

describe("toProductDetail", () => {
  const detail: ProductDetailDto = {
    ...items[0],
    description: "توضیح",
    images: [
      { fileKey: "a.webp", altText: null },
      { fileKey: "b.webp", altText: null },
    ],
    options: { size: ["40", "41"], color: ["مشکی"] },
    variants: [
      { id: "v1", price: 3_600_000, isAvailable: true, attributes: { size: "40", color: "مشکی" } },
      { id: "v2", price: 3_600_000, isAvailable: false, attributes: { size: "41", color: "مشکی" } },
    ],
  };
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_MEDIA_BASE_URL", "https://cdn.example.com"));
  afterEach(() => vi.unstubAllEnvs());

  it("ترکیب‌ها با برچسب فارسی و موجودی", () => {
    const p = toProductDetail(detail);
    expect(p.variants?.[0].options).toEqual({ سایز: "40", رنگ: "مشکی" });
    expect(p.variants?.map((v) => v.available)).toEqual([true, false]);
  });
  it("گالری و توضیحات", () => {
    const p = toProductDetail(detail);
    expect(p.images).toEqual(["https://cdn.example.com/a.webp", "https://cdn.example.com/b.webp"]);
    expect(p.description).toBe("توضیح");
  });
  it("بدون ترکیب: variants ندارد", () => {
    expect(toProductDetail({ ...detail, variants: [] }).variants).toBeUndefined();
  });
});

describe("ویژگی‌های عددی ترکیب", () => {
  it("مقدار عددی (سایز) را به رشته تبدیل می‌کند", () => {
    const dto = {
      id: "p1",
      type: "shoe",
      name: "کفش",
      slug: "shoe",
      categoryId: null,
      brandId: null,
      primaryImage: null,
      minPrice: 10,
      maxPrice: 10,
      inStock: true,
      details: null,
      description: "",
      images: [],
      options: {},
      variants: [{ id: "v1", price: 10, isAvailable: true, attributes: { size: 42 } }],
    };
    const product = toProductDetail(dto as never);
    expect(product.variants?.[0].options["سایز"]).toBe("42");
  });
});

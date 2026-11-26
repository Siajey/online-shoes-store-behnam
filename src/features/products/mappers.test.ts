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
    expect(toProduct(items[0]).price).toBe(3_600_000);
    expect(toProduct(items[0]).maxPrice).toBeUndefined();
    expect(toProduct(items[4]).maxPrice).toBe(3_100_000);
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

describe("toProduct با meta بک‌اند (تخفیف و برچسب)", () => {
  const meta = (over: Record<string, unknown> = {}) => ({
    tags: ["newest"] as ("newest" | "best_seller" | "popular")[],
    pricing: {
      minPrice: 1_000_000,
      maxPrice: 1_000_000,
      finalMinPrice: 800_000,
      finalMaxPrice: 800_000,
      hasDiscount: true,
      maxDiscountPercent: 20,
      ...over,
    },
  });

  it("قیمت نهایی، قیمت اصلی خط‌خورده و درصد تخفیف", () => {
    const p = toProduct({ ...items[0], meta: meta() });
    expect(p.price).toBe(800_000);
    expect(p.originalPrice).toBe(1_000_000);
    expect(p.discountLabel).toBe("۲۰٪ تخفیف");
  });
  it("بدون تخفیف: قیمت اصلی و برچسب تخفیف نیست", () => {
    const p = toProduct({
      ...items[0],
      meta: meta({ finalMinPrice: 1_000_000, finalMaxPrice: 1_000_000, hasDiscount: false }),
    });
    expect(p.originalPrice).toBeUndefined();
    expect(p.discountLabel).toBeUndefined();
  });
  it("مهم‌ترین برچسب: پرفروش > محبوب > جدید", () => {
    expect(
      toProduct({ ...items[0], meta: { ...meta(), tags: ["newest", "best_seller"] } }).tag,
    ).toBe("پرفروش");
    expect(toProduct({ ...items[0], meta: { ...meta(), tags: ["newest", "popular"] } }).tag).toBe(
      "محبوب",
    );
    expect(toProduct({ ...items[0], meta: meta() }).tag).toBe("جدید");
    expect(toProduct({ ...items[0], meta: { ...meta(), tags: [] } }).tag).toBeUndefined();
  });
  it("بدون meta همان قیمت پایه (سازگار با پاسخ قدیمی)", () => {
    const p = toProduct(items[0]);
    expect(p.price).toBe(3_600_000);
    expect(p.originalPrice).toBeUndefined();
    expect(p.tag).toBeUndefined();
  });
  it("آدرس کامل تصویر از بک‌اند اولویت دارد", () => {
    const p = toProduct({
      ...items[0],
      primaryImage: {
        fileKey: "products/a.webp",
        url: "https://img.test/products/a.webp",
        altText: null,
      },
    });
    expect(p.imageUrl).toBe("https://img.test/products/a.webp");
  });
});

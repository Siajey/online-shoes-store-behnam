import { describe, expect, it } from "vitest";
import { toFavouriteProduct } from "./mappers";

const dto = {
  productId: "p1",
  name: "کتانی",
  slug: "sneaker",
  imageKey: null,
  minPrice: 2_500_000,
  maxPrice: 3_500_000,
  inStock: true,
  favoritedAt: "2026-11-14T08:30:00.000Z",
};

describe("toFavouriteProduct", () => {
  it("فیلدها را به مدل محصول تبدیل می‌کند", () => {
    const p = toFavouriteProduct(dto);
    expect(p.id).toBe("p1");
    expect(p.slug).toBe("sneaker");
    expect(p.available).toBe(true);
    expect(p.imageUrl).toBeUndefined();
  });
  it("قیمت null: ناموجود", () => {
    const p = toFavouriteProduct({ ...dto, minPrice: null, maxPrice: null });
    expect(p.available).toBe(false);
    expect(p.maxPrice).toBeUndefined();
  });
  it("موجود نبودن", () => {
    expect(toFavouriteProduct({ ...dto, inStock: false }).available).toBe(false);
  });
  it("بیشینه‌ی برابر با کمینه نمایش داده نمی‌شود", () => {
    expect(toFavouriteProduct({ ...dto, maxPrice: dto.minPrice }).maxPrice).toBeUndefined();
  });
  it("imageUrl سرور استفاده می‌شود", () => {
    const p = toFavouriteProduct({ ...dto, imageUrl: "https://img.test/a.webp" });
    expect(p.imageUrl).toBe("https://img.test/a.webp");
  });
});

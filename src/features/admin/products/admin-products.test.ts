import { describe, expect, it } from "vitest";
import { toAdminProduct, toStatus } from "./mappers";
import { allowedActions } from "./status";

describe("toStatus", () => {
  it("وضعیت ناشناخته پیش‌نویس می‌شود", () => {
    expect(toStatus("published")).toBe("published");
    expect(toStatus("???")).toBe("draft");
  });
});

describe("toAdminProduct", () => {
  it("فیلدها را نگاشت می‌کند و تصویر را از fileKey برمی‌دارد", () => {
    const p = toAdminProduct({
      id: "1",
      type: "shoe",
      name: "کتونی",
      slug: "a",
      status: "published",
      categoryId: null,
      brandId: null,
      primaryImage: { fileKey: "seed/a.webp" },
      minPrice: 100,
      maxPrice: 200,
      inStock: true,
      variantCount: 3,
      activeVariantCount: 2,
      updatedAt: "2026-11-10T00:00:00.000Z",
    });
    expect(p).toMatchObject({
      id: "1",
      status: "published",
      imageKey: "seed/a.webp",
      minPrice: 10,
      activeVariantCount: 2,
    });
  });
  it("بدون تصویر و قیمت", () => {
    const p = toAdminProduct({
      id: "1",
      type: "shoe",
      name: "x",
      slug: "x",
      status: "draft",
      categoryId: null,
      brandId: null,
      primaryImage: null,
      minPrice: null,
      maxPrice: null,
      inStock: false,
      variantCount: 0,
      activeVariantCount: 0,
      updatedAt: "",
    });
    expect(p.imageKey).toBeUndefined();
    expect(p.minPrice).toBeNull();
  });
});

describe("allowedActions", () => {
  it("مطابق انتقال‌های مجاز بک‌اند", () => {
    expect(allowedActions("draft")).toEqual(["publish", "archive"]);
    expect(allowedActions("published")).toEqual(["unpublish", "archive"]);
    expect(allowedActions("archived")).toEqual(["unpublish"]);
  });
});

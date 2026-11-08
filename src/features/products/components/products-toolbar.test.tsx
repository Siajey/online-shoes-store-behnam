import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductsToolbar } from "./products-toolbar";

describe("ProductsToolbar", () => {
  it("چیپ‌های مرتب‌سازی و فرم GET با فیلدهای پنهان", () => {
    const out = renderToStaticMarkup(
      <ProductsToolbar filters={{ category: "men", q: "نایک", sort: "price-asc" }} />,
    );
    for (const s of ["ارزان‌ترین", "گران‌ترین", "بیشترین تخفیف", "اعمال فیلتر"])
      expect(out).toContain(s);
    expect(out).toContain('method="get"');
    expect(out).toContain('name="category"');
    expect(out).toContain('aria-current="true"');
    expect(out).not.toContain("حذف فیلترها");
  });
  it("فیلتر فعال: شمارنده و لینک حذف", () => {
    const out = renderToStaticMarkup(
      <ProductsToolbar filters={{ minPrice: 100, inStock: true }} />,
    );
    expect(out).toContain("فیلترها (۲)");
    expect(out).toContain("حذف فیلترها");
    expect(out).toContain("checked");
  });
});

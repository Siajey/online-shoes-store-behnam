import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CatalogFacets } from "../types";
import { ProductsFilterForm } from "./products-filter-form";

const facets: CatalogFacets = {
  brands: [{ id: "b1", name: "نایک", slug: "nike", count: 3 }],
  priceRange: { min: 100000, max: 900000 },
  colorAttribute: "رنگ",
  colors: [{ value: "مشکی", count: 4 }],
  sizeAttribute: "سایز",
  sizes: [{ value: "42", count: 2 }],
};

describe("ProductsFilterForm", () => {
  it("بدون facets فقط قیمت و موجودی", () => {
    const out = renderToStaticMarkup(<ProductsFilterForm filters={{}} />);
    expect(out).toContain('name="minPrice"');
    expect(out).toContain('name="inStock"');
    expect(out).not.toContain('name="color"');
  });
  it("با facets: برند، رنگ و سایز با مقدار انتخاب‌شده", () => {
    const out = renderToStaticMarkup(
      <ProductsFilterForm filters={{ colors: ["مشکی"], brand: "nike" }} facets={facets} />,
    );
    expect(out).toContain('name="brand"');
    expect(out).toContain('name="color"');
    expect(out).toContain('name="size"');
    expect(out).toContain("checked");
    expect(out).toContain("حذف فیلترها");
  });
  it("فیلدهای پنهان فقط q و category و sort را نگه می‌دارند", () => {
    const out = renderToStaticMarkup(
      <ProductsFilterForm filters={{ q: "ab", sort: "price-asc", brand: "nike" }} />,
    );
    expect(out).toContain('type="hidden" name="q"');
    expect(out).not.toContain('type="hidden" name="brand"');
  });
});

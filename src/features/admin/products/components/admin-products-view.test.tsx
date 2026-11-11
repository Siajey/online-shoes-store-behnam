import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { AdminProduct } from "../types";
import { FilterBar, ProductListView, priceText } from "./admin-products-view";

const p = (over: Partial<AdminProduct> = {}): AdminProduct => ({
  id: "1",
  name: "کتونی نایک",
  slug: "nike",
  status: "draft",
  minPrice: 1000,
  maxPrice: 1000,
  inStock: true,
  variantCount: 2,
  activeVariantCount: 2,
  updatedAt: "",
  ...over,
});
const noop = () => {};
const base = { busyId: null, loadingMore: false, onAction: noop, onRetry: noop, onLoadMore: noop };

describe("priceText", () => {
  it("بدون قیمت", () => expect(priceText({ minPrice: null, maxPrice: null })).toBe("قیمت ندارد"));
  it("بازهٔ قیمت", () => expect(priceText({ minPrice: 1000, maxPrice: 2000 })).toContain("تا"));
});

describe("ProductListView", () => {
  it("حالت‌های بارگذاری، خطا و خالی", () => {
    expect(
      renderToStaticMarkup(<ProductListView {...base} state={{ status: "loading" }} />),
    ).toContain("در حال بارگذاری");
    const err = renderToStaticMarkup(
      <ProductListView {...base} state={{ status: "error", message: "قطع" }} />,
    );
    expect(err).toContain('role="alert"');
    expect(
      renderToStaticMarkup(
        <ProductListView {...base} state={{ status: "ready", items: [], hasMore: false }} />,
      ),
    ).toContain("محصولی پیدا نشد");
  });
  it("دکمه‌ها مطابق وضعیت محصول‌اند", () => {
    const draft = renderToStaticMarkup(
      <ProductListView {...base} state={{ status: "ready", items: [p()], hasMore: false }} />,
    );
    expect(draft).toContain("انتشار");
    expect(draft).not.toContain("برگشت به پیش‌نویس");
    const pub = renderToStaticMarkup(
      <ProductListView
        {...base}
        state={{ status: "ready", items: [p({ status: "published" })], hasMore: true }}
      />,
    );
    expect(pub).toContain("برگشت به پیش‌نویس");
    expect(pub).toContain("نمایش بیشتر");
  });
  it("هنگام انجام عملیات دکمه‌ها غیرفعال‌اند", () => {
    const out = renderToStaticMarkup(
      <ProductListView
        {...base}
        busyId="1"
        state={{ status: "ready", items: [p()], hasMore: false }}
      />,
    );
    expect(out).toContain("disabled");
  });
});

describe("FilterBar", () => {
  it("چیپ فعال aria-pressed دارد", () => {
    const out = renderToStaticMarkup(
      <FilterBar status="draft" onStatus={noop} query="" onQuery={noop} onSearch={noop} />,
    );
    expect(out).toContain('aria-pressed="true"');
    expect(out).toContain("جستجوی نام محصول");
  });
});

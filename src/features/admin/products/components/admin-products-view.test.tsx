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
const list = (items: AdminProduct[], hasMore = false) =>
  renderToStaticMarkup(<ProductListView {...base} state={{ status: "ready", items, hasMore }} />);

describe("priceText", () => {
  it("بدون قیمت", () => expect(priceText({ minPrice: null, maxPrice: null })).toBe("قیمت ندارد"));
  it("بازهٔ قیمت", () => expect(priceText({ minPrice: 1000, maxPrice: 2000 })).toContain("تا"));
  it("قیمت واحد بدون عبارت «تا»", () => {
    expect(priceText({ minPrice: 1000, maxPrice: 1000 })).not.toContain("تا");
  });
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
    expect(list([])).toContain("محصولی پیدا نشد");
  });

  it("سرستون‌های جدول و نام و slug محصول نمایش داده می‌شود", () => {
    const out = list([p()]);
    for (const title of ["محصول", "قیمت (تومان)", "موجودی", "وضعیت", "عملیات"]) {
      expect(out).toContain(title);
    }
    expect(out).toContain("کتونی نایک");
    expect(out).toContain("nike");
  });

  it("دکمه‌ها مطابق وضعیت محصول‌اند", () => {
    const draft = list([p()]);
    expect(draft).toContain("انتشار");
    expect(draft).not.toContain("برگشت به پیش‌نویس");
    const pub = list([p({ status: "published" })], true);
    expect(pub).toContain("برگشت به پیش‌نویس");
    expect(pub).toContain("نمایش بیشتر");
  });

  it("ویرایش یک لینک آیکنی با برچسب دسترس‌پذیر است", () => {
    const out = list([p()]);
    expect(out).toContain('href="/admin/products/1"');
    expect(out).toContain('aria-label="ویرایش «کتونی نایک»"');
  });

  it("وضعیت موجودی با نشان نمایش داده می‌شود", () => {
    expect(list([p()])).toContain("موجود");
    expect(list([p({ inStock: false })])).toContain("ناموجود");
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
  it("منوی وضعیت مقدار انتخابی را دارد و جستجو برچسب دارد", () => {
    const out = renderToStaticMarkup(
      <FilterBar status="draft" onStatus={noop} query="" onQuery={noop} onSearch={noop} />,
    );
    expect(out).toContain("جستجوی نام محصول");
    expect(out).toMatch(/<option[^>]*value="draft"[^>]*selected|<select[^>]*>/);
    expect(out).toContain("پیش‌نویس");
    expect(out).toContain("همه");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductsPagination, pageWindow } from "./products-pagination";

describe("pageWindow", () => {
  it("حداکثر ۵ شماره و تا صفحه‌ی بعد", () => {
    expect(pageWindow(1, true)).toEqual([1, 2]);
    expect(pageWindow(1, false)).toEqual([1]);
    expect(pageWindow(5, true)).toEqual([2, 3, 4, 5, 6]);
    expect(pageWindow(8, false)).toEqual([4, 5, 6, 7, 8]);
  });
});

describe("ProductsPagination", () => {
  it("یک صفحه‌ی تنها چیزی نشان نمی‌دهد", () => {
    expect(renderToStaticMarkup(<ProductsPagination filters={{}} page={1} hasNext={false} />)).toBe(
      "",
    );
  });
  it("قبلی و بعدی و صفحه‌ی فعلی", () => {
    const out = renderToStaticMarkup(
      <ProductsPagination filters={{ q: "نایک" }} page={2} hasNext />,
    );
    expect(out).toContain("صفحه‌ی قبل");
    expect(out).toContain("صفحه‌ی بعد");
    expect(out).toContain('aria-current="page"');
    expect(out).toContain("page=3");
  });
});

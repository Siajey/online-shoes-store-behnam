import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "../types";
import { ProductList } from "./product-list";

vi.mock("../api", () => ({ fetchProducts: vi.fn() }));

const p = (id: string): Product => ({
  id,
  slug: id,
  name: `کفش ${id}`,
  price: 1_000_000,
  available: true,
});
const render = (items: Product[], cursor: string | null) =>
  renderToStaticMarkup(<ProductList initialItems={items} initialCursor={cursor} filters={{}} />);

describe("ProductList", () => {
  it("محصولات و دکمه‌ی «نمایش بیشتر» را وقتی صفحه‌ی بعد هست نشان می‌دهد", () => {
    const out = render([p("1"), p("2")], "next");
    expect(out).toContain("کفش 1");
    expect(out).toContain("نمایش بیشتر");
  });
  it("در صفحه‌ی آخر دکمه‌ی «نمایش بیشتر» ندارد", () => {
    expect(render([p("1")], null)).not.toContain("نمایش بیشتر");
  });
  it("لیست خالی پیام «پیدا نشد» می‌دهد", () => {
    const out = render([], null);
    expect(out).toContain("محصولی با این شرایط پیدا نشد.");
    expect(out).not.toContain("نمایش بیشتر");
  });
});

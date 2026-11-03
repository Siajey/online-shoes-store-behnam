import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Product } from "../types";
import { ProductPurchase } from "./product-purchase";

const product: Product = {
  id: "p1",
  slug: "shoe-a",
  name: "کفش الف",
  price: 1_000_000,
  available: true,
};
const html = (over: Partial<Product> = {}) =>
  renderToStaticMarkup(<ProductPurchase product={{ ...product, ...over }} />);

describe("ProductPurchase", () => {
  it("تعداد اولیه ۱ (فارسی) و دکمه‌های تعداد را دارد", () => {
    const out = html();
    expect(out).toContain("۱");
    expect(out).toContain('aria-label="افزایش تعداد"');
    expect(out).toContain('aria-label="کاهش تعداد"');
    expect(out).toContain("افزودن به سبد خرید");
  });
  it("کاهش در تعداد ۱ غیرفعال است", () => {
    expect(html()).toMatch(/<button[^>]*aria-label="کاهش تعداد"[^>]*disabled=""/);
  });
  it("ناموجود: دکمه‌ی خرید غیرفعال و متن «ناموجود»", () => {
    const out = html({ available: false });
    expect(out).toContain("ناموجود");
    expect(out).not.toContain("افزودن به سبد خرید");
  });
  it("علاقه‌مندی با aria-pressed اعلام می‌شود", () => {
    expect(html()).toContain('aria-pressed="false"');
  });
  it("ناحیه‌ی پیام (status) از ابتدا هست ولی خالی است", () => {
    const out = html();
    expect(out).toContain('role="status"');
    expect(out).not.toContain("مشاهده‌ی سبد خرید");
  });
});

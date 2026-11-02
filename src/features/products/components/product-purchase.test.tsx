import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductPurchase } from "./product-purchase";

describe("ProductPurchase", () => {
  it("تعداد اولیه ۱ (فارسی) و دکمه‌های تعداد را دارد", () => {
    const out = renderToStaticMarkup(<ProductPurchase available />);
    expect(out).toContain("۱");
    expect(out).toContain('aria-label="افزایش تعداد"');
    expect(out).toContain('aria-label="کاهش تعداد"');
    expect(out).toContain("افزودن به سبد خرید");
  });
  it("کاهش در تعداد ۱ غیرفعال است", () => {
    const out = renderToStaticMarkup(<ProductPurchase available />);
    expect(out).toMatch(
      /<button[^>]*aria-label="کاهش تعداد"[^>]*disabled|<button[^>]*disabled[^>]*aria-label="کاهش تعداد"/,
    );
  });
  it("ناموجود: دکمه‌ی خرید غیرفعال و متن «ناموجود»", () => {
    const out = renderToStaticMarkup(<ProductPurchase available={false} />);
    expect(out).toContain("ناموجود");
    expect(out).not.toContain("افزودن به سبد خرید");
  });
  it("علاقه‌مندی با aria-pressed اعلام می‌شود", () => {
    expect(renderToStaticMarkup(<ProductPurchase available />)).toContain('aria-pressed="false"');
  });
});

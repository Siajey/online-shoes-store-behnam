import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./product-card";

const base = { name: "کتانی آبی اسپرت", href: "/products/blue", price: 2_190_000 };
const html = (props: Partial<Parameters<typeof ProductCard>[0]> = {}) =>
  renderToStaticMarkup(<ProductCard {...base} {...props} />);

describe("ProductCard", () => {
  it("نام، لینک و قیمت فارسی را نشان می‌دهد", () => {
    const out = html();
    expect(out).toContain("کتانی آبی اسپرت");
    expect(out).toContain('href="/products/blue"');
    expect(out).toContain("۲٬۱۹۰٬۰۰۰");
    expect(out).toContain("تومان");
  });

  it("برچسب را فقط وقتی داده شود نشان می‌دهد", () => {
    expect(html({ tag: "پرفروش" })).toContain("پرفروش");
    expect(html()).not.toContain("پرفروش");
  });

  it("دکمه‌ی علاقه‌مندی وضعیت را با aria-pressed اعلام می‌کند", () => {
    expect(html({ favourite: false })).toContain('aria-pressed="false"');
    const on = html({ favourite: true });
    expect(on).toContain('aria-pressed="true"');
    expect(on).toContain("حذف از علاقه‌مندی‌ها");
  });

  it("دکمه‌ی افزودن به سبد برچسب دسترس‌پذیر دارد", () => {
    expect(html()).toContain('aria-label="افزودن به سبد"');
  });

  it("با تخفیف، قیمت قبلی خط‌خورده و متن تخفیف نمایش داده می‌شود", () => {
    const out = html({ price: 3_600_000, originalPrice: 4_500_000, discountLabel: "۲۰٪ تخفیف" });
    expect(out).toContain("۴٬۵۰۰٬۰۰۰");
    expect(out).toContain("line-through");
    expect(out).toContain("۲۰٪ تخفیف");
  });

  it("بدون تخفیف، متن تخفیف ندارد", () => {
    expect(html()).not.toContain('line-through">۴');
    expect(html()).not.toContain("تخفیف");
  });

  it("ناموجود: دکمه‌ی سبد غیرفعال و نشان «ناموجود» دیده می‌شود", () => {
    const out = html({ unavailable: true, discountLabel: "۲۰٪ تخفیف" });
    expect(out).toContain("ناموجود");
    expect(out).toMatch(
      /<button[^>]*disabled=""[^>]*aria-label="افزودن به سبد"|<button[^>]*aria-label="افزودن به سبد"[^>]*disabled=""/,
    );
    expect(out).not.toContain("۲۰٪ تخفیف");
  });

  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    expect(html()).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

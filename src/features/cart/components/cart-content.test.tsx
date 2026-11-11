import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CartContent, CartView } from "./cart-content";
import type { CartItem } from "../types";

const items: CartItem[] = [
  { id: "a", slug: "shoe-a", name: "کفش الف", price: 1_000_000, quantity: 2 },
  { id: "b", slug: "boot-b", name: "بوت ب", price: 800_000, originalPrice: 1_000_000, quantity: 1 },
];
const noop = () => {};
const html = (list: CartItem[]) =>
  renderToStaticMarkup(
    <CartView items={list} onQuantityChange={noop} onRemove={noop} onClear={noop} />,
  );

describe("CartView", () => {
  it("سبد خالی پیام و لینک به محصولات دارد", () => {
    const out = html([]);
    expect(out).toContain("سبد خرید شما خالی است.");
    expect(out).toContain('href="/products"');
  });

  it("نام کالاها با لینک صفحه‌ی محصول نمایش داده می‌شود", () => {
    const out = html(items);
    expect(out).toContain("کفش الف");
    expect(out).toContain('href="/products/shoe-a"');
  });

  it("جمع و سود تخفیف و تعداد را فارسی حساب می‌کند", () => {
    const out = html(items);
    expect(out).toContain("۲٬۸۰۰٬۰۰۰"); // ۲×۱٬۰۰۰٬۰۰۰ + ۸۰۰٬۰۰۰
    expect(out).toContain("۲۰۰٬۰۰۰"); // سود تخفیف
    expect(out).toContain("سود شما از تخفیف");
  });

  it("بدون تخفیف، سطر سود نشان داده نمی‌شود", () => {
    expect(html([items[0]])).not.toContain("سود شما از تخفیف");
  });

  it("هر ردیف دکمه‌ی حذف با برچسب دسترس‌پذیر و کنترل تعداد دارد", () => {
    const out = html(items);
    expect(out).toContain('aria-label="حذف «کفش الف» از سبد"');
    expect(out).toContain('aria-label="افزایش تعداد"');
  });

  it("ادامه‌ی خرید لینک به صفحه‌ی تسویه است", () => {
    expect(html(items)).toMatch(/<a[^>]*href="\/checkout"[^>]*>ادامه‌ی خرید/);
  });

  it("ردیف هزینهٔ ارسال و کد تخفیف غیرفعال", () => {
    const out = html(items);
    expect(out).toContain("هزینه‌ی ارسال");
    expect(out).toContain("در مرحله‌ی بعد محاسبه می‌شود");
    expect(out).toContain("کد تخفیف");
    expect(out).toMatch(/<input[^>]*disabled/);
    expect(out).toContain("ثبت کد تخفیف به‌زودی فعال می‌شود.");
  });

  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    expect(html(items)).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

describe("CartContent", () => {
  it("روی سرور اسکلت نشان می‌دهد، نه «سبد خالی»", () => {
    const out = renderToStaticMarkup(<CartContent />);
    expect(out).toContain("در حال بارگذاری سبد خرید");
    expect(out).not.toContain("سبد خرید شما خالی است.");
  });
});

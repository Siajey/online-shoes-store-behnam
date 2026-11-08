import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CheckoutView, type AddressesState } from "./checkout-views";

const items = [
  { id: "1", slug: "a", name: "کفش الف", price: 1000000, originalPrice: 1200000, quantity: 2 },
];
const addr = (id: string, isDefault = false) => ({
  id,
  province: "تهران",
  city: "تهران",
  street: "خیابان آزادی",
  postalCode: "1234567890",
  isDefault,
});
const noop = () => {};
const html = (addresses: AddressesState, selectedId: string | null = null, cart = items) =>
  renderToStaticMarkup(
    <CheckoutView
      items={cart}
      addresses={addresses}
      selectedId={selectedId}
      onSelect={noop}
      onRetry={noop}
    />,
  );

describe("CheckoutView sections", () => {
  it("گیرنده، ارسال دوگانه، پرداخت آنلاین و بدون پرداخت در محل", () => {
    const out = renderToStaticMarkup(
      <CheckoutView
        items={items}
        addresses={{ status: "ready", items: [addr("a", true)] }}
        selectedId="a"
        onSelect={noop}
        onRetry={noop}
        recipient={{ name: "علی رضایی", phone: "09121234567" }}
      />,
    );
    for (const s of [
      "علی رضایی",
      "پست پیشتاز",
      "تیپاکس",
      "پرداخت آنلاین",
      "قوانین و مقررات",
      "اطلاعات و پرداخت",
    ])
      expect(out).toContain(s);
    expect(out).not.toContain("پیک");
  });
  it("بدون نام: پیام ویرایش پروفایل", () => {
    const out = renderToStaticMarkup(
      <CheckoutView
        items={items}
        addresses={{ status: "ready", items: [] }}
        selectedId={null}
        onSelect={noop}
        onRetry={noop}
      />,
    );
    expect(out).toContain("ویرایش پروفایل");
  });
});

describe("CheckoutView", () => {
  it("سبد خالی: پیام و لینک محصولات", () => {
    const out = html({ status: "ready", items: [] }, null, []);
    expect(out).toContain("سبد خرید شما خالی است.");
    expect(out).toContain('href="/products"');
  });
  it("آدرس‌ها در حال بارگذاری: اسکلت", () => {
    expect(html({ status: "loading" })).toContain('aria-busy="true"');
  });
  it("خطا: پیام و دکمه‌ی تلاش دوباره", () => {
    const out = html({ status: "error", message: "قطع ارتباط" });
    expect(out).toContain("قطع ارتباط");
    expect(out).toContain("تلاش دوباره");
  });
  it("بدون آدرس: لینک افزودن و راهنمای انتخاب آدرس", () => {
    const out = html({ status: "ready", items: [] });
    expect(out).toContain("هنوز آدرسی ثبت نکرده‌اید.");
    expect(out).toContain('href="/account/addresses"');
    expect(out).toContain("برای ادامه، یک آدرس انتخاب کنید.");
  });
  it("آدرس‌ها: رادیو، انتخاب‌شده checked و نشان پیش‌فرض", () => {
    const out = html({ status: "ready", items: [addr("1"), addr("2", true)] }, "2");
    expect(out).toContain('type="radio"');
    expect(out.match(/name="address"[^>]*checked=""/g)?.length).toBe(1);
    expect(out).toContain("پیش‌فرض");
    expect(out).toContain("کدپستی: ۱۲۳۴۵۶۷۸۹۰");
  });
  it("خلاصه: مبلغ و سود با ارقام فارسی و دکمه‌ی غیرفعال ثبت سفارش", () => {
    const out = html({ status: "ready", items: [addr("1")] }, "1");
    expect(out).toContain("مبلغ قابل پرداخت");
    expect(out).toContain("سود شما از تخفیف");
    expect(out).toMatch(/<button[^>]*disabled[^>]*>ثبت سفارش و پرداخت/);
    expect(out).toContain("هنوز فعال نشده است");
  });
  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    const out = html({ status: "ready", items: [addr("1")] }, "1");
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

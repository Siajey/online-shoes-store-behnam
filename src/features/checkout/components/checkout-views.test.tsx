import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { ShippingOption } from "@/features/shipping/types";
import { CheckoutView, OrderSummary, type AddressesState } from "./checkout-views";

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
const post: ShippingOption = {
  code: "post",
  name: "پست",
  description: "ارسال با پست، همراه کد رهگیری",
  available: true,
  fee: 120_000,
  isFree: false,
  days: { min: 3, max: 7 },
};
const express: ShippingOption = {
  code: "express",
  name: "پیشتاز",
  description: null,
  available: false,
  fee: 0,
  isFree: false,
  days: null,
};
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
  it("گیرنده، پرداخت آنلاین و بدون پرداخت در محل", () => {
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
    for (const s of ["علی رضایی", "پرداخت آنلاین", "قوانین و مقررات", "اطلاعات و پرداخت"])
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

describe("بخش ارسال", () => {
  const ready = (options: ShippingOption[], selectedCode: string | null) =>
    renderToStaticMarkup(
      <CheckoutView
        items={items}
        addresses={{ status: "ready", items: [addr("a", true)] }}
        selectedId="a"
        onSelect={noop}
        onRetry={noop}
        shipping={{
          state: { status: "ready", options },
          selectedCode,
          onSelect: noop,
          onRetry: noop,
        }}
      />,
    );
  it("بدون آدرس: راهنمای انتخاب آدرس و بدون رادیوی ارسال", () => {
    const out = html({ status: "ready", items: [] });
    expect(out).toContain("ابتدا یک آدرس انتخاب کنید");
    expect(out).not.toContain('name="shipping"');
  });
  it("در حال محاسبه: اسکلت", () => {
    const out = renderToStaticMarkup(
      <CheckoutView
        items={items}
        addresses={{ status: "ready", items: [addr("a", true)] }}
        selectedId="a"
        onSelect={noop}
        onRetry={noop}
        shipping={{
          state: { status: "loading" },
          selectedCode: null,
          onSelect: noop,
          onRetry: noop,
        }}
      />,
    );
    expect(out).toContain("در حال محاسبه‌ی هزینه‌ی ارسال");
  });
  it("خطا: پیام و تلاش دوباره", () => {
    const out = renderToStaticMarkup(
      <CheckoutView
        items={items}
        addresses={{ status: "ready", items: [addr("a", true)] }}
        selectedId="a"
        onSelect={noop}
        onRetry={noop}
        shipping={{
          state: { status: "error", message: "سرویس ارسال قطع است" },
          selectedCode: null,
          onSelect: noop,
          onRetry: noop,
        }}
      />,
    );
    expect(out).toContain("سرویس ارسال قطع است");
  });
  it("روش‌ها: نام، هزینه، بازه، انتخاب‌شده و ناموجود", () => {
    const out = ready([post, express], "post");
    expect(out).toContain("پست");
    expect(out).toContain("۱۲۰٬۰۰۰");
    expect(out).toContain("۳ تا ۷ روز کاری");
    expect(out).toContain("پیشتاز");
    expect(out).toContain("برای این آدرس در دسترس نیست");
    expect(out.match(/name="shipping"[^>]*checked=""/g)?.length).toBe(1);
    expect(out).toMatch(/<input[^>]*disabled=""[^>]*name="shipping"/);
  });
  it("هیچ روشی در دسترس نیست: پیام", () => {
    expect(ready([express], null)).toContain("روش ارسالی در دسترس نیست");
  });
  it("ارسال رایگان: برچسب رایگان", () => {
    const out = ready([{ ...post, fee: 0, isFree: true }], "post");
    expect(out).toContain("رایگان");
  });
  it("بدون انتخاب روش: دکمه‌ی ثبت غیرفعال و راهنما", () => {
    const out = renderToStaticMarkup(
      <OrderSummary items={items} hasAddress hasShipping={false} onPlace={noop} />,
    );
    expect(out).toMatch(/<button[^>]*disabled=""[^>]*>ثبت سفارش</);
    expect(out).toContain("یک روش ارسال انتخاب کنید");
  });
  it("خلاصه: هزینه‌ی ارسال به جمع اضافه می‌شود", () => {
    const out = renderToStaticMarkup(
      <OrderSummary items={items} hasAddress shippingFee={120_000} onPlace={noop} />,
    );
    expect(out).toContain("۱۲۰٬۰۰۰");
    expect(out).toContain("۲٬۱۲۰٬۰۰۰");
    expect(out).not.toMatch(/<button[^>]*disabled=""/);
  });
  it("خلاصه: ارسال رایگان", () => {
    const out = renderToStaticMarkup(
      <OrderSummary items={items} hasAddress shippingFee={0} onPlace={noop} />,
    );
    expect(out).toContain("رایگان");
    expect(out).toContain("۲٬۰۰۰٬۰۰۰");
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
    expect(out).toMatch(/<button[^>]*disabled[^>]*>ثبت سفارش</);
    expect(out).not.toContain("هنوز فعال نشده است");
  });
  it("تخفیف کد: ردیف تخفیف و جمع کمتر", () => {
    const out = renderToStaticMarkup(
      <OrderSummary items={items} hasAddress couponDiscount={100_000} />,
    );
    expect(out).toContain("تخفیف کد");
    expect(out).toContain("۱۰۰٬۰۰۰");
  });
  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    const out = html({ status: "ready", items: [addr("1")] }, "1");
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

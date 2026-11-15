import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CartItem } from "../types";
import { CartView } from "./cart-view";

const items: CartItem[] = [
  { id: "a", slug: "shoe-a", name: "کفش الف", price: 1_000_000, quantity: 2 },
  { id: "b", slug: "boot-b", name: "بوت ب", price: 800_000, originalPrice: 1_000_000, quantity: 1 },
];
const noop = () => {};
const html = (list: CartItem[], extra: Partial<Parameters<typeof CartView>[0]> = {}) =>
  renderToStaticMarkup(
    <CartView items={list} onQuantityChange={noop} onRemove={noop} onClear={noop} {...extra} />,
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
    expect(out).toContain("۲٬۸۰۰٬۰۰۰");
    expect(out).toContain("۲۰۰٬۰۰۰");
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

  it("ردیف هزینهٔ ارسال", () => {
    const out = html(items);
    expect(out).toContain("هزینه‌ی ارسال");
    expect(out).toContain("در مرحله‌ی بعد محاسبه می‌شود");
  });

  it("مهمان: به‌جای کادر کد، لینک ورود", () => {
    const out = html(items);
    expect(out).toContain("برای استفاده از کد تخفیف، وارد حساب خود شوید.");
    expect(out).toContain('href="/login?next=%2Fcart"');
    expect(out).not.toContain("<input");
  });

  it("کاربر واردشده بدون کد: فیلد کد و دکمه‌ی اعمال", () => {
    const out = html(items, {
      couponEnabled: true,
      coupon: { code: null, status: "none", invalidReason: null },
    });
    expect(out).toContain("کد تخفیف");
    expect(out).toContain("اعمال");
    expect(out).toMatch(/<input/);
    expect(out).not.toMatch(/<input[^>]*\sdisabled(=|\s|>)/);
  });

  it("کد اعمال‌شده: کد، ردیف تخفیف، جمع کمتر و دکمه‌ی حذف", () => {
    const out = html(items, {
      couponEnabled: true,
      coupon: { code: "SUMMER20", status: "applied", invalidReason: null },
      couponDiscount: 280_000,
    });
    expect(out).toContain("SUMMER20");
    expect(out).toContain("تخفیف کد");
    expect(out).toContain("۲٬۵۲۰٬۰۰۰");
    expect(out).toContain("حذف کد تخفیف");
    expect(out).toContain("کد SUMMER20 اعمال شد");
    expect(out).toContain('href="/checkout"');
  });

  it("بدون تخفیف کد، ردیف «تخفیف کد» نیست", () => {
    expect(html(items)).not.toContain("تخفیف کد");
  });

  it("کد نامعتبر: دلیل فارسی و ادامه‌ی خرید بسته", () => {
    const out = html(items, {
      couponEnabled: true,
      coupon: { code: "OLD", status: "invalid", invalidReason: "expired" },
    });
    expect(out).toContain("مهلت استفاده از این کد تمام شده است.");
    expect(out).toContain("کد تخفیف دیگر معتبر نیست");
    expect(out).not.toContain('href="/checkout"');
  });

  it("دلیل ناشناخته: پیام عمومی", () => {
    const out = html(items, {
      couponEnabled: true,
      coupon: { code: "X", status: "invalid", invalidReason: "newReason" },
    });
    expect(out).toContain("این کد تخفیف معتبر نیست.");
  });

  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    expect(html(items)).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

describe("CartView با سبد سرور", () => {
  const stock: CartItem = { ...items[0], maxQuantity: 2 };
  const gone: CartItem = {
    id: "p:v",
    slug: "shoe-c",
    name: "کفش ج",
    price: 0,
    quantity: 1,
    unavailable: "outOfStock",
    maxQuantity: 0,
  };

  it("به سقف موجودی رسیده: پیام و دکمه‌ی افزایش غیرفعال", () => {
    const out = html([stock]);
    expect(out).toContain("حداکثر ۲ عدد موجود است");
    expect(out).toMatch(/<button[^>]*aria-label="افزایش تعداد"[^>]*disabled=""/);
  });

  it("ردیف ناموجود: دلیل، بدون کنترل تعداد، در جمع نمی‌آید و ادامه‌ی خرید بسته است", () => {
    const out = html([items[0], gone]);
    expect(out).toContain("موجودی این کالا تمام شده است.");
    expect(out).toContain("کالاهای ناموجود را از سبد حذف کنید");
    expect(out).not.toMatch(/<a[^>]*href="\/checkout"/);
    expect(out).toContain("۲٬۰۰۰٬۰۰۰");
  });

  it("کالای حذف‌شده لینک ندارد", () => {
    const out = html([
      { ...gone, slug: "", name: "کالای حذف‌شده", unavailable: "variantUnavailable" },
    ]);
    expect(out).not.toContain('href="/products/"');
    expect(out).toContain("این کالا دیگر در فروشگاه نیست.");
  });

  it("خطا و پیام اطلاع‌رسانی نمایش داده می‌شود", () => {
    const out = html(items, { error: "موجودی کافی نیست", notice: "یک کالا اضافه نشد" });
    expect(out).toContain('role="alert"');
    expect(out).toContain("موجودی کافی نیست");
    expect(out).toContain("یک کالا اضافه نشد");
  });

  it("در حال ارسال: کنترل‌ها غیرفعال", () => {
    expect(html(items, { pending: true })).toMatch(
      /<button[^>]*aria-label="حذف «کفش الف» از سبد"[^>]*disabled=""/,
    );
  });
});

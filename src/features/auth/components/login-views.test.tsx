import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OtpStepView, PhoneStepView } from "./login-views";

const noop = () => {};

describe("PhoneStepView", () => {
  const html = (over: Partial<Parameters<typeof PhoneStepView>[0]> = {}) =>
    renderToStaticMarkup(
      <PhoneStepView value="" onChange={noop} onSubmit={noop} pending={false} {...over} />,
    );

  it("عنوان، فیلد شماره (چپ‌به‌راست، عددی) و دکمه را دارد", () => {
    const out = html();
    expect(out).toContain("ورود یا ثبت‌نام");
    expect(out).toContain('type="tel"');
    expect(out).toContain('inputMode="numeric"');
    expect(out).toContain('dir="ltr"');
    expect(out).toContain("دریافت کد تأیید");
  });
  it("خطا را با role=alert نشان می‌دهد", () => {
    const out = html({ error: "شماره معتبر نیست" });
    expect(out).toContain("شماره معتبر نیست");
    expect(out).toContain('role="alert"');
    expect(out).toContain('aria-invalid="true"');
  });
  it("در حال ارسال، فیلد و دکمه غیرفعال‌اند", () => {
    const out = html({ pending: true });
    expect(out).toContain('aria-busy="true"');
    expect(out).toMatch(/<input[^>]*disabled=""/);
  });
  it("جمله‌ی پذیرش قوانین با لینک به قوانین و حریم خصوصی", () => {
    const out = html();
    expect(out).toContain('href="/terms"');
    expect(out).toContain('href="/privacy"');
    expect(out).toContain("می‌پذیرم.");
  });
});

describe("OtpStepView", () => {
  const html = (over: Partial<Parameters<typeof OtpStepView>[0]> = {}) =>
    renderToStaticMarkup(
      <OtpStepView
        phone="09120000000"
        value=""
        onChange={noop}
        onSubmit={noop}
        onResend={noop}
        onEditPhone={noop}
        pending={false}
        secondsLeft={0}
        {...over}
      />,
    );

  it("شماره را فارسی نشان می‌دهد و فیلد کد یک‌بارمصرف است", () => {
    const out = html();
    expect(out).toContain("۰۹۱۲۰۰۰۰۰۰۰");
    expect(out).toContain('autoComplete="one-time-code"');
    expect(out).toContain("ویرایش شماره");
  });
  it("تا پایان شمارش، ارسال دوباره غیرفعال و زمان باقی‌مانده نمایش داده می‌شود", () => {
    const out = html({ secondsLeft: 65 });
    expect(out).toContain("۰۱:۰۵");
    expect(out).toMatch(/<button[^>]*disabled=""[^>]*>ارسال دوباره/);
  });
  it("بعد از پایان شمارش، ارسال دوباره فعال است", () => {
    const out = html({ secondsLeft: 0 });
    expect(out).toContain("ارسال دوباره‌ی کد");
    expect(out).not.toMatch(/<button[^>]*disabled=""[^>]*>ارسال دوباره/);
  });
});

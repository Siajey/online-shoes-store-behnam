import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ResultView } from "@/features/checkout/components/result-view";
import { ContactLines } from "./components/contact-lines";
import { DraftNote } from "./components/draft-note";
import { infoCopy } from "./copy";

describe("صفحه‌های اطلاعاتی تازه", () => {
  it("بخش‌های درباره‌ی ما، قوانین و حریم خصوصی متن و عنوان دارند", () => {
    expect(infoCopy.about.sections.length).toBeGreaterThan(0);
    for (const s of [...infoCopy.terms.sections, ...infoCopy.privacy.sections]) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.items.length).toBeGreaterThan(0);
    }
  });
  it("قوانین می‌گوید پرداخت فقط آنلاین است", () => {
    const all = infoCopy.terms.sections.flatMap((s) => s.items).join(" ");
    expect(all).toContain("فقط به‌صورت آنلاین");
  });
  it("تماس: بدون اطلاعات، پیام جایگزین", () => {
    expect(renderToStaticMarkup(<ContactLines empty="خالی" />)).toContain("خالی");
  });
  it("یادداشت پیش‌نویس نمایش داده می‌شود", () => {
    expect(renderToStaticMarkup(<DraftNote />)).toContain("پیش‌نویس");
  });
});

describe("ResultView", () => {
  it("موفق: عنوان و لینک پیگیری سفارش", () => {
    const out = renderToStaticMarkup(<ResultView kind="success" />);
    expect(out).toContain("سفارش شما ثبت شد");
    expect(out).toContain('href="/account/orders"');
    expect(out).toContain("text-ok");
  });
  it("ناموفق: عنوان، تلاش دوباره و بازگشت به سبد", () => {
    const out = renderToStaticMarkup(<ResultView kind="failed" />);
    expect(out).toContain("پرداخت انجام نشد");
    expect(out).toContain('href="/checkout"');
    expect(out).toContain('href="/cart"');
    expect(out).toContain("text-danger");
  });
  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    const out = renderToStaticMarkup(<ResultView kind="failed" />);
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

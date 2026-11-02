import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { landingCopy } from "../copy";
import { Benefits } from "./benefits";
import { Hero } from "./hero";

describe("Hero", () => {
  const out = renderToStaticMarkup(<Hero />);
  it("عنوان اصلی (h1) و دکمه‌ی محصولات را دارد", () => {
    expect(out).toContain("<h1");
    expect(out).toContain(landingCopy.heroTitle);
    expect(out).toContain('href="/products"');
  });
  it("تصویر تزئینی برای صفحه‌خوان پنهان است", () => {
    expect(out).toContain('aria-hidden="true"');
  });
});

describe("Benefits", () => {
  it("هر چهار مزیت را نشان می‌دهد", () => {
    const out = renderToStaticMarkup(<Benefits />);
    for (const item of landingCopy.benefits) expect(out).toContain(item.title);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { landingCopy } from "../copy";
import { NewsletterView } from "./newsletter-view";
import { OfferBanner } from "./offer-banner";

describe("OfferBanner", () => {
  const out = renderToStaticMarkup(<OfferBanner />);
  it("فقط در دسکتاپ دیده می‌شود و به لیست ارزان‌ترین‌ها می‌رود", () => {
    expect(out).toContain("hidden");
    expect(out).toContain("lg:block");
    expect(out).toContain('href="/products?sort=price-asc"');
    expect(out).toContain(landingCopy.offerTitle);
  });
  it("عدد تخفیف جعلی ندارد", () => {
    expect(out).not.toMatch(/٪|%/);
  });
});

describe("NewsletterView", () => {
  const base = { value: "", onChange: () => {}, onSubmit: () => {} };
  it("فیلد ایمیل با برچسب و دکمه دارد", () => {
    const out = renderToStaticMarkup(<NewsletterView {...base} />);
    expect(out).toContain(landingCopy.newsletterLabel);
    expect(out).toContain('type="email"');
    expect(out).toContain(landingCopy.newsletterCta);
  });
  it("خطا با role=alert و پیام وضعیت با role=status", () => {
    const err = renderToStaticMarkup(<NewsletterView {...base} error="بد" />);
    expect(err).toContain('role="alert"');
    expect(err).toContain('aria-invalid="true"');
    const ok = renderToStaticMarkup(<NewsletterView {...base} notice="پیام" />);
    expect(ok).toContain('role="status"');
  });
});

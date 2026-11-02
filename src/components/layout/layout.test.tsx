import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { MobileNav } from "./mobile-nav";

describe("SiteHeader", () => {
  const out = renderToStaticMarkup(<SiteHeader cartCount={3} />);
  it("نام برند و ناوبری اصلی را دارد", () => {
    expect(out).toContain(siteConfig.name);
    expect(out).toContain('aria-label="ناوبری اصلی"');
    expect(out).toContain("محصولات");
  });
  it("جستجو فرم GET با نقش search است", () => {
    expect(out).toContain('role="search"');
    expect(out).toContain('action="/products"');
    expect(out).toContain('name="q"');
  });
  it("تعداد سبد را فارسی و در برچسب دسترس‌پذیر می‌گوید", () => {
    expect(out).toContain('aria-label="سبد خرید، ۳ کالا"');
  });
  it("بدون کالا، برچسب ساده است", () => {
    expect(renderToStaticMarkup(<SiteHeader />)).toContain('aria-label="سبد خرید"');
  });
});

describe("SiteFooter", () => {
  const out = renderToStaticMarkup(<SiteFooter />);
  it("توضیح برند، گروه‌ها و حق نشر را دارد", () => {
    expect(out).toContain(siteConfig.description);
    expect(out).toContain("پشتیبانی");
    expect(out).toContain(`© ${siteConfig.copyrightYear}`);
  });
  it("وقتی اطلاعات تماس خالی است، بخش تماس نمایش داده نمی‌شود", () => {
    expect(out).not.toContain("تماس با ما");
  });
});

describe("MobileNav", () => {
  const out = renderToStaticMarkup(<MobileNav />);
  it("پنج مقصد و دکمه‌ی سبد را دارد", () => {
    expect(out).toContain('aria-label="خانه"');
    expect(out).toContain('aria-label="سبد خرید"');
    expect(out).toContain('aria-label="حساب کاربری"');
  });
  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

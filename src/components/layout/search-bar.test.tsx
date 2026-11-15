import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SearchBar } from "./search-bar";

describe("SearchBar", () => {
  it("فرم GET جستجو به /products با فیلد q", () => {
    const out = renderToStaticMarkup(<SearchBar />);
    expect(out).toContain('role="search"');
    expect(out).toContain('action="/products"');
    expect(out).toContain('name="q"');
    expect(out).toContain('type="search"');
    expect(out).toContain("جستجوی کفش");
  });
  it("برچسب دسترسی‌پذیر و دکمه‌ی ارسال برای صفحه‌خوان", () => {
    const out = renderToStaticMarkup(<SearchBar />);
    expect(out).toContain('class="sr-only">جستجو</span>');
    expect(out).toContain('type="submit"');
  });
  it("مقدار فعلی، فیلدهای پنهان و حداقل طول", () => {
    const out = renderToStaticMarkup(
      <SearchBar defaultValue="نایک" hidden={[{ name: "category", value: "men" }]} minLength={2} />,
    );
    expect(out).toContain('value="نایک"');
    expect(out).toContain('type="hidden" name="category" value="men"');
    expect(out).toContain('minLength="2"');
  });
  it("دکمه‌ی پاک کردن فقط با جستجوی فعال", () => {
    const on = renderToStaticMarkup(<SearchBar defaultValue="نایک" clearHref="/products" />);
    expect(on).toContain('aria-label="پاک کردن جستجو"');
    expect(on).toContain('href="/products"');
    expect(renderToStaticMarkup(<SearchBar clearHref="/products" />)).not.toContain("پاک کردن");
  });
});

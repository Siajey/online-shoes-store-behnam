import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductGallery } from "./product-gallery";

describe("ProductGallery", () => {
  it("بدون تصویر، تصویر جایگزین نشان داده می‌شود و تصویر کوچک ندارد", () => {
    const out = renderToStaticMarkup(<ProductGallery images={[]} name="کفش" />);
    expect(out).toContain("<svg");
    expect(out).not.toContain("aria-pressed");
  });
  it("یک تصویر: بدون ردیف تصویرهای کوچک", () => {
    const out = renderToStaticMarkup(<ProductGallery images={["https://x/a.jpg"]} name="کفش" />);
    expect(out).not.toContain("aria-pressed");
  });
  it("چند تصویر: دکمه‌ی انتخاب با اولی فعال", () => {
    const out = renderToStaticMarkup(
      <ProductGallery images={["https://x/a.jpg", "https://x/b.jpg"]} name="کفش" />,
    );
    expect(out.match(/aria-pressed/g)).toHaveLength(2);
    expect(out).toContain('aria-pressed="true"');
    expect(out).toContain("نمایش تصویر ۲");
  });
  it("۸ تصویر: همه‌ی تصویرهای کوچک، فلش‌ها و شمارنده", () => {
    const eight = Array.from({ length: 8 }, (_, i) => `https://x/${i}.jpg`);
    const out = renderToStaticMarkup(<ProductGallery images={eight} name="کفش" />);
    expect(out.match(/aria-pressed/g)).toHaveLength(8);
    expect(out).toContain('aria-label="تصویر قبلی"');
    expect(out).toContain('aria-label="تصویر بعدی"');
    expect(out).toContain("۱ / ۸");
  });
  it("سقف ۱۲ تصویر مثل بک‌اند", () => {
    const many = Array.from({ length: 15 }, (_, i) => `https://x/${i}.jpg`);
    const out = renderToStaticMarkup(<ProductGallery images={many} name="کفش" />);
    expect(out.match(/aria-pressed/g)).toHaveLength(12);
    expect(out).toContain("۱ / ۱۲");
  });
  it("یک تصویر: بدون فلش و شمارنده", () => {
    const out = renderToStaticMarkup(<ProductGallery images={["https://x/a.jpg"]} name="کفش" />);
    expect(out).not.toContain("تصویر بعدی");
    expect(out).not.toContain(" / ");
  });
});

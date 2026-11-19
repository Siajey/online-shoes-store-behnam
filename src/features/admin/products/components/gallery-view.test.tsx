import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GalleryView, type GalleryViewProps } from "./gallery-view";

const noop = () => {};
const base: GalleryViewProps = {
  images: [],
  uploading: false,
  saving: false,
  dirty: false,
  onFiles: noop,
  onMove: noop,
  onRemove: noop,
  onAlt: noop,
  onSave: noop,
};

describe("GalleryView", () => {
  it("بدون تصویر: پیام خالی، ورودی فایل با فرمت‌های مجاز و ذخیره غیرفعال", () => {
    const out = renderToStaticMarkup(<GalleryView {...base} />);
    expect(out).toContain("هنوز تصویری اضافه نشده است");
    expect(out).toContain('accept="image/jpeg,image/png,image/webp"');
    expect(out).toMatch(/<button[^>]*disabled=""[^>]*>ذخیره‌ی گالری/);
  });

  it("تصویر اول «تصویر اصلی» است و جابه‌جایی اولی/آخری غیرفعال", () => {
    const out = renderToStaticMarkup(
      <GalleryView
        {...base}
        dirty
        images={[
          { fileKey: "a", url: "https://img.test/a.webp", altText: "الف" },
          { fileKey: "b", url: "https://img.test/b.webp", altText: "" },
        ]}
      />,
    );
    expect(out.match(/>تصویر اصلی</g)).toHaveLength(1);
    expect(out).toContain("تغییرات ذخیره نشده است");
    expect(out).not.toMatch(/<button[^>]*disabled=""[^>]*>ذخیره‌ی گالری/);
    expect(out.match(/<button[^>]*disabled=""[^>]*>انتقال به قبل/g)).toHaveLength(1);
    expect(out.match(/<button[^>]*disabled=""[^>]*>انتقال به بعد/g)).toHaveLength(1);
  });

  it("با ۱۲ تصویر دکمه‌ی افزودن نیست", () => {
    const images = Array.from({ length: 12 }, (_, i) => ({ fileKey: `k${i}`, altText: "" }));
    const out = renderToStaticMarkup(<GalleryView {...base} images={images} />);
    expect(out).toContain("به سقف ۱۲ تصویر رسیده‌اید");
    expect(out).not.toContain('type="file"');
  });
});

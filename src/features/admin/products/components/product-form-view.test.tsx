import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EMPTY_FORM } from "../form";
import { ProductFormView, VariantsReadOnly, type ProductFormViewProps } from "./product-form-view";

const base: ProductFormViewProps = {
  mode: "create",
  values: EMPTY_FORM,
  errors: {},
  slugLocked: false,
  pending: false,
  categories: [{ value: "c1", label: "مردانه" }],
  brands: [{ value: "b1", label: "نایک" }],
  onChange: () => {},
  onSubmit: () => {},
};
const noop = () => {};

describe("ProductFormView", () => {
  it("کارت‌ها، فیلدها و گزینه‌ها", () => {
    const out = renderToStaticMarkup(<ProductFormView {...base} />);
    for (const text of [
      "اطلاعات اصلی",
      "انتشار",
      "سئو",
      "نام محصول",
      "slug",
      "توضیحات",
      "دسته‌بندی",
      "برند",
      "جنسیت",
      "مردانه",
      "نایک",
      "زنانه",
      "ساخت محصول",
      "انصراف",
      "بازگشت به محصولات",
    ]) {
      expect(out).toContain(text);
    }
  });

  it("محصول جدید: توضیح وضعیت می‌دهد و دکمه‌ی تغییر وضعیت ندارد", () => {
    const out = renderToStaticMarkup(<ProductFormView {...base} />);
    expect(out).toContain("به‌صورت پیش‌نویس ساخته می‌شود");
    expect(out).not.toContain("بایگانی");
  });

  it("حالت ویرایش و slug قفل‌شده", () => {
    const out = renderToStaticMarkup(<ProductFormView {...base} mode="edit" slugLocked />);
    expect(out).toContain("ذخیره‌ی محصول");
    expect(out).toContain("قابل تغییر نیست");
    expect(out).toContain("disabled");
  });

  it("ویرایش: وضعیت و دکمه‌های مجاز", () => {
    const out = renderToStaticMarkup(
      <ProductFormView
        {...base}
        mode="edit"
        publish={{ status: "draft", busy: false, onAction: noop }}
      />,
    );
    expect(out).toContain("پیش‌نویس");
    expect(out).toContain("انتشار");
    expect(out).toContain("بایگانی");
    expect(out).not.toContain("برگشت به پیش‌نویس");
  });

  it("خطای تغییر وضعیت و غیرفعال شدن دکمه‌ها هنگام انجام", () => {
    const out = renderToStaticMarkup(
      <ProductFormView
        {...base}
        mode="edit"
        publish={{ status: "published", busy: true, error: "دسته لازم است", onAction: noop }}
      />,
    );
    expect(out).toContain("دسته لازم است");
    expect(out).toContain("برگشت به پیش‌نویس");
    expect(out).toMatch(/<button[^>]*disabled=""[^>]*>برگشت به پیش‌نویس/);
  });

  it("خطاها و پیام‌ها", () => {
    const out = renderToStaticMarkup(
      <ProductFormView
        {...base}
        errors={{ name: "required", description: "tooLong" }}
        formError="خطای سرور"
        notice="ذخیره شد"
      />,
    );
    expect(out).toContain("این فیلد الزامی است.");
    expect(out).toContain("متن بیش از حد مجاز است.");
    expect(out).toContain("خطای سرور");
    expect(out).toContain("ذخیره شد");
  });

  it("کارت تنوع‌ها زیر اطلاعات اصلی قرار می‌گیرد", () => {
    const out = renderToStaticMarkup(
      <ProductFormView {...base} variants={<section>کارت تنوع</section>} />,
    );
    expect(out.indexOf("اطلاعات اصلی")).toBeLessThan(out.indexOf("کارت تنوع"));
  });

  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    const out = renderToStaticMarkup(<ProductFormView {...base} />);
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

describe("VariantsReadOnly", () => {
  it("خالی", () => {
    expect(renderToStaticMarkup(<VariantsReadOnly variants={[]} />)).toContain("هنوز تنوعی ندارد");
  });

  it("جدول رنگ، سایز، موجودی، قیمت و وضعیت", () => {
    const out = renderToStaticMarkup(
      <VariantsReadOnly
        variants={[
          {
            id: "1",
            title: "ت",
            price: 2_190_000,
            stock: 12,
            isActive: false,
            attributes: { size: "42", color: "آبی" },
          },
        ]}
      />,
    );
    for (const text of [
      "رنگ",
      "سایز",
      "موجودی",
      "قیمت (تومان)",
      "آبی",
      "۴۲",
      "۱۲",
      "۲٬۱۹۰٬۰۰۰",
      "غیرفعال",
    ]) {
      expect(out).toContain(text);
    }
  });

  it("ویژگی نداشته باشد خط تیره می‌گذارد", () => {
    const out = renderToStaticMarkup(
      <VariantsReadOnly
        variants={[{ id: "1", title: "ت", price: 1000, stock: 0, isActive: true, attributes: {} }]}
      />,
    );
    expect(out).toContain("—");
  });
});

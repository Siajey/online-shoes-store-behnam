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

describe("ProductFormView", () => {
  it("فیلدها و گزینه‌ها", () => {
    const out = renderToStaticMarkup(<ProductFormView {...base} />);
    for (const text of [
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
    ]) {
      expect(out).toContain(text);
    }
  });
  it("حالت ویرایش و slug قفل‌شده", () => {
    const out = renderToStaticMarkup(<ProductFormView {...base} mode="edit" slugLocked />);
    expect(out).toContain("ذخیره");
    expect(out).toContain("قابل تغییر نیست");
    expect(out).toContain("disabled");
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
});

describe("VariantsReadOnly", () => {
  it("خالی و پر", () => {
    expect(renderToStaticMarkup(<VariantsReadOnly variants={[]} />)).toContain(
      "هنوز واریانتی ندارد",
    );
    const out = renderToStaticMarkup(
      <VariantsReadOnly
        variants={[
          {
            id: "1",
            title: "سایز ۴۲",
            price: 1000,
            stock: 2,
            isActive: false,
            attributes: { size: "42" },
          },
        ]}
      />,
    );
    expect(out).toContain("سایز ۴۲");
    expect(out).toContain("غیرفعال");
  });
});

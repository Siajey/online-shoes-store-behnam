import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { AdminBrand, AdminCategory } from "../types";
import { BrandForm, BrandList } from "./brand-views";
import { CategoryForm, CategoryList } from "./category-views";
import { toCategoryRows } from "../tree";

const noop = () => {};
const cats: AdminCategory[] = [
  { id: "a", name: "مردانه", slug: "men", parentId: null, sortOrder: 0 },
  { id: "b", name: "اسپرت", slug: "sport", parentId: "a", sortOrder: 0 },
];
const list = {
  confirmingId: null,
  busyId: null,
  onEdit: noop,
  onAskDelete: noop,
  onConfirmDelete: noop,
  onCancel: noop,
};

describe("CategoryList", () => {
  it("خالی و پر", () => {
    expect(renderToStaticMarkup(<CategoryList {...list} rows={[]} />)).toContain("هنوز دسته‌ای");
    const out = renderToStaticMarkup(<CategoryList {...list} rows={toCategoryRows(cats)} />);
    expect(out).toContain("مردانه");
    expect(out).toContain("اسپرت");
    expect(out).toContain("ویرایش");
  });
  it("تأیید حذف دومرحله‌ای", () => {
    const out = renderToStaticMarkup(
      <CategoryList {...list} confirmingId="a" rows={toCategoryRows(cats)} />,
    );
    expect(out).toContain("این دسته حذف شود؟");
    expect(out).toContain("بله، حذف شود");
  });
});

describe("CategoryForm", () => {
  const form = {
    values: { name: "", slug: "", parentId: "", sortOrder: "" },
    errors: {},
    pending: false,
    categories: cats,
    onChange: noop,
    onSubmit: noop,
    onCancel: noop,
  };
  it("هنگام ویرایش، خود دسته و زیردسته‌هایش گزینهٔ والد نیستند", () => {
    const out = renderToStaticMarkup(<CategoryForm {...form} editingId="a" />);
    expect(out).not.toContain(">مردانه<");
    expect(out).not.toContain("اسپرت</option>");
    const add = renderToStaticMarkup(<CategoryForm {...form} editingId={null} />);
    expect(add).toContain("مردانه</option>");
    expect(add).toContain("— اسپرت</option>");
  });
  it("خطاها نمایش داده می‌شوند", () => {
    const out = renderToStaticMarkup(
      <CategoryForm
        {...form}
        editingId={null}
        errors={{ name: "required", slug: "slug" }}
        formError="خطای سرور"
      />,
    );
    expect(out).toContain("این فیلد الزامی است.");
    expect(out).toContain("فقط حرف، عدد و خط تیره");
    expect(out).toContain("خطای سرور");
  });
  it("هنگام ذخیره دکمه غیرفعال است", () => {
    expect(renderToStaticMarkup(<CategoryForm {...form} editingId={null} pending />)).toContain(
      "در حال ذخیره",
    );
  });
});

describe("Brand views", () => {
  const brands: AdminBrand[] = [{ id: "1", name: "نایک", slug: "nike", logoKey: null }];
  it("فهرست و فرم", () => {
    expect(renderToStaticMarkup(<BrandList {...list} brands={[]} />)).toContain("هنوز برندی");
    expect(renderToStaticMarkup(<BrandList {...list} brands={brands} />)).toContain("نایک");
    const out = renderToStaticMarkup(
      <BrandForm
        editingId={null}
        values={{ name: "", slug: "", logoKey: "" }}
        errors={{ logoKey: "tooLong" }}
        pending={false}
        onChange={noop}
        onSubmit={noop}
        onCancel={noop}
      />,
    );
    expect(out).toContain("کلید لوگو");
    expect(out).toContain("متن بیش از حد مجاز است.");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Select } from "./select";

const options = [
  { value: "a", label: "الف" },
  { value: "b", label: "ب" },
];

describe("Select", () => {
  it("برچسب، گزینه‌ها و گزینه‌ی خالی", () => {
    const out = renderToStaticMarkup(
      <Select
        label="استان"
        options={options}
        placeholder="انتخاب استان"
        value=""
        onChange={() => {}}
      />,
    );
    expect(out).toContain("<label");
    expect(out).toContain("استان");
    expect(out).toContain('value=""');
    expect(out).toContain("انتخاب استان</option>");
    expect(out).toContain('<option value="a">الف</option>');
  });
  it("خطا: aria-invalid و alert و بدون hint", () => {
    const out = renderToStaticMarkup(
      <Select
        label="استان"
        options={options}
        hint="راهنما"
        error="الزامی"
        value=""
        onChange={() => {}}
      />,
    );
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('role="alert"');
    expect(out).not.toContain("راهنما");
  });
  it("غیرفعال", () => {
    const out = renderToStaticMarkup(
      <Select label="استان" options={options} disabled value="a" onChange={() => {}} />,
    );
    expect(out).toContain('disabled=""');
  });
});

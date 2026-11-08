import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VariantPicker } from "./variant-picker";

const groups = [
  {
    name: "سایز",
    values: [
      { value: "۴۰", available: true },
      { value: "۴۲", available: false },
    ],
  },
];

describe("VariantPicker", () => {
  it("دکمه‌های رادیویی، انتخاب‌شده و ناموجود غیرفعال", () => {
    const out = renderToStaticMarkup(
      <VariantPicker groups={groups} selection={{ سایز: "۴۰" }} onToggle={() => {}} />,
    );
    expect(out).toContain('role="radio"');
    expect(out).toContain('aria-checked="true"');
    expect(out).toMatch(/<button[^>]*disabled=""[^>]*>۴۲/);
    expect(out).toContain("<legend");
  });
});

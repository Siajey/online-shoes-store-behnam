import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { QuantityStepper } from "./quantity-stepper";

const labels = { group: "تعداد", increase: "افزایش", decrease: "کاهش" };
const html = (value: number, max = 5) =>
  renderToStaticMarkup(
    <QuantityStepper value={value} max={max} onChange={() => {}} labels={labels} />,
  );
/** دکمه‌ای با این برچسب که ویژگی disabled="" دارد (نه فقط کلاس disabled:). */
const disabled = (out: string, label: string) =>
  new RegExp(`<button[^>]*aria-label="${label}"[^>]*disabled=""`).test(out);

describe("QuantityStepper", () => {
  it("عدد را فارسی نشان می‌دهد", () => {
    expect(html(3)).toContain("۳");
  });
  it("در حداقل، کاهش غیرفعال است", () => {
    const out = html(1);
    expect(disabled(out, "کاهش")).toBe(true);
    expect(disabled(out, "افزایش")).toBe(false);
  });
  it("در حداکثر، افزایش غیرفعال است", () => {
    const out = html(5);
    expect(disabled(out, "افزایش")).toBe(true);
    expect(disabled(out, "کاهش")).toBe(false);
  });
  it("برچسب‌ها از بیرون می‌آیند", () => {
    expect(html(2)).toContain('aria-label="تعداد"');
  });
});

import { describe, expect, it } from "vitest";
import { EU_SIZES, footLengthCm, sizeChart } from "./size-chart";

describe("size chart", () => {
  it("مقدارهای مرجع", () => {
    expect(footLengthCm(36)).toBe(22.5);
    expect(footLengthCm(40)).toBe(25.2);
    expect(footLengthCm(46)).toBe(29.2);
  });
  it("هر ردیف به ازای یک سایز و طول پا صعودی است", () => {
    expect(sizeChart).toHaveLength(EU_SIZES.length);
    for (let i = 1; i < sizeChart.length; i++) {
      expect(sizeChart[i].footCm).toBeGreaterThan(sizeChart[i - 1].footCm);
    }
  });
  it("اختلاف دو سایز پشت‌سرهم حدود ۰٫۷ سانتی‌متر است", () => {
    const diff = sizeChart[1].footCm - sizeChart[0].footCm;
    expect(diff).toBeGreaterThan(0.5);
    expect(diff < 0.9).toBe(true);
  });
});

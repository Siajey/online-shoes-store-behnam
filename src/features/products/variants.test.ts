import { describe, expect, it } from "vitest";
import type { ProductVariant } from "./types";
import {
  findVariant,
  missingGroups,
  optionGroups,
  toggleSelection,
  variantLabel,
} from "./variants";

const v = (id: string, size: string, color: string, available = true): ProductVariant => ({
  id,
  price: 1000,
  available,
  options: { سایز: size, رنگ: color },
});
const variants = [
  v("1", "۴۴", "مشکی"),
  v("2", "۴۰", "مشکی"),
  v("3", "۴۰", "سفید", false),
  v("4", "۴۲", "سفید"),
];

describe("variants", () => {
  it("گروه‌ها: سایز عددی مرتب، رنگ به ترتیب ظهور", () => {
    const g = optionGroups(variants, {});
    expect(g.map((x) => x.name)).toEqual(["سایز", "رنگ"]);
    expect(g[0].values.map((x) => x.value)).toEqual(["۴۰", "۴۲", "۴۴"]);
    expect(g[1].values.map((x) => x.value)).toEqual(["مشکی", "سفید"]);
  });
  it("موجودی بر اساس انتخاب فعلی", () => {
    const g = optionGroups(variants, { رنگ: "سفید" });
    const size = Object.fromEntries(g[0].values.map((x) => [x.value, x.available]));
    expect(size).toEqual({ "۴۰": false, "۴۲": true, "۴۴": false });
  });
  it("findVariant فقط با انتخاب کامل", () => {
    expect(findVariant(variants, { سایز: "۴۰" })).toBeUndefined();
    expect(findVariant(variants, { سایز: "۴۰", رنگ: "مشکی" })?.id).toBe("2");
    expect(missingGroups(variants, { سایز: "۴۰" })).toEqual(["رنگ"]);
  });
  it("toggle: لغو با کلیک دوباره و حذف انتخاب ناسازگار", () => {
    expect(toggleSelection(variants, { سایز: "۴۰" }, "سایز", "۴۰")).toEqual({});
    expect(toggleSelection(variants, { رنگ: "سفید" }, "سایز", "۴۴")).toEqual({ سایز: "۴۴" });
    expect(toggleSelection(variants, { سایز: "۴۲" }, "رنگ", "سفید")).toEqual({
      سایز: "۴۲",
      رنگ: "سفید",
    });
  });
  it("برچسب", () => {
    expect(variantLabel(variants[1])).toBe("سایز ۴۰، رنگ مشکی");
  });
  it("بدون variant: گروهی نیست", () => {
    expect(optionGroups([], {})).toEqual([]);
    expect(findVariant([], {})).toBeUndefined();
  });
});

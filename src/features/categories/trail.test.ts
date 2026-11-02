import { describe, expect, it } from "vitest";
import type { ApiSuccess } from "@/lib/api/types";
import type { CategoryDto } from "./dto";
import sample from "./__fixtures__/categories.json";
import { toCategory } from "./mappers";
import { findCategoryTrail } from "./trail";

const categories = (sample as unknown as ApiSuccess<CategoryDto[]>).data.map(toCategory);

describe("findCategoryTrail (روی نمونه‌ی واقعی بک‌اند)", () => {
  it("بدون slug چیزی نمی‌دهد", () => {
    expect(findCategoryTrail(categories)).toEqual({});
  });
  it("دسته‌ی اصلی: parent و active یکی‌اند", () => {
    const t = findCategoryTrail(categories, "mens-shoes");
    expect(t.parent?.slug).toBe("mens-shoes");
    expect(t.active?.slug).toBe("mens-shoes");
  });
  it("زیردسته: parent دسته‌ی اصلی است", () => {
    const t = findCategoryTrail(categories, "mens-formal-shoes");
    expect(t.parent?.slug).toBe("mens-shoes");
    expect(t.active?.name).toBe("کفش رسمی مردانه");
  });
  it("slug ناشناخته چیزی نمی‌دهد", () => {
    expect(findCategoryTrail(categories, "nope")).toEqual({});
  });
});

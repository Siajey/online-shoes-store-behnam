import { describe, expect, it } from "vitest";
import type { ApiSuccess } from "@/lib/api/types";
import type { CategoryDto } from "./dto";
import sample from "./__fixtures__/categories.json";
import { toCategory } from "./mappers";

/** نمونه‌ی واقعی پاسخ GET /categories که بک‌اند داده است. */
const dtos = (sample as unknown as ApiSuccess<CategoryDto[]>).data;

describe("toCategory (روی نمونه‌ی واقعی بک‌اند)", () => {
  const categories = dtos.map(toCategory);

  it("چهار دسته‌ی اصلی", () => {
    expect(categories.map((c) => c.slug)).toEqual([
      "mens-shoes",
      "womens-shoes",
      "kids-shoes",
      "accessories",
    ]);
  });

  it("زیردسته‌ها در children می‌آیند", () => {
    expect(categories[0].children.map((c) => c.name)).toEqual([
      "کفش اسپرت مردانه",
      "کفش رسمی مردانه",
      "صندل مردانه",
    ]);
    expect(categories[2].children).toEqual([]);
  });

  it("زیردسته children ندارد ولی خطا نمی‌دهد", () => {
    expect(categories[0].children[0].children).toEqual([]);
  });

  it("تصویر خالی به undefined تبدیل می‌شود", () => {
    expect(toCategory({ ...dtos[2], image: null }).imageUrl).toBeUndefined();
    expect(categories[0].imageUrl).toContain("mens-shoes");
  });
});

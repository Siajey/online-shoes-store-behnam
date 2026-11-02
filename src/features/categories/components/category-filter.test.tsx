import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Category } from "../types";
import { CategoryFilter } from "./category-filter";

const men: Category = {
  id: "m",
  name: "کفش مردانه",
  slug: "mens-shoes",
  children: [{ id: "ms", name: "کفش اسپرت مردانه", slug: "mens-sports-shoes", children: [] }],
};
const women: Category = { id: "w", name: "کفش زنانه", slug: "womens-shoes", children: [] };

describe("CategoryFilter", () => {
  it("بدون انتخاب: «همه» فعال است و زیردسته نمی‌آید", () => {
    const out = renderToStaticMarkup(<CategoryFilter categories={[men, women]} trail={{}} />);
    expect(out).toContain('href="/products"');
    expect(out).toContain("کفش مردانه");
    expect(out).not.toContain("زیردسته‌ها");
    expect((out.match(/aria-current="true"/g) ?? []).length).toBe(1);
  });
  it("با انتخاب دسته‌ی دارای زیردسته، ردیف زیردسته‌ها می‌آید", () => {
    const out = renderToStaticMarkup(
      <CategoryFilter categories={[men, women]} trail={{ parent: men, active: men }} />,
    );
    expect(out).toContain("زیردسته‌ها");
    expect(out).toContain("همه‌ی کفش مردانه");
    expect(out).toContain('href="/products?category=mens-sports-shoes"');
  });
  it("دسته‌ی بدون زیردسته، ردیف دوم ندارد", () => {
    const out = renderToStaticMarkup(
      <CategoryFilter categories={[men, women]} trail={{ parent: women, active: women }} />,
    );
    expect(out).not.toContain("زیردسته‌ها");
  });
});

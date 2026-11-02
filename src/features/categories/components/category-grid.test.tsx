import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Category } from "../types";
import { CategoryGrid } from "./category-grid";

const categories: Category[] = [
  {
    id: "1",
    name: "کفش مردانه",
    slug: "mens-shoes",
    imageUrl: "https://cdn.test/a.webp",
    children: [],
  },
  { id: "2", name: "اکسسوری", slug: "accessories", children: [] },
];

describe("CategoryGrid", () => {
  const out = renderToStaticMarkup(<CategoryGrid categories={categories} />);
  it("نام و لینک هر دسته را دارد", () => {
    expect(out).toContain("کفش مردانه");
    expect(out).toContain("اکسسوری");
    expect(out).toContain('href="/products?category=mens-shoes"');
  });
  it("دسته‌ی بدون تصویر، تصویر کفش جایگزین نشان می‌دهد", () => {
    expect(out).toContain("<svg");
  });
});

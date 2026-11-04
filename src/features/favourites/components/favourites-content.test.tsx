import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Product } from "@/features/products/types";
import { FavouritesContent, FavouritesView } from "./favourites-content";

const items: Product[] = [
  { id: "a", slug: "shoe-a", name: "کفش الف", price: 1_000_000, available: true },
];

describe("FavouritesView", () => {
  it("خالی: پیام و لینک به محصولات", () => {
    const out = renderToStaticMarkup(<FavouritesView items={[]} />);
    expect(out).toContain("هنوز کالایی را به علاقه‌مندی‌ها اضافه نکرده‌اید.");
    expect(out).toContain('href="/products"');
  });
  it("کالاها را با لینک صفحه‌ی محصول و توضیح ذخیره‌ی محلی نشان می‌دهد", () => {
    const out = renderToStaticMarkup(<FavouritesView items={items} />);
    expect(out).toContain("کفش الف");
    expect(out).toContain('href="/products/shoe-a"');
    expect(out).toContain("فقط در همین مرورگر ذخیره می‌شود");
  });
});

describe("FavouritesContent", () => {
  it("روی سرور اسکلت نشان می‌دهد، نه «خالی»", () => {
    const out = renderToStaticMarkup(<FavouritesContent />);
    expect(out).toContain("در حال بارگذاری علاقه‌مندی‌ها");
    expect(out).not.toContain("هنوز کالایی");
  });
});

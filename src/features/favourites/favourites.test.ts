import { describe, expect, it } from "vitest";
import type { Product } from "@/features/products/types";
import {
  MAX_FAVOURITES,
  isFavourite,
  parseStoredFavourites,
  serializeFavourites,
  toggleFavourite,
} from "./favourites";

const make = (id: string, over: Partial<Product> = {}): Product => ({
  id,
  slug: `shoe-${id}`,
  name: `کفش ${id}`,
  price: 1_000_000,
  available: true,
  ...over,
});

describe("toggleFavourite", () => {
  it("محصول جدید را به ابتدای لیست اضافه می‌کند", () => {
    const out = toggleFavourite([make("a")], make("b"));
    expect(out.map((p) => p.id)).toEqual(["b", "a"]);
  });
  it("محصول موجود را حذف می‌کند", () => {
    expect(toggleFavourite([make("a"), make("b")], make("a")).map((p) => p.id)).toEqual(["b"]);
  });
  it("با رسیدن به سقف، قدیمی‌ترین کنار گذاشته می‌شود", () => {
    const full = Array.from({ length: MAX_FAVOURITES }, (_, i) => make(`p${i}`));
    const out = toggleFavourite(full, make("new"));
    expect(out).toHaveLength(MAX_FAVOURITES);
    expect(out[0].id).toBe("new");
    expect(isFavourite(out, `p${MAX_FAVOURITES - 1}`)).toBe(false);
  });
  it("آرایه‌ی ورودی را تغییر نمی‌دهد", () => {
    const items = [make("a")];
    toggleFavourite(items, make("b"));
    expect(items).toHaveLength(1);
  });
});

describe("parseStoredFavourites", () => {
  it("رفت‌وبرگشت سالم است", () => {
    const items = [make("a", { originalPrice: 2_000_000, discountLabel: "۵۰٪ تخفیف" }), make("b")];
    expect(parseStoredFavourites(serializeFavourites(items))).toEqual(items);
  });
  it.each([null, "", "{", "[]", '{"v":9,"items":[]}', '{"v":1,"items":"x"}'])(
    "ورودی خراب %s خالی می‌شود",
    (raw) => {
      expect(parseStoredFavourites(raw)).toEqual([]);
    },
  );
  it("ردیف نامعتبر، تکراری و تصویر ناامن را کنار می‌گذارد", () => {
    const raw = JSON.stringify({
      v: 1,
      items: [
        make("a"),
        make("a"),
        { ...make("b"), price: 1.5 },
        { ...make("c"), imageUrl: "javascript:alert(1)" },
        { ...make("d"), available: "yes" },
        null,
      ],
    });
    expect(parseStoredFavourites(raw).map((p) => p.id)).toEqual(["a"]);
  });
});

import { describe, expect, it } from "vitest";
import { mergeProducts } from "./merge";
import type { Product } from "./types";

const p = (id: string): Product => ({ id, slug: id, name: id, price: 1, available: true });

describe("mergeProducts", () => {
  it("به ترتیب اضافه می‌کند", () => {
    expect(mergeProducts([p("1")], [p("2"), p("3")]).map((x) => x.id)).toEqual(["1", "2", "3"]);
  });
  it("تکراری را نمی‌گذارد", () => {
    expect(mergeProducts([p("1"), p("2")], [p("2"), p("3")]).map((x) => x.id)).toEqual([
      "1",
      "2",
      "3",
    ]);
  });
  it("با ورودی خالی امن است", () => {
    expect(mergeProducts([], [])).toEqual([]);
  });
});

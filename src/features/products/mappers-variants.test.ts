import { describe, expect, it } from "vitest";
import type { ApiSuccess } from "@/lib/api/types";
import type { ProductDto } from "./dto";
import sample from "./__fixtures__/products.json";
import { toProduct } from "./mappers";

const base = (sample as unknown as ApiSuccess<ProductDto[]>).data[0];

describe("toProduct با variant", () => {
  it("بدون variants: undefined", () => {
    expect(toProduct(base).variants).toBeUndefined();
  });
  it("variant: گزینه‌ها و موجودی از stock و isActive", () => {
    const p = toProduct({
      ...base,
      variants: [
        {
          id: "v1",
          sku: "S-40",
          price: 900000,
          stock: 3,
          isActive: true,
          attributes: [{ name: "سایز", value: "۴۰" }],
        },
        {
          id: "v2",
          sku: null,
          price: 900000,
          stock: 0,
          isActive: true,
          attributes: [{ name: "سایز", value: "۴۲" }],
        },
        { id: "v3", price: 900000, stock: 5, isActive: false, attributes: [] },
      ],
    });
    expect(p.variants?.map((v) => v.available)).toEqual([true, false, false]);
    expect(p.variants?.[0].options).toEqual({ سایز: "۴۰" });
    expect(p.variants?.[1].sku).toBeUndefined();
  });
});

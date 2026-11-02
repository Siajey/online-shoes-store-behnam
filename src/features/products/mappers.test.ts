import { describe, expect, it } from "vitest";
import { toProduct } from "./mappers";

describe("toProduct", () => {
  it("فیلدهای اجباری را نگه می‌دارد", () => {
    expect(toProduct({ id: "1", name: "کتانی", price: 100 })).toEqual({
      id: "1",
      name: "کتانی",
      price: 100,
      tag: undefined,
      imageUrl: undefined,
    });
  });
  it("null در API را به undefined تبدیل می‌کند", () => {
    const p = toProduct({ id: "1", name: "a", price: 1, badge: null, imageUrl: null });
    expect(p.tag).toBeUndefined();
    expect(p.imageUrl).toBeUndefined();
  });
  it("badge به tag تبدیل می‌شود", () => {
    expect(toProduct({ id: "1", name: "a", price: 1, badge: "پرفروش" }).tag).toBe("پرفروش");
  });
});

import { describe, expect, it } from "vitest";
import { addItem, parseStoredCart, serializeCart, toCartItem } from "./cart";

const product = { id: "p1", slug: "s", name: "کفش", price: 1000 };
const variant = (id: string, label: string) => ({ id, label, price: 900 });

describe("سبد با سایز/رنگ", () => {
  it("هر ترکیب ردیف جداست و قیمت ترکیب می‌نشیند", () => {
    let items = addItem([], toCartItem(product, variant("a", "سایز ۴۰")), 1);
    items = addItem(items, toCartItem(product, variant("b", "سایز ۴۲")), 1);
    expect(items.length).toBe(2);
    expect(items[0]).toMatchObject({ id: "p1:a", productId: "p1", variantId: "a", price: 900 });
  });
  it("یک ترکیب دوباره: تعداد زیاد می‌شود", () => {
    let items = addItem([], toCartItem(product, variant("a", "x")), 1);
    items = addItem(items, toCartItem(product, variant("a", "x")), 2);
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(3);
  });
  it("ذخیره و خواندن ردیف دارای ترکیب", () => {
    const items = addItem([], toCartItem(product, variant("a", "سایز ۴۰")), 1);
    expect(parseStoredCart(serializeCart(items))[0]).toMatchObject({ variantLabel: "سایز ۴۰" });
  });
  it("بدون ترکیب مثل قبل", () => {
    expect(toCartItem(product)).toEqual({
      id: "p1",
      slug: "s",
      name: "کفش",
      price: 1000,
      originalPrice: undefined,
      imageUrl: undefined,
    });
  });
});

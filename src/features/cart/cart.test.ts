import { describe, expect, it } from "vitest";
import {
  MAX_QUANTITY,
  addItem,
  cartCount,
  cartSavings,
  cartTotal,
  parseStoredCart,
  removeItem,
  serializeCart,
  setQuantity,
} from "./cart";
import type { CartItem } from "./types";

const shoe = { id: "a", slug: "shoe-a", name: "کفش الف", price: 1_000_000 };
const boot = { id: "b", slug: "boot-b", name: "بوت ب", price: 800_000, originalPrice: 1_000_000 };
const item = (over: Partial<CartItem> = {}): CartItem => ({ ...shoe, quantity: 1, ...over });

describe("addItem", () => {
  it("کالای جدید را با تعداد خواسته‌شده اضافه می‌کند", () => {
    expect(addItem([], shoe, 2)).toEqual([item({ quantity: 2 })]);
  });
  it("کالای تکراری را ادغام می‌کند و قیمت را تازه می‌کند", () => {
    const out = addItem([item()], { ...shoe, price: 900_000 }, 2);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ quantity: 3, price: 900_000 });
  });
  it("از سقف تعداد رد نمی‌شود", () => {
    const out = addItem([item({ quantity: 9 })], shoe, 5);
    expect(out[0].quantity).toBe(MAX_QUANTITY);
  });
  it("وقتی چیزی تغییر نمی‌کند همان آرایه را برمی‌گرداند", () => {
    const items = [item({ quantity: MAX_QUANTITY })];
    expect(addItem(items, shoe)).toBe(items);
    expect(addItem(items, shoe, 0)).toBe(items);
  });
  it("آرایه‌ی ورودی را تغییر نمی‌دهد", () => {
    const items = [item()];
    addItem(items, shoe);
    expect(items[0].quantity).toBe(1);
  });
});

describe("setQuantity و removeItem", () => {
  it("تعداد را تنظیم و محدود می‌کند", () => {
    expect(setQuantity([item()], "a", 4)[0].quantity).toBe(4);
    expect(setQuantity([item()], "a", 99)[0].quantity).toBe(MAX_QUANTITY);
  });
  it("صفر یا منفی یعنی حذف", () => {
    expect(setQuantity([item()], "a", 0)).toEqual([]);
    expect(setQuantity([item()], "a", -3)).toEqual([]);
  });
  it("شناسه‌ی ناشناس چیزی را عوض نمی‌کند", () => {
    const items = [item()];
    expect(setQuantity(items, "zzz", 3)).toBe(items);
    expect(removeItem(items, "zzz")).toBe(items);
  });
  it("حذف فقط همان ردیف را برمی‌دارد", () => {
    expect(removeItem([item(), item({ id: "b" })], "a").map((i) => i.id)).toEqual(["b"]);
  });
});

describe("جمع‌ها", () => {
  const items = [item({ quantity: 2 }), { ...boot, quantity: 3 }];
  it("تعداد کل، مجموع و سود تخفیف", () => {
    expect(cartCount(items)).toBe(5);
    expect(cartTotal(items)).toBe(2 * 1_000_000 + 3 * 800_000);
    expect(cartSavings(items)).toBe(3 * 200_000);
  });
  it("سبد خالی صفر است", () => {
    expect(cartCount([])).toBe(0);
    expect(cartTotal([])).toBe(0);
    expect(cartSavings([])).toBe(0);
  });
});

describe("parseStoredCart", () => {
  it("رفت‌وبرگشت سالم است", () => {
    const items = [item({ quantity: 2 }), { ...boot, quantity: 1 }];
    expect(parseStoredCart(serializeCart(items))).toEqual(items);
  });
  it.each([null, "", "{", "[]", "null", '{"v":2,"items":[]}', '{"v":1,"items":5}'])(
    "ورودی خراب %s خالی می‌شود",
    (raw) => {
      expect(parseStoredCart(raw)).toEqual([]);
    },
  );
  it("ردیف‌های نامعتبر و تکراری را کنار می‌گذارد", () => {
    const raw = JSON.stringify({
      v: 1,
      items: [
        item(),
        item({ quantity: 5 }),
        { ...item({ id: "x" }), quantity: 0 },
        { ...item({ id: "y" }), price: -1 },
        { ...item({ id: "z" }), imageUrl: "javascript:alert(1)" },
        "text",
      ],
    });
    expect(parseStoredCart(raw).map((i) => i.id)).toEqual(["a"]);
  });
});

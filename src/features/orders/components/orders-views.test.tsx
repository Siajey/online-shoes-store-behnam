import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OrdersSoonView } from "./orders-views";

describe("OrdersSoonView", () => {
  it("پیام صادقانه و لینک محصولات، بدون داده‌ی ساختگی", () => {
    const out = renderToStaticMarkup(<OrdersSoonView />);
    expect(out).toContain("به‌زودی فعال می‌شود");
    expect(out).toContain('href="/products"');
  });
});

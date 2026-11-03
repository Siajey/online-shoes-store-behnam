import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CartLinkView } from "./cart-link";

const html = (count: number) =>
  renderToStaticMarkup(
    <CartLinkView count={count} className="x">
      <i />
    </CartLinkView>,
  );

describe("CartLinkView", () => {
  it("بدون کالا، برچسب ساده و بدون شمارنده", () => {
    const out = html(0);
    expect(out).toContain('aria-label="سبد خرید"');
    expect(out).not.toContain("aria-hidden");
  });
  it("تعداد را فارسی در برچسب و شمارنده می‌گوید", () => {
    const out = html(3);
    expect(out).toContain('aria-label="سبد خرید، ۳ کالا"');
    expect(out).toContain(">۳<");
  });
  it("بیشتر از ۹۹ را «۹۹+» نشان می‌دهد", () => {
    expect(html(120)).toContain(">۹۹+<");
  });
  it("به /cart لینک می‌دهد", () => {
    expect(html(1)).toContain('href="/cart"');
  });
});

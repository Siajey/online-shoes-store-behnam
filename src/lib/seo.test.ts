import { describe, expect, it } from "vitest";
import { DISALLOWED_PATHS, absoluteUrl, buildRobots, buildSitemap } from "./seo";

describe("seo", () => {
  it("آدرس مطلق: اسلش آخر پایه حذف می‌شود و صفحه‌ی اصلی بدون اسلش اضافه است", () => {
    expect(absoluteUrl("https://x.ir/", "/faq")).toBe("https://x.ir/faq");
    expect(absoluteUrl("https://x.ir/", "/")).toBe("https://x.ir");
  });
  it("sitemap فقط صفحه‌های عمومی را دارد", () => {
    const urls = buildSitemap("https://x.ir").map((e) => e.url);
    expect(urls).toContain("https://x.ir");
    expect(urls).toContain("https://x.ir/products");
    for (const p of DISALLOWED_PATHS) expect(urls.some((u) => u.endsWith(p))).toBe(false);
  });
  it("robots مسیرهای خصوصی را می‌بندد و به sitemap اشاره می‌کند", () => {
    const r = buildRobots("https://x.ir");
    for (const d of ["/account", "/checkout", "/cart"]) expect(r.rules[0].disallow).toContain(d);
    expect(r.sitemap).toBe("https://x.ir/sitemap.xml");
  });
});

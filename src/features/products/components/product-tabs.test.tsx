import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductTabs } from "./product-tabs";

describe("ProductTabs", () => {
  const out = renderToStaticMarkup(
    <ProductTabs
      product={{ id: "p1", name: "کفش", slug: "kafsh" }}
      specs={<p>محتوای مشخصات</p>}
      description={<p>محتوای توضیحات</p>}
    />,
  );
  it("سه تب با نقش درست و اولی فعال", () => {
    expect(out.match(/role="tab"/g)).toHaveLength(3);
    expect(out).toContain('id="tab-specs" aria-selected="true"');
    expect(out).toContain("مشخصات");
    expect(out).toContain("توضیحات");
    expect(out).toContain("نظرات");
  });
  it("هر سه پنل در HTML هست و فقط اولی پنهان نیست", () => {
    expect(out).toContain("محتوای مشخصات");
    expect(out).toContain("محتوای توضیحات");
    expect(out.match(/hidden=""/g)).toHaveLength(2);
  });
  it("لنگر #reviews برای لینک امتیاز", () => {
    expect(out).toContain('id="reviews"');
  });
});

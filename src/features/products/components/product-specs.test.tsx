import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductSpecs } from "./product-specs";

describe("ProductSpecs", () => {
  it("ردیف‌های برچسب و مقدار", () => {
    const out = renderToStaticMarkup(
      <ProductSpecs
        specs={[
          { label: "جنس", value: "چرم" },
          { label: "جنسیت", value: "مردانه" },
        ]}
      />,
    );
    expect(out).toContain("<dl");
    expect(out).toContain("چرم");
    expect(out).toContain("مردانه");
  });
  it("بدون مشخصات پیام خالی", () => {
    expect(renderToStaticMarkup(<ProductSpecs specs={undefined} />)).toContain("ثبت نشده");
    expect(renderToStaticMarkup(<ProductSpecs specs={[]} />)).toContain("ثبت نشده");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./breadcrumb";

describe("Breadcrumb", () => {
  const out = renderToStaticMarkup(
    <Breadcrumb
      label="مسیر صفحه"
      items={[
        { label: "خانه", href: "/" },
        { label: "محصولات", href: "/products" },
        { label: "کتانی" },
      ]}
    />,
  );
  it("برچسب دسترس‌پذیر دارد", () => {
    expect(out).toContain('aria-label="مسیر صفحه"');
  });
  it("لینک‌ها و صفحه‌ی فعلی را درست نشان می‌دهد", () => {
    expect(out).toContain('href="/products"');
    expect(out).toContain('aria-current="page"');
    expect(out.match(/aria-current="page"/g)).toHaveLength(1);
  });
});

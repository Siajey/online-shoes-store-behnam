import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Product } from "../types";
import { ProductDetail } from "./product-detail";

const base: Product = {
  id: "1",
  slug: "nike-air-max-90",
  name: "کتونی نایک ایرمکس ۹۰",
  sku: "NK-AM90-001",
  price: 3_600_000,
  originalPrice: 4_500_000,
  discountLabel: "۲۰٪ تخفیف",
  tag: "پرفروش",
  available: true,
  categoryName: "کفش اسپرت مردانه",
  categorySlug: "mens-sports-shoes",
};

describe("ProductDetail", () => {
  const out = renderToStaticMarkup(<ProductDetail product={base} />);

  it("عنوان h1 و کد کالا", () => {
    expect(out).toContain("<h1");
    expect(out).toContain("کتونی نایک ایرمکس ۹۰");
    expect(out).toContain("NK-AM90-001");
  });
  it("قیمت نهایی، قیمت قبلی و متن تخفیف", () => {
    expect(out).toContain("۳٬۶۰۰٬۰۰۰");
    expect(out).toContain("۴٬۵۰۰٬۰۰۰");
    expect(out).toContain("۲۰٪ تخفیف");
  });
  it("مسیر صفحه شامل دسته با لینک فیلتر است", () => {
    expect(out).toContain('href="/products?category=mens-sports-shoes"');
    expect(out).toContain("موجود در انبار");
  });
  it("ناموجود را نشان می‌دهد", () => {
    expect(
      renderToStaticMarkup(<ProductDetail product={{ ...base, available: false }} />),
    ).toContain("ناموجود");
  });
  it("بدون دسته و تخفیف، بخش‌های آن‌ها نمی‌آید", () => {
    const bare = renderToStaticMarkup(
      <ProductDetail
        product={{ id: "2", slug: "x", name: "ساده", price: 1_000_000, available: true }}
      />,
    );
    expect(bare).not.toContain("line-through");
    expect(bare).not.toContain("category=");
  });
});

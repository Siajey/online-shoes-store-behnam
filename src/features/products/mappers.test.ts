import { describe, expect, it } from "vitest";
import type { ApiSuccess } from "@/lib/api/types";
import type { ProductDto } from "./dto";
import sample from "./__fixtures__/products.json";
import { toProduct } from "./mappers";

/** نمونه‌ی واقعی پاسخ GET /products که بک‌اند داده است. */
const dtos = (sample as unknown as ApiSuccess<ProductDto[]>).data;

describe("toProduct (روی نمونه‌ی واقعی بک‌اند)", () => {
  const products = dtos.map(toProduct);

  it("هر شش محصول بدون خطا تبدیل می‌شود", () => {
    expect(products).toHaveLength(6);
  });

  it("محصول تخفیف‌دار: قیمت نهایی، قیمت قبلی و متن تخفیف", () => {
    const p = products[0];
    expect(p.name).toBe("کتونی نایک ایرمکس ۹۰");
    expect(p.slug).toBe("nike-air-max-90");
    expect(p.price).toBe(3_600_000);
    expect(p.originalPrice).toBe(4_500_000);
    expect(p.discountLabel).toBe("۲۰٪ تخفیف");
  });

  it("محصول بدون تخفیف: قیمت قبلی و متن تخفیف ندارد", () => {
    const p = products[1];
    expect(p.price).toBe(5_200_000);
    expect(p.originalPrice).toBeUndefined();
    expect(p.discountLabel).toBeUndefined();
  });

  it("اولین برچسب به tag تبدیل می‌شود", () => {
    expect(products[0].tag).toBe("پرفروش");
    expect(products[3].tag).toBe("پربازدید");
  });

  it("ناموجود بودن را حفظ می‌کند", () => {
    expect(products[0].available).toBe(true);
    expect(products[5].available).toBe(false);
  });

  it("تصویر و نام دسته را نگه می‌دارد", () => {
    expect(products[0].imageUrl).toContain("unsplash.com");
    expect(products[2].categoryName).toBe("کفش رسمی مردانه");
  });

  it("اگر واحد ریال باشد، به تومان تبدیل می‌شود", () => {
    const base = dtos[0];
    const rial = toProduct({
      ...base,
      pricing: {
        ...base.pricing,
        currency: "RIAL",
        finalPrice: 36_000_000,
        originalPrice: 45_000_000,
      },
    });
    expect(rial.price).toBe(3_600_000);
    expect(rial.originalPrice).toBe(4_500_000);
  });

  it("thumbnail و badges خالی امن‌اند", () => {
    const p = toProduct({ ...dtos[1], thumbnail: null, badges: [], category: null });
    expect(p.imageUrl).toBeUndefined();
    expect(p.tag).toBeUndefined();
    expect(p.categoryName).toBeUndefined();
  });
});

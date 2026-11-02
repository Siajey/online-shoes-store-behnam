import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/lib/api/errors";
import { api } from "@/lib/api";
import { fetchProduct } from "./api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

const dto = {
  id: "1",
  name: "کتونی",
  slug: "nike-air-max-90",
  sku: "X-1",
  thumbnail: null,
  pricing: {
    originalPrice: 100,
    discountAmount: 0,
    finalPrice: 100,
    currency: "TOMAN",
    discount: null,
  },
  isAvailable: true,
  badges: [],
  category: null,
};

describe("fetchProduct", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
  });

  it("محصول را می‌گیرد و تبدیل می‌کند", async () => {
    vi.mocked(api.get).mockResolvedValue({
      message: "",
      code: "",
      timestamp: "",
      path: "",
      data: dto,
    });
    const product = await fetchProduct("nike-air-max-90");
    expect(product?.name).toBe("کتونی");
    expect(vi.mocked(api.get).mock.calls[0][0]).toBe("/products/nike-air-max-90");
  });

  it("۴۰۴ را به null تبدیل می‌کند", async () => {
    vi.mocked(api.get).mockRejectedValue(
      new ApiRequestError({ status: 404, code: "NOT_FOUND", message: "نیست" }),
    );
    expect(await fetchProduct("x")).toBeNull();
  });

  it("خطاهای دیگر را دوباره پرتاب می‌کند", async () => {
    vi.mocked(api.get).mockRejectedValue(
      new ApiRequestError({ status: 500, code: "X", message: "m" }),
    );
    await expect(fetchProduct("x")).rejects.toMatchObject({ status: 500 });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/lib/api/errors";
import { api } from "@/lib/api";
import { fetchCategories } from "@/features/categories/api";
import { fetchProduct, fetchProducts } from "./api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));
vi.mock("@/features/categories/api", () => ({ fetchCategories: vi.fn() }));

const CAT = {
  id: "c1",
  name: "کفش مردانه",
  slug: "mens-shoes",
  children: [{ id: "c2", name: "اسپرت", slug: "sports", children: [] }],
};
const withCategories = () => vi.mocked(fetchCategories).mockResolvedValue([CAT]);
const ok = (data: unknown) => ({ message: "", code: "", timestamp: "", path: "", data });
const item = {
  id: "1",
  type: "shoe",
  name: "کتونی",
  slug: "nike-air-max-90",
  categoryId: "c2",
  brandId: null,
  primaryImage: null,
  minPrice: 100,
  maxPrice: 100,
  inStock: true,
  details: null,
};

function mockApi(map: Record<string, unknown>) {
  vi.mocked(api.get).mockImplementation((async (...args: unknown[]) => {
    const path = String(args[0]);
    if (path in map) {
      const v = map[path];
      if (v instanceof Error) throw v;
      return ok(v);
    }
    throw new Error("unexpected " + path);
  }) as never);
}
const calls = () => vi.mocked(api.get).mock.calls;

describe("fetchProduct", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
    withCategories();
  });

  it("از مسیر slug می‌گیرد و دسته را از درخت پر می‌کند", async () => {
    mockApi({
      "/products/slug/nike-air-max-90": {
        ...item,
        description: "d",
        images: [],
        options: {},
        variants: [],
      },
    });
    const p = await fetchProduct("nike-air-max-90");
    expect(p?.name).toBe("کتونی");
    expect(p?.categorySlug).toBe("sports");
  });
  it("۴۰۴ را به null تبدیل می‌کند", async () => {
    mockApi({
      "/products/slug/x": new ApiRequestError({ status: 404, code: "NOT_FOUND", message: "نیست" }),
    });
    expect(await fetchProduct("x")).toBeNull();
  });
  it("خطای دیگر بالا می‌رود", async () => {
    mockApi({
      "/products/slug/x": new ApiRequestError({ status: 500, code: "E", message: "خطا" }),
    });
    await expect(fetchProduct("x")).rejects.toBeInstanceOf(ApiRequestError);
  });
});

describe("fetchProducts", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset();
    withCategories();
  });

  it("پارامترها به قالب بک‌اند: categoryId، sort، pageSize، nextCursor", async () => {
    mockApi({ "/products": { items: [item], nextCursor: "abc" } });
    const page = await fetchProducts({
      category: "sports",
      sort: "price-asc",
      limit: 12,
      cursor: "c0",
      minPrice: 5,
      inStock: true,
    });
    expect(page.nextCursor).toBe("abc");
    expect(page.items[0].categoryName).toBe("اسپرت");
    const q = calls().find((c) => c[0] === "/products")?.[1]?.query;
    expect(q).toMatchObject({
      categoryId: "c2",
      sort: "minPrice:asc",
      pageSize: 12,
      nextCursor: "c0",
      minPrice: 50,
      inStock: true,
    });
  });
  it("بدون sort: تازه‌ترین", async () => {
    mockApi({ "/products": { items: [], nextCursor: null } });
    await fetchProducts();
    expect(calls().find((c) => c[0] === "/products")?.[1]?.query).toMatchObject({
      sort: "createdAt:desc",
    });
  });
  it("جستجو از /products/search", async () => {
    mockApi({ "/products/search": { items: [item], nextCursor: null } });
    const page = await fetchProducts({ q: "نایک" });
    expect(page.items).toHaveLength(1);
    expect(calls().some((c) => c[0] === "/products/search")).toBe(true);
  });
  it("جستجوی یک‌نویسه: بدون درخواست، نتیجه‌ی خالی", async () => {
    expect(await fetchProducts({ q: "ن" })).toEqual({ items: [], nextCursor: null });
    expect(calls()).toHaveLength(0);
  });
  it("دسته‌ی ناشناخته: نتیجه‌ی خالی", async () => {
    mockApi({});
    expect(await fetchProducts({ category: "nope" })).toEqual({ items: [], nextCursor: null });
  });
});

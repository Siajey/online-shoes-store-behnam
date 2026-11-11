import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { createProduct, fetchAdminProduct, updateProduct } from "./detail-api";
import type { ProductPayload } from "./form";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } }));

const ok = (data: unknown) => ({ message: "", code: "", timestamp: "", path: "", data });
const dto = {
  id: "p 1",
  type: "shoe",
  name: "ک",
  slug: "a",
  description: "",
  status: "draft",
  categoryId: null,
  brandId: null,
  details: { gender: "men", material: null },
  publishedAt: null,
  variants: [],
};
const payload: ProductPayload = {
  name: "ک",
  slug: "b",
  description: "",
  categoryId: null,
  brandId: null,
  gender: "men",
  material: null,
};

beforeEach(() => Object.values(api).forEach((fn) => vi.mocked(fn).mockReset()));

describe("detail api", () => {
  it("fetch با CSRF و آدرس امن", async () => {
    vi.mocked(api.get).mockResolvedValue(ok(dto) as never);
    expect((await fetchAdminProduct("p 1")).id).toBe("p 1");
    const [path, opts] = vi.mocked(api.get).mock.calls[0] as unknown as [
      string,
      { csrf?: boolean },
    ];
    expect(path).toBe("/admin/products/p%201");
    expect(opts.csrf).toBe(true);
  });
  it("ساخت: type=shoe همراه فیلدها", async () => {
    vi.mocked(api.post).mockResolvedValue(ok(dto) as never);
    await createProduct(payload);
    expect(vi.mocked(api.post).mock.calls[0]).toEqual([
      "/admin/products",
      { body: { type: "shoe", ...payload } },
    ]);
  });
  it("ویرایش: gender و material زیر shoe و slug فقط در صورت تغییر", async () => {
    vi.mocked(api.patch).mockResolvedValue(ok(dto) as never);
    await updateProduct("p1", payload, { slug: "a", slugLocked: false });
    const body1 = (
      vi.mocked(api.patch).mock.calls[0][1] as unknown as { body: Record<string, unknown> }
    ).body;
    expect(body1).toMatchObject({ name: "ک", slug: "b", shoe: { gender: "men", material: null } });
    expect(body1).not.toHaveProperty("gender");

    await updateProduct("p1", payload, { slug: "b", slugLocked: false });
    expect(vi.mocked(api.patch).mock.calls[1][1]).not.toHaveProperty("body.slug");

    await updateProduct("p1", payload, { slug: "a", slugLocked: true });
    expect(vi.mocked(api.patch).mock.calls[2][1]).not.toHaveProperty("body.slug");
  });
});

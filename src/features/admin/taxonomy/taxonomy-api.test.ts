import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import {
  createBrand,
  createCategory,
  deleteBrand,
  deleteCategory,
  fetchAdminBrands,
  fetchAdminCategories,
  updateBrand,
  updateCategory,
} from "./api";

vi.mock("@/lib/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const ok = (data: unknown) => ({ message: "", code: "", timestamp: "", path: "", data });
const T = "2026-11-10T00:00:00.000Z";
beforeEach(() => Object.values(api).forEach((fn) => vi.mocked(fn).mockReset()));

describe("دسته‌ها", () => {
  it("فهرست با CSRF و نگاشت", async () => {
    vi.mocked(api.get).mockResolvedValue(
      ok([
        { id: "1", name: "ن", slug: "n", parentId: null, sortOrder: 3, createdAt: T, updatedAt: T },
      ]) as never,
    );
    expect(await fetchAdminCategories()).toEqual([
      { id: "1", name: "ن", slug: "n", parentId: null, sortOrder: 3 },
    ]);
    const [path, opts] = vi.mocked(api.get).mock.calls[0] as unknown as [
      string,
      { csrf?: boolean },
    ];
    expect(path).toBe("/admin/categories");
    expect(opts.csrf).toBe(true);
  });
  it("ساخت، ویرایش و حذف", async () => {
    const dto = {
      id: "1",
      name: "ن",
      slug: "n",
      parentId: null,
      sortOrder: 0,
      createdAt: T,
      updatedAt: T,
    };
    vi.mocked(api.post).mockResolvedValue(ok(dto) as never);
    vi.mocked(api.patch).mockResolvedValue(ok(dto) as never);
    vi.mocked(api.delete).mockResolvedValue(ok(null) as never);
    const body = { name: "ن", slug: "n", parentId: null, sortOrder: 0 };
    await createCategory(body);
    await updateCategory("a b", body);
    await deleteCategory("a b");
    expect(vi.mocked(api.post).mock.calls[0]).toEqual(["/admin/categories", { body }]);
    expect(vi.mocked(api.patch).mock.calls[0][0]).toBe("/admin/categories/a%20b");
    expect(vi.mocked(api.delete).mock.calls[0][0]).toBe("/admin/categories/a%20b");
  });
});

describe("برندها", () => {
  it("فهرست، ساخت، ویرایش و حذف", async () => {
    const dto = { id: "1", name: "نایک", slug: "nike", logoKey: null, createdAt: T, updatedAt: T };
    vi.mocked(api.get).mockResolvedValue(ok([dto]) as never);
    vi.mocked(api.post).mockResolvedValue(ok(dto) as never);
    vi.mocked(api.patch).mockResolvedValue(ok(dto) as never);
    vi.mocked(api.delete).mockResolvedValue(ok(null) as never);
    expect(await fetchAdminBrands()).toEqual([
      { id: "1", name: "نایک", slug: "nike", logoKey: null },
    ]);
    const body = { name: "نایک", slug: "nike", logoKey: null };
    expect((await createBrand(body)).slug).toBe("nike");
    await updateBrand("1", body);
    await deleteBrand("1");
    expect(vi.mocked(api.patch).mock.calls[0][0]).toBe("/admin/brands/1");
    expect(vi.mocked(api.delete).mock.calls[0][0]).toBe("/admin/brands/1");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { couponsApi, discountsApi, fetchCouponUsage } from "./api";

vi.mock("@/lib/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const ok = (data: unknown) => ({ message: "", code: "", timestamp: "", path: "", data });
beforeEach(() => Object.values(api).forEach((fn) => vi.mocked(fn).mockReset()));

const discount = {
  id: "d1",
  name: "حراج",
  kind: "fixed",
  value: 1_000_000,
  maxDiscountPerUnit: null,
  scope: { type: "all", targetIds: [] },
  startsAt: null,
  endsAt: null,
  isActive: true,
  createdAt: "x",
  updatedAt: "x",
};

describe("discountsApi", () => {
  it("فهرست: پارامترها (مبلغ‌ها تومان)", async () => {
    vi.mocked(api.get).mockResolvedValue(ok({ items: [discount], nextCursor: "n" }) as never);
    const page = await discountsApi.list({ isActive: true }, { cursor: "c", limit: 20 });
    expect(page.nextCursor).toBe("n");
    expect(page.items[0].value).toBe(1_000_000);
    const [path, opts] = vi.mocked(api.get).mock.calls[0] as unknown as [
      string,
      { query: Record<string, unknown> },
    ];
    expect(path).toBe("/admin/discounts");
    expect(opts.query).toMatchObject({
      isActive: "true",
      nextCursor: "c",
      pageSize: 20,
      sort: "createdAt:desc",
    });
  });
  it("بدون فیلتر وضعیت، isActive نمی‌رود", async () => {
    vi.mocked(api.get).mockResolvedValue(ok({ items: [], nextCursor: null }) as never);
    await discountsApi.list();
    const opts = vi.mocked(api.get).mock.calls[0][1] as unknown as {
      query: Record<string, unknown>;
    };
    expect(opts.query.isActive).toBeUndefined();
  });
  it("ساخت، ویرایش و حذف با مسیر امن", async () => {
    vi.mocked(api.post).mockResolvedValue(ok(discount) as never);
    vi.mocked(api.patch).mockResolvedValue(ok(discount) as never);
    vi.mocked(api.delete).mockResolvedValue(ok(null) as never);
    await discountsApi.create({ name: "x" });
    await discountsApi.update("a b", { isActive: false });
    await discountsApi.remove("a b");
    expect(vi.mocked(api.post).mock.calls[0]).toEqual([
      "/admin/discounts",
      { body: { name: "x" } },
    ]);
    expect(vi.mocked(api.patch).mock.calls[0]).toEqual([
      "/admin/discounts/a%20b",
      { body: { isActive: false } },
    ]);
    expect(vi.mocked(api.delete).mock.calls[0][0]).toBe("/admin/discounts/a%20b");
  });
});

describe("couponsApi و آمار", () => {
  it("مسیر کوپن‌ها", async () => {
    vi.mocked(api.get).mockResolvedValue(ok({ items: [], nextCursor: null }) as never);
    await couponsApi.list();
    expect(vi.mocked(api.get).mock.calls[0][0]).toBe("/admin/coupons");
  });
  it("آمار استفاده به تومان", async () => {
    vi.mocked(api.get).mockResolvedValue(
      ok({ reserved: 1, committed: 2, released: 3, totalDiscount: 10_000 }) as never,
    );
    const usage = await fetchCouponUsage("c1");
    expect(usage.totalDiscount).toBe(10_000);
    expect(vi.mocked(api.get).mock.calls[0][0]).toBe("/admin/coupons/c1/usage");
  });
});

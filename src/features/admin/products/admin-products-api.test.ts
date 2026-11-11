import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { changeProductStatus, fetchAdminProducts } from "./api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), post: vi.fn() } }));

const ok = (data: unknown) => ({ message: "", code: "", timestamp: "", path: "", data });

beforeEach(() => {
  vi.mocked(api.get).mockReset();
  vi.mocked(api.post).mockReset();
});

describe("fetchAdminProducts", () => {
  it("پارامترها را به قالب بک‌اند می‌فرستد", async () => {
    vi.mocked(api.get).mockResolvedValue(ok({ items: [], nextCursor: "n1" }) as never);
    const page = await fetchAdminProducts({
      status: "draft",
      q: " نایک ",
      cursor: "c0",
      limit: 20,
    });
    expect(page).toEqual({ items: [], nextCursor: "n1" });
    const [path, opts] = vi.mocked(api.get).mock.calls[0] as unknown as [
      string,
      { query: Record<string, unknown> },
    ];
    expect(path).toBe("/admin/products");
    expect(opts.query).toMatchObject({
      statuses: "draft",
      q: "نایک",
      nextCursor: "c0",
      pageSize: 20,
    });
    expect((opts as unknown as { csrf?: boolean }).csrf).toBe(true);
  });
  it("جستجوی خالی ارسال نمی‌شود", async () => {
    vi.mocked(api.get).mockResolvedValue(ok({ items: [], nextCursor: null }) as never);
    await fetchAdminProducts({ q: "  " });
    const opts = vi.mocked(api.get).mock.calls[0][1] as unknown as {
      query: Record<string, unknown>;
    };
    expect(opts.query.q).toBeUndefined();
  });
});

describe("changeProductStatus", () => {
  it("endpoint درست را می‌زند و وضعیت جدید را برمی‌گرداند", async () => {
    vi.mocked(api.post).mockResolvedValue(ok({ id: "p 1", status: "published" }) as never);
    expect(await changeProductStatus("p 1", "publish")).toBe("published");
    expect(vi.mocked(api.post).mock.calls[0][0]).toBe("/admin/products/p%201/publish");
  });
});

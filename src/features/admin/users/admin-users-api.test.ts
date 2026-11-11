import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { countAdminUsers, fetchAdminUsers, updateAdminUser } from "./api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn(), patch: vi.fn() } }));

const ok = (data: unknown) => ({ message: "", code: "", timestamp: "", path: "", data });
beforeEach(() => Object.values(api).forEach((fn) => vi.mocked(fn).mockReset()));

describe("fetchAdminUsers", () => {
  it("کلید users را می‌خواند و پارامترها را می‌فرستد", async () => {
    vi.mocked(api.get).mockResolvedValue(
      ok({
        users: [
          {
            id: "1",
            phoneNumber: "0912",
            role: "user",
            status: "active",
            createdAt: "x",
            updatedAt: null,
          },
        ],
        length: 1,
        nextCursor: "n",
      }) as never,
    );
    const page = await fetchAdminUsers(
      { role: "user", phoneNumber: "09120000000" },
      { cursor: "c", limit: 20 },
    );
    expect(page.nextCursor).toBe("n");
    expect(page.items[0].id).toBe("1");
    const [path, opts] = vi.mocked(api.get).mock.calls[0] as unknown as [
      string,
      { query: Record<string, unknown> },
    ];
    expect(path).toBe("/users");
    expect(opts.query).toMatchObject({
      role: "user",
      phoneNumber: "09120000000",
      nextCursor: "c",
      pageSize: 20,
      sort: "createdAt:desc",
    });
  });
});

describe("countAdminUsers", () => {
  it("عدد را برمی‌گرداند و غیرعدد صفر است", async () => {
    vi.mocked(api.get).mockResolvedValueOnce(ok(42) as never);
    expect(await countAdminUsers({ status: "active" })).toBe(42);
    expect(vi.mocked(api.get).mock.calls[0][0]).toBe("/users/count");
    vi.mocked(api.get).mockResolvedValueOnce(ok({}) as never);
    expect(await countAdminUsers()).toBe(0);
  });
});

describe("updateAdminUser", () => {
  it("PATCH با شناسهٔ امن", async () => {
    vi.mocked(api.patch).mockResolvedValue(ok({}) as never);
    await updateAdminUser("a b", { role: "admin" });
    expect(vi.mocked(api.patch).mock.calls[0]).toEqual([
      "/users/a%20b",
      { body: { role: "admin" } },
    ]);
  });
});

import { describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/lib/api/errors";
import { createAuthStore } from "./store";
import type { User } from "./types";

const user: User = {
  id: "u1",
  phoneNumber: "09120000000",
  role: "user",
  status: "active",
  hasProfile: false,
};
const err = (status: number) =>
  new ApiRequestError({ status, code: "X", message: `پیام ${status}` });

function make(fetchMe: () => Promise<User>, logout: () => Promise<void> = async () => {}) {
  return createAuthStore({ fetchMe, logout });
}

describe("createAuthStore", () => {
  it("ابتدا unknown است (سرور هم همین)", () => {
    const store = make(async () => user);
    expect(store.getSnapshot().status).toBe("unknown");
    expect(store.getServerSnapshot().status).toBe("unknown");
  });

  it("موفق: authenticated با کاربر", async () => {
    const store = make(async () => user);
    await store.load();
    expect(store.getSnapshot()).toMatchObject({ status: "authenticated", user });
  });

  it("۴۰۱ و ۴۰۳: مهمان", async () => {
    for (const status of [401, 403]) {
      const store = make(async () => {
        throw err(status);
      });
      await store.load();
      expect(store.getSnapshot().status).toBe("guest");
    }
  });

  it("قطعی یا خطای سرور: error (نه مهمان) با پیام", async () => {
    const store = make(async () => {
      throw err(0);
    });
    await store.load();
    expect(store.getSnapshot()).toMatchObject({ status: "error", error: "پیام 0" });
  });

  it("load فقط یک بار می‌پرسد؛ refresh دوباره می‌پرسد", async () => {
    const fetchMe = vi.fn(async () => user);
    const store = make(fetchMe);
    await store.load();
    await store.load();
    expect(fetchMe).toHaveBeenCalledTimes(1);
    await store.refresh();
    expect(fetchMe).toHaveBeenCalledTimes(2);
  });

  it("درخواست‌های هم‌زمان یکی می‌شوند", async () => {
    const fetchMe = vi.fn(async () => user);
    const store = make(fetchMe);
    await Promise.all([store.load(), store.refresh(), store.refresh()]);
    expect(fetchMe).toHaveBeenCalledTimes(1);
  });

  it("خروج: مهمان می‌شود و مشترکین خبر می‌شوند", async () => {
    const logout = vi.fn(async () => {});
    const store = make(async () => user, logout);
    await store.load();
    const listener = vi.fn();
    store.subscribe(listener);
    await store.logout();
    expect(logout).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().status).toBe("guest");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("اگر خروج خطا بدهد، وضعیت ورود می‌ماند و خطا پرتاب می‌شود", async () => {
    const store = make(
      async () => user,
      async () => {
        throw err(0);
      },
    );
    await store.load();
    await expect(store.logout()).rejects.toBeInstanceOf(ApiRequestError);
    expect(store.getSnapshot().status).toBe("authenticated");
  });

  it("markGuest: از دست رفتن نشست", async () => {
    const store = make(async () => user);
    await store.load();
    store.markGuest();
    expect(store.getSnapshot().status).toBe("guest");
  });
});

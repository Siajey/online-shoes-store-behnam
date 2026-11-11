import { describe, expect, it } from "vitest";
import type { AuthState } from "@/features/auth/store";
import { adminAccess } from "./guard";

const user = (role: string): AuthState => ({
  status: "authenticated",
  error: null,
  user: { id: "1", phoneNumber: "09120000000", role, status: "active", hasProfile: true },
});

describe("adminAccess", () => {
  it("فقط نقش admin اجازه دارد", () => {
    expect(adminAccess(user("admin"))).toBe("ok");
    expect(adminAccess(user("user"))).toBe("forbidden");
  });
  it("وضعیت‌های دیگر", () => {
    expect(adminAccess({ status: "unknown", user: null, error: null })).toBe("loading");
    expect(adminAccess({ status: "guest", user: null, error: null })).toBe("guest");
    expect(adminAccess({ status: "error", user: null, error: "x" })).toBe("error");
  });
});

import { describe, expect, it } from "vitest";
import { toUser } from "./mappers";

const dto = {
  id: "6cab830c-bde1-4427-97e4-92c6cf7bcdea",
  phoneNumber: "09120000000",
  status: "active",
  role: "user",
  updatedAt: "2026-11-05T00:45:36.021Z",
  createdAt: "2026-11-05T00:44:41.845Z",
  profile: null,
};

describe("toUser", () => {
  it("نمونه‌ی واقعی بک‌اند را به مدل فرانت تبدیل می‌کند", () => {
    expect(toUser(dto)).toEqual({
      id: dto.id,
      phoneNumber: "09120000000",
      role: "user",
      status: "active",
      hasProfile: false,
    });
  });
  it("پروفایل داشتن را تشخیص می‌دهد", () => {
    expect(toUser({ ...dto, profile: { firstName: "الف" } }).hasProfile).toBe(true);
  });
});

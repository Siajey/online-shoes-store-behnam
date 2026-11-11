import { describe, expect, it } from "vitest";
import { actionPatch, needsConfirm, userActions } from "./labels";
import { toAdminUser, toRole, toUserStatus } from "./mappers";

describe("mappers", () => {
  it("نقش و وضعیت ناشناخته امن می‌شوند", () => {
    expect(toRole("admin")).toBe("admin");
    expect(toRole("root")).toBe("user");
    expect(toUserStatus("registered")).toBe("registered");
    expect(toUserStatus("???")).toBe("inactive");
  });
  it("نگاشت کاربر", () => {
    expect(
      toAdminUser({
        id: "1",
        phoneNumber: "09120000000",
        role: "admin",
        status: "active",
        createdAt: "2026-11-10T00:00:00.000Z",
        updatedAt: null,
      }),
    ).toEqual({
      id: "1",
      phoneNumber: "09120000000",
      role: "admin",
      status: "active",
      createdAt: "2026-11-10T00:00:00.000Z",
    });
  });
});

describe("userActions", () => {
  it("بر اساس نقش و وضعیت", () => {
    expect(userActions({ role: "user", status: "active" })).toEqual(["makeAdmin", "deactivate"]);
    expect(userActions({ role: "admin", status: "inactive" })).toEqual(["makeUser", "activate"]);
    expect(userActions({ role: "user", status: "registered" })).toEqual([
      "makeAdmin",
      "deactivate",
    ]);
  });
  it("patch و تأیید", () => {
    expect(actionPatch("makeAdmin")).toEqual({ role: "admin" });
    expect(actionPatch("deactivate")).toEqual({ status: "inactive" });
    expect(needsConfirm("makeAdmin")).toBe(true);
    expect(needsConfirm("deactivate")).toBe(true);
    expect(needsConfirm("activate")).toBe(false);
  });
});

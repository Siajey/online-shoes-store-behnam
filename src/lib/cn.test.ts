import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("مقدارهای falsy را حذف می‌کند", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
  it("بدون ورودی رشته‌ی خالی می‌دهد", () => {
    expect(cn()).toBe("");
  });
});

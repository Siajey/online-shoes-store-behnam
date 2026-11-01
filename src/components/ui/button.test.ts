import { describe, expect, it } from "vitest";
import { buttonVariants } from "./button";

describe("buttonVariants", () => {
  it("پیش‌فرض: primary و md", () => {
    const cls = buttonVariants();
    expect(cls).toContain("bg-brand");
    expect(cls).toContain("h-12");
  });
  it("واریانت و اندازه را اعمال می‌کند", () => {
    const cls = buttonVariants({ variant: "outline", size: "sm" });
    expect(cls).toContain("border-line");
    expect(cls).toContain("h-10");
    expect(cls).not.toContain("bg-brand");
  });
  it("fullWidth و className اضافی", () => {
    const cls = buttonVariants({ fullWidth: true, className: "mt-4" });
    expect(cls).toContain("w-full");
    expect(cls).toContain("mt-4");
  });
  it("فقط از ویژگی‌های منطقی (logical) استفاده می‌کند", () => {
    const cls = buttonVariants({ variant: "ghost", size: "lg" });
    expect(cls).not.toMatch(/(^|\s)(ml|mr|pl|pr|left|right)-/);
  });
});

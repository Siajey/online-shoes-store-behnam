import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "./badge";

describe("badgeVariants", () => {
  it("پیش‌فرض: neutral و md", () => {
    const cls = badgeVariants();
    expect(cls).toContain("bg-surface-2");
    expect(cls).toContain("h-8");
  });
  it("واریانت و اندازه را اعمال می‌کند", () => {
    const cls = badgeVariants({ variant: "success", size: "sm" });
    expect(cls).toContain("text-ok");
    expect(cls).toContain("h-6");
  });
  it("className اضافی را اضافه می‌کند", () => {
    expect(badgeVariants({ className: "mt-2" })).toContain("mt-2");
  });
});

describe("Badge", () => {
  it("متن را نمایش می‌دهد", () => {
    expect(renderToStaticMarkup(<Badge>ارسال شد</Badge>)).toContain("ارسال شد");
  });
  it("نقطه را فقط برای dot نشان می‌دهد و برای صفحه‌خوان پنهان است", () => {
    const withDot = renderToStaticMarkup(<Badge dot>در انتظار</Badge>);
    const without = renderToStaticMarkup(<Badge>در انتظار</Badge>);
    expect(withDot).toContain('aria-hidden="true"');
    expect(without).not.toContain("aria-hidden");
  });
});

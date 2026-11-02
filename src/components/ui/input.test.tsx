import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

const html = (props: Parameters<typeof Input>[0]) => renderToStaticMarkup(<Input {...props} />);

describe("Input", () => {
  it("برچسب را به فیلد وصل می‌کند", () => {
    const out = html({ label: "شماره موبایل" });
    const forId = out.match(/for="([^"]+)"/)?.[1];
    const inputId = out.match(/<input[^>]* id="([^"]+)"/)?.[1];
    expect(forId).toBeTruthy();
    expect(forId).toBe(inputId);
    expect(out).toContain("شماره موبایل");
  });

  it("id داده‌شده را نگه می‌دارد", () => {
    const out = html({ label: "نام", id: "name" });
    expect(out).toContain('for="name"');
    expect(out).toContain('id="name"');
  });

  it("با خطا، aria-invalid و پیام alert دارد", () => {
    const out = html({ label: "نام", id: "name", error: "نام لازم است" });
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('aria-describedby="name-message"');
    expect(out).toContain('role="alert"');
    expect(out).toContain("border-danger");
  });

  it("با خطا و راهنما، فقط خطا نمایش داده می‌شود", () => {
    const out = html({ label: "نام", error: "خطا", hint: "راهنما" });
    expect(out).toContain("خطا");
    expect(out).not.toContain("راهنما");
  });

  it("بدون خطا، راهنما را نشان می‌دهد و aria-invalid ندارد", () => {
    const out = html({ label: "نام", hint: "نام و نام خانوادگی" });
    expect(out).toContain("نام و نام خانوادگی");
    expect(out).not.toContain("aria-invalid");
    expect(out).not.toContain('role="alert"');
  });

  it("حالت ltr جهت و تراز را تنظیم می‌کند", () => {
    const out = html({ label: "موبایل", ltr: true });
    expect(out).toContain('dir="ltr"');
    expect(out).toContain("text-end");
  });
});

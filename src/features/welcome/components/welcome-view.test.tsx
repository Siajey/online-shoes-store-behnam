import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WelcomeView } from "./welcome-view";

describe("WelcomeView", () => {
  const out = renderToStaticMarkup(<WelcomeView />);
  it("عنوان، توضیح و دکمه‌ی شروع که به خانه می‌رود", () => {
    expect(out).toContain("سفر خرید کفش‌هات رو از اینجا شروع کن");
    expect(out).toContain("مجموعه‌ای شیک، مدرن و متنوع برای هر سلیقه");
    expect(out).toMatch(/<a[^>]*href="\/"[^>]*>شروع کنید/);
  });
  it("نام برند نمایش داده می‌شود و فقط یک h1 دارد", () => {
    expect(out).toContain("کفش بهنام");
    expect(out.match(/<h1/g)?.length).toBe(1);
  });
  it("تزئین‌ها برای صفحه‌خوان پنهان‌اند و فقط ویژگی‌های منطقی دارد", () => {
    expect(out).toContain('aria-hidden="true"');
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ErrorView } from "./error-view";

describe("ErrorView", () => {
  const out = renderToStaticMarkup(<ErrorView onRetry={() => {}} />);
  it("پیام فارسی، تلاش دوباره و بازگشت به خانه", () => {
    expect(out).toContain("مشکلی پیش آمد");
    expect(out).toContain("تلاش دوباره");
    expect(out).toContain('href="/"');
    expect(out).toContain('role="alert"');
  });
  it("فقط از ویژگی‌های منطقی استفاده می‌کند", () => {
    expect(out).not.toMatch(/class="[^"]*(\s|")(ml|mr|pl|pr|left|right)-/);
  });
});

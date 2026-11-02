import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  it("در رندر سرور (حالت پیش‌فرض تیره) پیشنهاد حالت روشن را می‌دهد", () => {
    const out = renderToStaticMarkup(<ThemeToggle />);
    expect(out).toContain('aria-label="تغییر به حالت روشن"');
    expect(out).toContain("<button");
  });
});

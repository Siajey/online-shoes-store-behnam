import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AccountError, AccountSkeleton } from "./account-views";

const noop = () => {};

describe("حالت‌های دیگر", () => {
  it("اسکلت برای صفحه‌خوان متن بارگذاری دارد", () => {
    expect(renderToStaticMarkup(<AccountSkeleton />)).toContain("در حال بارگذاری حساب");
  });
  it("خطا دکمه‌ی تلاش دوباره دارد", () => {
    const out = renderToStaticMarkup(<AccountError message="قطع" onRetry={noop} />);
    expect(out).toContain("قطع");
    expect(out).toContain("تلاش دوباره");
  });
});

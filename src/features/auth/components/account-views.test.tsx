import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { User } from "../types";
import { AccountError, AccountSkeleton, AccountView } from "./account-views";

const user: User = {
  id: "u1",
  phoneNumber: "09120000000",
  role: "user",
  status: "active",
  hasProfile: false,
};
const noop = () => {};

describe("AccountView", () => {
  const html = (over: Partial<Parameters<typeof AccountView>[0]> = {}) =>
    renderToStaticMarkup(<AccountView user={user} onLogout={noop} loggingOut={false} {...over} />);

  it("شماره را فارسی و چپ‌به‌راست و وضعیت را نشان می‌دهد", () => {
    const out = html();
    expect(out).toContain("۰۹۱۲۰۰۰۰۰۰۰");
    expect(out).toContain('dir="ltr"');
    expect(out).toContain("فعال");
    expect(out).toContain("خروج از حساب");
  });
  it("وضعیت ناشناس را نشان نمی‌دهد", () => {
    expect(html({ user: { ...user, status: "weird" } })).not.toContain("وضعیت");
  });
  it("خطای خروج را با role=alert نشان می‌دهد", () => {
    const out = html({ error: "ارتباط برقرار نشد" });
    expect(out).toContain("ارتباط برقرار نشد");
    expect(out).toContain('role="alert"');
  });
  it("در حال خروج، دکمه busy است", () => {
    expect(html({ loggingOut: true })).toContain('aria-busy="true"');
  });
});

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

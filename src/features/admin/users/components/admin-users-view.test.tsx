import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { AdminUser } from "../types";
import { UsersFilterBar, UsersListView, type UsersListViewProps } from "./admin-users-view";

const u = (over: Partial<AdminUser> = {}): AdminUser => ({
  id: "1",
  phoneNumber: "09120000000",
  role: "user",
  status: "active",
  createdAt: "2026-11-10T12:00:00.000Z",
  ...over,
});
const noop = () => {};
const base: Omit<UsersListViewProps, "state"> = {
  busyId: null,
  confirming: null,
  loadingMore: false,
  onAction: noop,
  onConfirm: noop,
  onCancelConfirm: noop,
  onRetry: noop,
  onLoadMore: noop,
};
const ready = (items: AdminUser[], hasMore = false): UsersListViewProps["state"] => ({
  status: "ready",
  items,
  hasMore,
});

describe("UsersListView", () => {
  it("بارگذاری، خطا و خالی", () => {
    expect(
      renderToStaticMarkup(<UsersListView {...base} state={{ status: "loading" }} />),
    ).toContain("در حال بارگذاری");
    expect(
      renderToStaticMarkup(<UsersListView {...base} state={{ status: "error", message: "قطع" }} />),
    ).toContain('role="alert"');
    expect(renderToStaticMarkup(<UsersListView {...base} state={ready([])} />)).toContain(
      "کاربری پیدا نشد",
    );
  });
  it("دکمه‌ها برای کاربر عادی و مدیر", () => {
    const out = renderToStaticMarkup(
      <UsersListView
        {...base}
        state={ready([u(), u({ id: "2", role: "admin", status: "inactive" })], true)}
      />,
    );
    expect(out).toContain("ارتقا به مدیر");
    expect(out).toContain("غیرفعال‌سازی");
    expect(out).toContain("تبدیل به کاربر عادی");
    expect(out).toContain("فعال‌سازی");
    expect(out).toContain("نمایش بیشتر");
  });
  it("حساب خود مدیر دکمه ندارد", () => {
    const out = renderToStaticMarkup(
      <UsersListView {...base} selfId="1" state={ready([u({ role: "admin" })])} />,
    );
    expect(out).not.toContain("ارتقا به مدیر");
    expect(out).not.toContain("غیرفعال‌سازی");
    expect(out).toContain("شما");
    expect(out).toContain("تغییر نقش و وضعیت حساب خودتان");
  });
  it("تأیید دومرحله‌ای", () => {
    const out = renderToStaticMarkup(
      <UsersListView
        {...base}
        confirming={{ id: "1", action: "makeAdmin" }}
        state={ready([u()])}
      />,
    );
    expect(out).toContain("مطمئن هستید؟");
    expect(out).toContain("بله، انجام شود");
    expect(out).not.toContain(">ارتقا به مدیر<");
  });
  it("هنگام انجام عملیات دکمه‌ها غیرفعال‌اند", () => {
    expect(
      renderToStaticMarkup(<UsersListView {...base} busyId="1" state={ready([u()])} />),
    ).toContain("disabled");
  });
});

describe("UsersFilterBar", () => {
  const bar = {
    role: undefined,
    status: undefined,
    phone: "",
    total: null,
    onRole: noop,
    onStatus: noop,
    onPhone: noop,
    onSearch: noop,
    onClear: noop,
  } as const;
  it("چیپ‌ها و تعداد کل", () => {
    const out = renderToStaticMarkup(<UsersFilterBar {...bar} role="admin" total={12} />);
    expect(out).toContain('aria-pressed="true"');
    expect(out).toContain("ثبت‌نام‌شده");
    expect(out).toContain("تعداد کل");
  });
  it("خطای شماره و دکمهٔ پاک‌کردن", () => {
    const out = renderToStaticMarkup(
      <UsersFilterBar {...bar} phone="09" phoneError="شمارهٔ موبایل معتبر نیست." />,
    );
    expect(out).toContain("شمارهٔ موبایل معتبر نیست.");
    expect(out).toContain("پاک‌کردن");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ACCOUNT_LINKS } from "../account-nav";
import { AccountMenu } from "./account-menu";
import { AccountSidebarView } from "./account-sidebar-view";
import { AccountShell } from "./account-shell";
import { SecurityView } from "./security-view";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: () => {}, push: () => {} }),
}));

const noop = () => {};

describe("AccountShell", () => {
  it("نوار کناری با صفحه‌ی فعلی و عنوان", () => {
    const out = renderToStaticMarkup(
      <AccountShell current="addresses" title="آدرس‌ها">
        <p>محتوا</p>
      </AccountShell>,
    );
    expect(out).toContain('aria-current="page"');
    expect(out).toContain("محتوا");
    expect(out).toContain("بازگشت به حساب");
    for (const l of ACCOUNT_LINKS) expect(out).toContain(`href="${l.href}"`);
  });
  it("خلاصه: بدون لینک بازگشت", () => {
    const out = renderToStaticMarkup(
      <AccountShell current="summary" title="حساب کاربری">
        <p>x</p>
      </AccountShell>,
    );
    expect(out).not.toContain("بازگشت به حساب");
  });
});

describe("AccountMenu", () => {
  const menu = (over = {}) =>
    renderToStaticMarkup(
      <AccountMenu
        name="علی رضایی"
        phone="09120000000"
        onLogout={noop}
        loggingOut={false}
        {...over}
      />,
    );
  it("سلام با نام، شماره‌ی فارسی و لینک ویرایش پروفایل", () => {
    const out = menu();
    expect(out).toContain("سلام، علی رضایی");
    expect(out).toContain("۰۹۱۲۰۰۰۰۰۰۰");
    expect(out).toContain('href="/account/profile"');
  });
  it("بخش‌ها با آیکون و ردیف خروج", () => {
    const out = menu();
    for (const href of [
      "/account/orders",
      "/favourites",
      "/account/addresses",
      "/account/security",
    ])
      expect(out).toContain(`href="${href}"`);
    expect(out).toContain("<svg");
    expect(out).toContain("خروج از حساب");
  });
  it("بدون نام", () => {
    expect(menu({ name: undefined })).toContain("خوش آمدید");
  });
  it("خطا و حالت در حال خروج", () => {
    const out = menu({ error: "قطع", loggingOut: true });
    expect(out).toContain('role="alert"');
    expect(out).toContain('aria-busy="true"');
  });
});

describe("AccountSidebarView", () => {
  const side = (over = {}) =>
    renderToStaticMarkup(
      <AccountSidebarView current="orders" onLogout={noop} loggingOut={false} {...over} />,
    );
  it("همه‌ی بخش‌ها با آیکون و صفحه‌ی فعلی", () => {
    const out = side();
    for (const l of ACCOUNT_LINKS) expect(out).toContain(`href="${l.href}"`);
    expect(out.match(/aria-current="page"/g)).toHaveLength(1);
    expect(out.match(/<svg/g)?.length).toBeGreaterThan(6);
  });
  it("کارت کاربر: حرف اول نام و شماره", () => {
    const out = side({ name: "علی رضایی", phone: "09120000000" });
    expect(out).toContain("علی رضایی");
    expect(out).toContain(">ع<");
    expect(out).toContain("۰۹۱۲۰۰۰۰۰۰۰");
  });
  it("بدون نام: نام پیش‌فرض و آیکون", () => {
    expect(side()).toContain("حساب کاربری");
  });
  it("خروج و خطا", () => {
    const out = side({ error: "قطع" });
    expect(out).toContain("خروج از حساب");
    expect(out).toContain('role="alert"');
  });
});

describe("SecurityView", () => {
  const view = (over = {}) =>
    renderToStaticMarkup(
      <SecurityView
        onLogout={noop}
        loggingOut={false}
        confirmingDelete={false}
        onAskDelete={noop}
        onCancelDelete={noop}
        onConfirmDelete={noop}
        deleting={false}
        {...over}
      />,
    );
  it("روش ورود، خروج و دکمه‌ی حذف", () => {
    const out = view();
    for (const s of ["روش ورود", "رمز عبور", "خروج از حساب", "حذف حساب"]) expect(out).toContain(s);
    expect(out).not.toContain("alertdialog");
  });
  it("تأیید حذف و خطا", () => {
    const out = view({ confirmingDelete: true, error: "خطا" });
    expect(out).toContain("alertdialog");
    expect(out).toContain("بله، حذف شود");
    expect(out).toContain('role="alert"');
  });
});

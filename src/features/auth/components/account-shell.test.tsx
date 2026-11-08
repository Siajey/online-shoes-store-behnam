import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ACCOUNT_LINKS, MENU_LINKS } from "../account-nav";
import { AccountMenu } from "./account-menu";
import { AccountShell } from "./account-shell";
import { SecurityView } from "./security-view";

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
  it("همه‌ی بخش‌ها به‌جز خلاصه و سلام با نام", () => {
    const out = renderToStaticMarkup(<AccountMenu name="علی رضایی" />);
    expect(out).toContain("سلام، علی رضایی");
    for (const l of MENU_LINKS) expect(out).toContain(`href="${l.href}"`);
    expect(out).not.toContain('href="/account"');
  });
  it("بدون نام", () => {
    expect(renderToStaticMarkup(<AccountMenu />)).toContain("خوش آمدید");
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

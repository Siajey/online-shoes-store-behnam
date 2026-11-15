import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EMPTY_OFFER } from "../form";
import type { OfferRow } from "../format";
import { CouponUsageCard, OfferFormView, type OfferFormViewProps } from "./offer-form-view";
import { OffersListView, type OffersListState } from "./offers-list-view";

const noop = () => {};
const row = (over: Partial<OfferRow> = {}): OfferRow => ({
  id: "1",
  title: "حراج تابستان",
  value: "۲۰٪",
  scope: "همه‌ی کالاها",
  period: "بدون محدودیت زمانی",
  active: true,
  ...over,
});

const list = (state: OffersListState, over = {}, kind: "discount" | "coupon" = "discount") =>
  renderToStaticMarkup(
    <OffersListView
      kind={kind}
      state={state}
      filter="all"
      newHref="/admin/discounts/new"
      editHref={(id) => `/admin/discounts/${id}`}
      busyId={null}
      confirmingId={null}
      loadingMore={false}
      onFilter={noop}
      onToggle={noop}
      onAskDelete={noop}
      onConfirmDelete={noop}
      onCancelDelete={noop}
      onRetry={noop}
      onLoadMore={noop}
      {...over}
    />,
  );

describe("OffersListView", () => {
  it("ردیف‌ها با مقدار، شمول و لینک ویرایش", () => {
    const out = list({ status: "ready", items: [row()], hasMore: false });
    for (const s of ["حراج تابستان", "۲۰٪", "همه‌ی کالاها", "بدون محدودیت زمانی", "فعال"])
      expect(out).toContain(s);
    expect(out).toContain('href="/admin/discounts/1"');
    expect(out).toContain('href="/admin/discounts/new"');
    expect(out).toContain("ایجاد تخفیف");
  });
  it("کد کوپن چپ‌به‌راست دیده می‌شود", () => {
    const out = list(
      { status: "ready", items: [row({ code: "SUMMER20" })], hasMore: false },
      {},
      "coupon",
    );
    expect(out).toContain("SUMMER20");
    expect(out).toContain("ایجاد کوپن");
  });
  it("غیرفعال: دکمه‌ی فعال‌سازی", () => {
    const out = list({ status: "ready", items: [row({ active: false })], hasMore: false });
    expect(out).toContain("فعال‌سازی");
    expect(out).toContain("غیرفعال");
  });
  it("تأیید حذف", () => {
    const out = list({ status: "ready", items: [row()], hasMore: false }, { confirmingId: "1" });
    expect(out).toContain("این تخفیف حذف شود؟");
    expect(out).toContain("بله، حذف شود");
  });
  it("خالی، بارگذاری، خطا و ادامه", () => {
    expect(list({ status: "ready", items: [], hasMore: false })).toContain(
      "هنوز تخفیفی ثبت نشده است.",
    );
    expect(list({ status: "loading" })).toContain('aria-busy="true"');
    expect(list({ status: "error", message: "قطع" })).toContain("تلاش دوباره");
    expect(list({ status: "ready", items: [row()], hasMore: true })).toContain("نمایش بیشتر");
    expect(
      list({ status: "ready", items: [row()], hasMore: false }, { actionError: "ناموفق" }),
    ).toContain('role="alert"');
  });
});

const form = (over: Partial<OfferFormViewProps> = {}) =>
  renderToStaticMarkup(
    <OfferFormView
      kind="discount"
      mode="create"
      values={{ ...EMPTY_OFFER }}
      errors={{}}
      categories={[{ value: "c1", label: "کتانی" }]}
      brands={[{ value: "b1", label: "نایک" }]}
      pending={false}
      backHref="/admin/discounts"
      onChange={noop}
      onSubmit={noop}
      {...over}
    />,
  );

describe("OfferFormView", () => {
  it("تخفیف: فیلدهای اصلی؛ بدون فیلد کوپن", () => {
    const out = form();
    for (const s of [
      "نام تخفیف",
      "نوع تخفیف",
      "درصد تخفیف",
      "شامل کدام کالاها",
      "بازه‌ی زمانی",
      "ذخیره",
    ])
      expect(out).toContain(s);
    expect(out).not.toContain("کد کوپن");
    expect(out).not.toContain("سقف کل استفاده");
    expect(out).toContain("تخفیف جدید");
  });
  it("کوپن: کد، حداقل سفارش و محدودیت‌ها", () => {
    const out = form({ kind: "coupon" });
    for (const s of [
      "کد کوپن",
      "حداقل مبلغ سفارش",
      "سقف کل استفاده",
      "سقف استفاده‌ی هر کاربر",
      "روی کالاهای دارای تخفیف",
    ])
      expect(out).toContain(s);
  });
  it("ویرایش کوپن: کد قفل است", () => {
    const out = form({
      kind: "coupon",
      mode: "edit",
      values: { ...EMPTY_OFFER, code: "SUMMER20" },
    });
    expect(out).toContain("ویرایش کوپن");
    expect(out).toMatch(
      /<input[^>]*disabled[^>]*value="SUMMER20"|<input[^>]*value="SUMMER20"[^>]*disabled/,
    );
  });
  it("مبلغ ثابت: برچسب تومان", () => {
    expect(form({ values: { ...EMPTY_OFFER, kind: "fixed" } })).toContain("مبلغ تخفیف (تومان)");
  });
  it("شمول دسته‌بندی: گزینه‌ها؛ محصول: جعبه‌ی شناسه", () => {
    const cat = form({ values: { ...EMPTY_OFFER, scopeType: "category" } });
    expect(cat).toContain("کتانی");
    expect(cat).toContain('type="checkbox"');
    const brand = form({ values: { ...EMPTY_OFFER, scopeType: "brand", targetIds: ["b1"] } });
    expect(brand).toContain("نایک");
    expect(brand).toContain("checked");
    const prod = form({ values: { ...EMPTY_OFFER, scopeType: "product" } });
    expect(prod).toContain("<textarea");
    expect(prod).toContain("هر شناسه");
  });
  it("خطاها با متن فارسی و خطای کلی", () => {
    const out = form({
      errors: { name: "required", value: "percentMax", endsAt: "period" },
      formError: "ناموفق",
    });
    expect(out).toContain("این فیلد الزامی است.");
    expect(out).toContain("درصد نباید بیشتر از ۱۰۰ باشد.");
    expect(out).toContain("پایان باید بعد از شروع باشد.");
    expect(out).toContain('role="alert"');
  });
  it("کد تکراری", () => {
    expect(form({ kind: "coupon", errors: { code: "duplicate" } })).toContain(
      "این کد قبلاً ثبت شده است.",
    );
  });
});

describe("CouponUsageCard", () => {
  it("اعداد فارسی و مجموع تخفیف", () => {
    const out = renderToStaticMarkup(
      <CouponUsageCard
        usage={{ reserved: 5, committed: 42, released: 3, totalDiscount: "۱٬۲۵۰٬۰۰۰ تومان" }}
      />,
    );
    expect(out).toContain("۴۲");
    expect(out).toContain("۱٬۲۵۰٬۰۰۰ تومان");
  });
});

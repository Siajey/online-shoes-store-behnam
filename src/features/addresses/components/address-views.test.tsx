import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AddressCard, AddressFormView, AddressListView } from "./address-views";

const addr = (id: string, isDefault = false) => ({
  id,
  province: "تهران",
  city: "تهران",
  street: "خیابان آزادی",
  postalCode: "1234567890",
  isDefault,
});
const noop = () => {};
const card = (over = {}) =>
  renderToStaticMarkup(
    <AddressCard
      address={addr("1")}
      confirmingRemove={false}
      busy={false}
      onEdit={noop}
      onMakeDefault={noop}
      onAskRemove={noop}
      onConfirmRemove={noop}
      onCancelRemove={noop}
      {...over}
    />,
  );

describe("AddressCard", () => {
  it("اطلاعات با کدپستی فارسی و عمل‌ها", () => {
    const out = card();
    expect(out).toContain("تهران، تهران");
    expect(out).toContain("کدپستی: ۱۲۳۴۵۶۷۸۹۰");
    expect(out).toContain("ویرایش");
    expect(out).toContain("پیش‌فرض شود");
  });
  it("آدرس پیش‌فرض نشان دارد و دکمه‌ی پیش‌فرض ندارد", () => {
    const out = card({ address: addr("1", true) });
    expect(out).toContain("پیش‌فرض</span>");
    expect(out).not.toContain("پیش‌فرض شود");
  });
  it("حالت تأیید حذف", () => {
    const out = card({ confirmingRemove: true });
    expect(out).toContain("این آدرس حذف شود؟");
    expect(out).toContain("بله، حذف شود");
    expect(out).not.toContain("ویرایش");
  });
});

describe("AddressListView", () => {
  const list = (n: number) =>
    renderToStaticMarkup(
      <AddressListView
        addresses={Array.from({ length: n }, (_, i) => addr(String(i)))}
        onAdd={noop}
        renderCard={(a) => <li key={a.id}>{a.id}</li>}
      />,
    );
  it("خالی: پیام و دکمه‌ی افزودن", () => {
    const out = list(0);
    expect(out).toContain("هنوز آدرسی ثبت نکرده‌اید.");
    expect(out).toContain("افزودن آدرس");
  });
  it("یک آدرس: هنوز می‌شود اضافه کرد", () => {
    expect(list(1)).toContain("افزودن آدرس");
  });
  it("دو آدرس: دکمه نیست و پیام سقف می‌آید", () => {
    const out = list(2);
    expect(out).not.toContain("افزودن آدرس");
    expect(out).toContain("حداکثر می‌توانید ۲ آدرس ذخیره کنید.");
  });
});

describe("AddressFormView", () => {
  const form = (over = {}) =>
    renderToStaticMarkup(
      <AddressFormView
        title="آدرس جدید"
        values={{ province: "", city: "", street: "", postalCode: "" }}
        onChange={noop}
        onSubmit={noop}
        onCancel={noop}
        pending={false}
        errors={{}}
        {...over}
      />,
    );
  it("چهار فیلد و دکمه‌ها", () => {
    const out = form();
    for (const t of ["استان", "شهر", "نشانی کامل", "کدپستی", "ذخیره", "انصراف"])
      expect(out).toContain(t);
  });
  it("استان انتخابی و اسلات نقشه", () => {
    const out = form({
      values: { province: "تهران", city: "", street: "", postalCode: "" },
      map: <div>نقشه‌ی آزمایشی</div>,
    });
    expect(out).toContain("<select");
    expect(out).toContain("انتخاب استان");
    expect(out).toContain("نقشه‌ی آزمایشی");
  });
  it("خطاها و خطای کلی", () => {
    const out = form({
      errors: { province: "required", postalCode: "postalCode", street: "tooLong" },
      formError: "حداکثر می‌توانید ۲ آدرس ذخیره کنید.",
    });
    expect(out).toContain("این فیلد الزامی است.");
    expect(out).toContain("کدپستی باید ۱۰ رقم باشد.");
    expect(out).toContain("حداکثر ۱۰۰ حرف.");
    expect(out).toContain('role="alert"');
  });
});

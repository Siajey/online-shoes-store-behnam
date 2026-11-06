import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProfileFormView } from "./profile-form-view";

const html = (over: Partial<Parameters<typeof ProfileFormView>[0]> = {}) =>
  renderToStaticMarkup(
    <ProfileFormView
      values={{ firstName: "علی", lastName: "" }}
      onChange={() => {}}
      onSubmit={() => {}}
      pending={false}
      errors={{}}
      saved={false}
      {...over}
    />,
  );

describe("ProfileFormView", () => {
  it("دو فیلد با مقدار اولیه و دکمه‌ی ذخیره", () => {
    const out = html();
    expect(out).toContain("نام خانوادگی");
    expect(out).toContain('value="علی"');
    expect(out).toContain("ذخیره");
  });
  it("خطای هر فیلد با متن فارسی و عدد فارسی", () => {
    const out = html({ errors: { firstName: "required", lastName: "tooLong" } });
    expect(out).toContain("این فیلد الزامی است.");
    expect(out).toContain("حداکثر ۲۰ حرف.");
    expect(out).toContain('aria-invalid="true"');
  });
  it("پیام ذخیره‌شدن در ناحیه‌ی status و خطای کلی با alert", () => {
    expect(html({ saved: true })).toContain("اطلاعات شما ذخیره شد.");
    const out = html({ formError: "ارتباط برقرار نشد" });
    expect(out).toContain('role="alert"');
    expect(out).toContain("ارتباط برقرار نشد");
    expect(out).toContain('role="status"');
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { insightsCopy as t } from "../copy";
import { RefreshPanelView, type RefreshState } from "./refresh-panel-view";

const html = (state: RefreshState) =>
  renderToStaticMarkup(<RefreshPanelView state={state} onRefresh={() => {}} />);

describe("RefreshPanelView", () => {
  it("حالت اولیه: دکمه فعال", () => {
    const out = html({ status: "idle" });
    expect(out).toContain(t.cta);
    expect(out).not.toContain('disabled=""');
  });
  it("هنگام درخواست: دکمه غیرفعال و متن در حال انجام", () => {
    const out = html({ status: "loading" });
    expect(out).toContain('disabled=""');
    expect(out).toContain(t.running);
  });
  it("موفقیت: خلاصه نمایش داده می‌شود", () => {
    const out = html({
      status: "success",
      result: { windowDays: 30, products: 12, bestSellers: 10, popular: 10, durationMs: 1 },
    });
    expect(out).toContain("۱۲ محصول بررسی شد");
  });
  it("خطا: پیام نمایش داده می‌شود", () => {
    expect(html({ status: "error", message: t.inProgress })).toContain(t.inProgress);
  });
});

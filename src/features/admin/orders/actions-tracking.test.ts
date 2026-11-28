import { describe, expect, it } from "vitest";
import { adminActionsFor, buildAction, EMPTY_DRAFT } from "./actions";

describe("عملیات رهگیری ادمین", () => {
  it("در وضعیت ارسال‌شده اصلاح کد رهگیری و تحویل مجاز است", () => {
    expect(adminActionsFor("shipped")).toEqual(["updateTracking", "deliver"]);
  });

  it("ثبت ارسال فقط کد رهگیری را می‌فرستد", () => {
    const body = buildAction("ship", {
      ...EMPTY_DRAFT,
      carrier: "تیپاکس",
      trackingCode: " ABC1234567 ",
    });
    expect(body).toEqual({ action: "ship", trackingCode: "ABC1234567" });
  });

  it("ثبت ارسال بدون کد رهگیری مجاز است", () => {
    expect(buildAction("ship", EMPTY_DRAFT)).toEqual({ action: "ship" });
  });

  it("اصلاح رهگیری بدون کد نامعتبر است", () => {
    expect(buildAction("updateTracking", EMPTY_DRAFT)).toBeNull();
    expect(
      buildAction("updateTracking", { ...EMPTY_DRAFT, trackingCode: "X1", note: "اصلاح" }),
    ).toEqual({
      action: "updateTracking",
      trackingCode: "X1",
      note: "اصلاح",
    });
  });
});

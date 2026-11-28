import { describe, expect, it } from "vitest";
import { adminActionsFor, buildAction, EMPTY_DRAFT } from "./actions";

describe("admin order actions", () => {
  it("عملیات مجاز هر وضعیت طبق قرارداد", () => {
    expect(adminActionsFor("pending_payment")).toEqual([]);
    expect(adminActionsFor("paid")).toEqual(["startProcessing", "cancel"]);
    expect(adminActionsFor("processing")).toEqual(["ship", "cancel"]);
    expect(adminActionsFor("shipped")).toEqual(["updateTracking", "deliver"]);
    expect(adminActionsFor("delivered")).toEqual([]);
    expect(adminActionsFor("cancelled")).toEqual([]);
  });

  it("فیلد خالی فرستاده نمی‌شود", () => {
    expect(buildAction("deliver", EMPTY_DRAFT)).toEqual({ action: "deliver" });
    expect(buildAction("cancel", { ...EMPTY_DRAFT, note: " دلیل " })).toEqual({
      action: "cancel",
      note: "دلیل",
    });
  });

  it("ارسال با شرکت حمل و کد رهگیری", () => {
    expect(buildAction("ship", { carrier: "پست", trackingCode: "123", note: "" })).toEqual({
      action: "ship",
      trackingCode: "123",
    });
    expect(buildAction("ship", EMPTY_DRAFT)).toEqual({ action: "ship" });
  });

  it("فیلد بلندتر از سقف نامعتبر است", () => {
    expect(buildAction("deliver", { ...EMPTY_DRAFT, note: "x".repeat(501) })).toBeNull();
    expect(buildAction("ship", { ...EMPTY_DRAFT, trackingCode: "x".repeat(101) })).toBeNull();
  });
});

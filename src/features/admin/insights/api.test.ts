import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { refreshProductStats } from "./api";
import { IN_PROGRESS_CODE, insightsCopy, refreshErrorMessage } from "./copy";

vi.mock("@/lib/api", () => ({ api: { post: vi.fn() } }));

const result = { windowDays: 30, products: 12, bestSellers: 10, popular: 10, durationMs: 184 };

beforeEach(() => vi.mocked(api.post).mockReset());

describe("refreshProductStats", () => {
  it("endpoint درست را بدون بدنه می‌زند و data را برمی‌گرداند", async () => {
    vi.mocked(api.post).mockResolvedValue({
      code: "INSIGHTS_PRODUCT_STATS_REFRESH_SUCCESS",
      data: result,
    } as never);
    expect(await refreshProductStats()).toEqual(result);
    expect(vi.mocked(api.post).mock.calls[0]).toEqual(["/admin/insights/product-stats/refresh"]);
  });
});

describe("copy", () => {
  it("خلاصه‌ی نتیجه ارقام فارسی دارد", () => {
    expect(insightsCopy.summary(result)).toBe(
      "۱۲ محصول بررسی شد؛ ۱۰ پرفروش و ۱۰ محبوب (۳۰ روز اخیر)",
    );
  });
  it("۴۰۹ پیام «در حال انجام» می‌دهد و بقیه پیام عمومی", () => {
    expect(refreshErrorMessage(IN_PROGRESS_CODE)).toBe(insightsCopy.inProgress);
    expect(refreshErrorMessage("X")).toBe(insightsCopy.genericError);
    expect(refreshErrorMessage(undefined)).toBe(insightsCopy.genericError);
  });
});

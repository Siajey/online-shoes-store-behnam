import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { fetchShippingOptions } from "./api";

vi.mock("@/lib/api", () => ({ api: { get: vi.fn() } }));

describe("fetchShippingOptions", () => {
  beforeEach(() => vi.mocked(api.get).mockReset());

  it("آدرس را در query می‌فرستد و گزینه‌ها را تبدیل می‌کند", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        options: [
          {
            methodCode: "post",
            name: "پست",
            description: null,
            available: true,
            fee: 120_000,
            isFree: false,
            estimatedDays: { min: 3, max: 7 },
          },
          { methodCode: "express", name: "پیشتاز", description: null, available: false },
        ],
      },
    } as never);
    const options = await fetchShippingOptions("a b");
    expect(vi.mocked(api.get).mock.calls[0][0]).toBe("/shipping/options?addressId=a%20b");
    expect(options.map((o) => o.code)).toEqual(["post", "express"]);
    expect(options[0].fee).toBe(120_000);
    expect(options[1].available).toBe(false);
  });
});

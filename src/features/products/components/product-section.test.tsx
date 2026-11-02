import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/lib/api/errors";
import { fetchProducts } from "../api";
import { ProductSection } from "./product-section";

vi.mock("../api", () => ({ fetchProducts: vi.fn() }));

const render = async () => renderToStaticMarkup(await ProductSection({}));

describe("ProductSection", () => {
  beforeEach(() => {
    vi.mocked(fetchProducts).mockReset();
  });

  it("لیست محصولات را نشان می‌دهد", async () => {
    vi.mocked(fetchProducts).mockResolvedValue({
      items: [{ id: "1", name: "کتانی آبی", price: 2_190_000 }],
      nextCursor: null,
    });
    const out = await render();
    expect(out).toContain("کتانی آبی");
    expect(out).toContain("۲٬۱۹۰٬۰۰۰");
  });

  it("وقتی لیست خالی است، پیام خالی نشان می‌دهد", async () => {
    vi.mocked(fetchProducts).mockResolvedValue({ items: [], nextCursor: null });
    const out = await render();
    expect(out).toContain("هنوز محصولی ثبت نشده است.");
    expect(out).toContain('role="status"');
  });

  it("خطای API را به‌صورت alert با پیام همان خطا نشان می‌دهد", async () => {
    vi.mocked(fetchProducts).mockRejectedValue(
      new ApiRequestError({
        status: 0,
        code: "NETWORK_ERROR",
        message: "ارتباط با سرور برقرار نشد",
      }),
    );
    const out = await render();
    expect(out).toContain('role="alert"');
    expect(out).toContain("ارتباط با سرور برقرار نشد");
  });

  it("خطای ناشناخته پیام عمومی می‌دهد", async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error("boom internal detail"));
    const out = await render();
    expect(out).toContain('role="alert"');
    expect(out).not.toContain("boom");
  });
});

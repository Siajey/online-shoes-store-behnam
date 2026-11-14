import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { CartContent } from "./cart-content";

// سبد از authStore و آن از کلاینت API استفاده می‌کند که env می‌خواهد.
vi.mock("@/config/env", () => ({ env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" } }));

describe("CartContent", () => {
  it("روی سرور اسکلت نشان می‌دهد، نه «سبد خالی»", () => {
    const out = renderToStaticMarkup(<CartContent />);
    expect(out).toContain("در حال بارگذاری سبد خرید");
    expect(out).not.toContain("سبد خرید شما خالی است.");
  });
});

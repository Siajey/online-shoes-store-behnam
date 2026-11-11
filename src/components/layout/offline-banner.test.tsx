import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { errorCopy } from "@/features/errors/copy";
import { OfflineBanner, OfflineBannerView } from "./offline-banner";

describe("OfflineBanner", () => {
  it("آنلاین: چیزی نشان نمی‌دهد", () => {
    expect(renderToStaticMarkup(<OfflineBannerView online />)).toBe("");
  });
  it("آفلاین: پیام با role=status", () => {
    const out = renderToStaticMarkup(<OfflineBannerView online={false} />);
    expect(out).toContain('role="status"');
    expect(out).toContain(errorCopy.offline);
  });
  it("روی سرور نوار نشان داده نمی‌شود", () => {
    expect(renderToStaticMarkup(<OfflineBanner />)).toBe("");
  });
});

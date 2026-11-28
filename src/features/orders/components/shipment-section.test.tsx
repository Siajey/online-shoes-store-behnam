import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { OrderDetail } from "../types";
import { ShipmentSection } from "./shipment-section";

const base = {
  shippingMethod: { code: "post", name: "پست" },
  tracking: null,
} as unknown as OrderDetail;

const withTracking = (patch: Partial<NonNullable<OrderDetail["tracking"]>>): OrderDetail =>
  ({
    ...base,
    tracking: {
      carrier: "tipax",
      trackingCode: "ABC1234567",
      trackingUrl: null,
      autoTracked: true,
      status: "in_transit",
      deliveredAt: null,
      events: [],
      ...patch,
    },
  }) as OrderDetail;

describe("ShipmentSection", () => {
  it("بدون روش و رهگیری چیزی نشان نمی‌دهد", () => {
    const html = renderToStaticMarkup(
      <ShipmentSection
        order={{ shippingMethod: null, tracking: null } as unknown as OrderDetail}
      />,
    );
    expect(html).toBe("");
  });

  it("قبل از ارسال فقط روش ارسال را نشان می‌دهد", () => {
    const html = renderToStaticMarkup(<ShipmentSection order={base} />);
    expect(html).toContain("پست");
    expect(html).not.toContain("کد رهگیری");
  });

  it("کد رهگیری، وضعیت و رویدادها را نشان می‌دهد", () => {
    const html = renderToStaticMarkup(
      <ShipmentSection
        order={withTracking({
          events: [
            {
              status: "in_transit",
              description: "در مسیر",
              location: "تهران",
              at: "2026-11-24T11:00:00.000Z",
            },
          ],
        })}
      />,
    );
    expect(html).toContain("ABC1234567");
    expect(html).toContain("در مسیر ارسال");
    expect(html).toContain("تهران");
    expect(html).toContain("کپی کد");
  });

  it("لینک پیگیری فقط برای http(s) ساخته می‌شود", () => {
    const ok = renderToStaticMarkup(
      <ShipmentSection order={withTracking({ trackingUrl: "https://post.ir/t" })} />,
    );
    expect(ok).toContain('href="https://post.ir/t"');
    const bad = renderToStaticMarkup(
      <ShipmentSection order={withTracking({ trackingUrl: "javascript:alert(1)" })} />,
    );
    expect(bad).not.toContain("javascript:");
  });
});

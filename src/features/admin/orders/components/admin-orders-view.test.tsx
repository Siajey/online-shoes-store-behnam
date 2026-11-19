import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminOrdersListView } from "./admin-orders-view";

const noop = () => {};

describe("AdminOrdersListView", () => {
  it("بدون نتیجه پیام خالی", () => {
    const out = renderToStaticMarkup(
      <AdminOrdersListView
        state={{ status: "ready", items: [], hasMore: false }}
        loadingMore={false}
        onLoadMore={noop}
      />,
    );
    expect(out).toContain("سفارشی با این فیلترها پیدا نشد");
  });

  it("ردیف سفارش با لینک جزئیات و وضعیت", () => {
    const out = renderToStaticMarkup(
      <AdminOrdersListView
        state={{
          status: "ready",
          hasMore: true,
          items: [
            {
              id: "o1",
              orderNumber: 1001,
              status: "paid",
              itemCount: 1,
              total: 500000,
              createdAt: "2026-11-16T10:30:00.000Z",
              paidAt: null,
              customer: "علی رضایی",
            },
          ],
        }}
        loadingMore={false}
        onLoadMore={noop}
      />,
    );
    expect(out).toContain('href="/admin/orders/o1"');
    expect(out).toContain("پرداخت‌شده");
    expect(out).toContain("علی رضایی");
    expect(out).toContain("نمایش بیشتر");
  });
});

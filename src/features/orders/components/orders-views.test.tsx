import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OrdersListView } from "./orders-list-view";

describe("OrdersListView", () => {
  it("بدون سفارش پیام خالی و لینک خرید", () => {
    const out = renderToStaticMarkup(
      <OrdersListView orders={[]} hasMore={false} loadingMore={false} onLoadMore={() => {}} />,
    );
    expect(out).toContain("هنوز سفارشی ثبت نکرده‌اید");
    expect(out).toContain('href="/products"');
  });

  it("کارت سفارش با لینک جزئیات و دکمه‌ی بیشتر", () => {
    const out = renderToStaticMarkup(
      <OrdersListView
        orders={[
          {
            id: "o1",
            orderNumber: 1001,
            status: "paid",
            itemCount: 2,
            total: 1250000,
            createdAt: "2026-11-16T10:30:00.000Z",
            paidAt: null,
          },
        ]}
        hasMore
        loadingMore={false}
        onLoadMore={() => {}}
      />,
    );
    expect(out).toContain('href="/account/orders/o1"');
    expect(out).toContain("پرداخت‌شده");
    expect(out).toContain("نمایش سفارش‌های بیشتر");
  });
});

"use client";

import { useEffect, useState } from "react";
import { adminListOrders, type AdminOrdersQuery } from "@/features/orders/api";
import { orderMessage } from "@/features/orders/errors";
import type { OrderStatus } from "@/features/orders/types";
import { adminOrdersCopy as t } from "../copy";
import {
  AdminOrdersListView,
  OrdersFilterBar,
  type OrdersListViewProps,
} from "./admin-orders-view";

const toQuery = (
  status: OrderStatus | undefined,
  orderNumber: number | undefined,
  from: string,
  to: string,
): AdminOrdersQuery => ({
  statuses: status ? [status] : undefined,
  orderNumber,
  from: from || undefined,
  to: to || undefined,
});

export function AdminOrdersContent() {
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [number, setNumber] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  /** فیلترهای اعمال‌شده (با زدن «جستجو»)؛ وضعیت فوراً اعمال می‌شود. */
  const [applied, setApplied] = useState<{ number?: number; from: string; to: string }>({
    from: "",
    to: "",
  });
  const [error, setError] = useState<string | undefined>();
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<OrdersListViewProps["state"]>({ status: "loading" });
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    adminListOrders(toQuery(status, applied.number, applied.from, applied.to))
      .then((page) => {
        if (cancelled) return;
        setCursor(page.nextCursor);
        setState({ status: "ready", items: page.items, hasMore: page.nextCursor !== null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({
          status: "error",
          message: orderMessage(e, t.loadError),
          onRetry: () => {
            setState({ status: "loading" });
            setReloadKey((k) => k + 1);
          },
        });
      });
    return () => {
      cancelled = true;
    };
  }, [status, applied, reloadKey]);

  function search() {
    const trimmed = number.trim();
    let n: number | undefined;
    if (trimmed) {
      n = Number(trimmed);
      if (!Number.isInteger(n) || n < 0) {
        setError(t.invalidNumber);
        return;
      }
    }
    if (from && to && from > to) {
      setError(t.invalidRange);
      return;
    }
    setError(undefined);
    setState({ status: "loading" });
    setApplied({ number: n, from, to });
  }

  function clear() {
    setStatus(undefined);
    setNumber("");
    setFrom("");
    setTo("");
    setError(undefined);
    setState({ status: "loading" });
    setApplied({ from: "", to: "" });
  }

  async function loadMore() {
    if (!cursor || state.status !== "ready") return;
    setLoadingMore(true);
    try {
      const page = await adminListOrders({
        ...toQuery(status, applied.number, applied.from, applied.to),
        cursor,
      });
      setCursor(page.nextCursor);
      setState((s) =>
        s.status === "ready"
          ? { ...s, items: [...s.items, ...page.items], hasMore: page.nextCursor !== null }
          : s,
      );
    } catch (e) {
      setError(orderMessage(e, t.loadError));
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <OrdersFilterBar
        status={status}
        orderNumber={number}
        from={from}
        to={to}
        error={error}
        onStatus={(v) => {
          setState({ status: "loading" });
          setStatus(v);
        }}
        onOrderNumber={setNumber}
        onFrom={setFrom}
        onTo={setTo}
        onSearch={search}
        onClear={clear}
      />
      <AdminOrdersListView
        state={state}
        loadingMore={loadingMore}
        onLoadMore={() => void loadMore()}
      />
    </div>
  );
}

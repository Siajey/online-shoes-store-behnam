"use client";

import { useCallback, useEffect, useState } from "react";
import { StateMessage } from "@/components/ui/state-message";
import { authStore } from "@/features/auth/auth-store";
import { AccountError } from "@/features/auth/components/account-views";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { Button } from "@/components/ui/button";
import { listOrders } from "../api";
import { ordersCopy as t } from "../copy";
import { orderMessage } from "../errors";
import type { OrderSummary } from "../types";
import { OrdersListView, OrdersSkeleton } from "./orders-list-view";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orders: OrderSummary[]; next: string | null };

/** «سفارش‌های من»؛ صفحه‌بندی با نشانگر (cursor). مهمان به /login می‌رود. */
export function OrdersContent() {
  const auth = useRequireAuth("/account/orders");
  const authed = auth.status === "authenticated";
  const [state, setState] = useState<State>({ status: "loading" });
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    listOrders()
      .then((page) => {
        if (!cancelled) setState({ status: "ready", orders: page.items, next: page.nextCursor });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState({ status: "error", message: orderMessage(e, t.listError) });
      });
    return () => {
      cancelled = true;
    };
  }, [authed, reloadKey]);

  const loadMore = useCallback(async () => {
    if (state.status !== "ready" || !state.next) return;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const page = await listOrders(state.next);
      setState((s) =>
        s.status === "ready"
          ? { status: "ready", orders: [...s.orders, ...page.items], next: page.nextCursor }
          : s,
      );
    } catch (e) {
      setMoreError(orderMessage(e, t.listError));
    } finally {
      setLoadingMore(false);
    }
  }, [state]);

  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  if (!authed || state.status === "loading") return <OrdersSkeleton />;
  if (state.status === "error") {
    return (
      <StateMessage tone="error">
        <p>{state.message}</p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => {
            setState({ status: "loading" });
            setReloadKey((k) => k + 1);
          }}
        >
          {t.retry}
        </Button>
      </StateMessage>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <OrdersListView
        orders={state.orders}
        hasMore={state.next !== null}
        loadingMore={loadingMore}
        onLoadMore={() => void loadMore()}
      />
      {moreError && (
        <p role="alert" className="text-danger text-center text-sm">
          {moreError}
        </p>
      )}
    </div>
  );
}

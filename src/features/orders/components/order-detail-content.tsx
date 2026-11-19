"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { authStore } from "@/features/auth/auth-store";
import { AccountError } from "@/features/auth/components/account-views";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { cancelOrder, getOrder } from "../api";
import { ordersCopy as t } from "../copy";
import { isNotFound, orderMessage } from "../errors";
import type { OrderDetail } from "../types";
import { OrderDetailView } from "./order-detail-view";
import { OrdersSkeleton } from "./orders-list-view";

type State =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "error"; message: string }
  | { status: "ready"; order: OrderDetail };

/** جزئیات یک سفارش با امکان به‌روزرسانی و لغو (فقط در انتظار پرداخت). باید داخل Suspense باشد. */
export function OrderDetailContent({ id }: { id: string }) {
  const auth = useRequireAuth(`/account/orders/${id}`);
  const authed = auth.status === "authenticated";
  const justPlaced = useSearchParams().get("placed") === "1";
  const [state, setState] = useState<State>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    getOrder(id)
      .then((order) => {
        if (!cancelled) setState({ status: "ready", order });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState(
          isNotFound(e)
            ? { status: "notFound" }
            : { status: "error", message: orderMessage(e, t.detailError) },
        );
      });
    return () => {
      cancelled = true;
    };
  }, [authed, id, reloadKey]);

  const reload = useCallback(() => {
    setActionError(null);
    setConfirming(false);
    setReloadKey((k) => k + 1);
  }, []);

  const confirmCancel = useCallback(async () => {
    setCancelling(true);
    setActionError(null);
    try {
      const order = await cancelOrder(id);
      setState({ status: "ready", order });
      setConfirming(false);
    } catch (e) {
      setActionError(orderMessage(e, t.cancelFailed));
    } finally {
      setCancelling(false);
    }
  }, [id]);

  if (auth.status === "error") {
    return <AccountError message={auth.error} onRetry={() => void authStore.refresh()} />;
  }
  if (!authed || state.status === "loading") return <OrdersSkeleton />;
  if (state.status === "notFound") {
    return (
      <StateMessage>
        <p className="text-fg text-base font-medium">{t.notFound}</p>
        <Link href="/account/orders" className={buttonVariants({ className: "mt-5" })}>
          {t.backToList}
        </Link>
      </StateMessage>
    );
  }
  if (state.status === "error") {
    return (
      <StateMessage tone="error">
        <p>{state.message}</p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => {
            setState({ status: "loading" });
            reload();
          }}
        >
          {t.retry}
        </Button>
      </StateMessage>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/account/orders"
        className="text-brand self-start text-sm underline underline-offset-4"
      >
        {t.backToList}
      </Link>
      <OrderDetailView
        order={state.order}
        justPlaced={justPlaced}
        cancelling={cancelling}
        confirmingCancel={confirming}
        actionError={actionError}
        onAskCancel={() => setConfirming(true)}
        onAbortCancel={() => setConfirming(false)}
        onConfirmCancel={() => void confirmCancel()}
        onRefresh={reload}
      />
    </div>
  );
}

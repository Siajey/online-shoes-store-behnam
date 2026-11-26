"use client";

import { useEffect, useState } from "react";
import { adminOrderPayments } from "../api";
import { paymentsCopy as t } from "../copy";
import { paymentMessage } from "../errors";
import { AdminPaymentsView, type AdminPaymentsState } from "./admin-payments-view";

/** فهرست پرداخت‌های یک سفارش در پنل ادمین. */
export function AdminPaymentsPanel({ orderId }: { orderId: string }) {
  const [state, setState] = useState<AdminPaymentsState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminOrderPayments(orderId)
      .then((items) => {
        if (!cancelled) setState({ status: "ready", items });
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({ status: "error", message: paymentMessage(e, t.admin.loadError) });
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, reloadKey]);

  return (
    <AdminPaymentsView
      state={state}
      onRetry={() => {
        setState({ status: "loading" });
        setReloadKey((k) => k + 1);
      }}
    />
  );
}

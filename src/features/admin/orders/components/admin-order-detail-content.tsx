"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { adminGetOrder, adminUpdateOrderStatus } from "@/features/orders/api";
import { isNotFound, orderMessage } from "@/features/orders/errors";
import type { OrderDetail } from "@/features/orders/types";
import { buildAction, EMPTY_DRAFT, type ActionDraft, type AdminOrderActionKind } from "../actions";
import { adminOrdersCopy as t } from "../copy";
import { AdminOrderDetailView, type DetailViewProps } from "./admin-order-detail-view";

type State =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "error"; message: string }
  | { status: "ready"; order: OrderDetail };

export function AdminOrderDetailContent({ id }: { id: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<AdminOrderActionKind | null>(null);
  const [draft, setDraft] = useState<ActionDraft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<DetailViewProps["message"]>(null);

  useEffect(() => {
    let cancelled = false;
    adminGetOrder(id)
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
  }, [id, reloadKey]);

  async function submit() {
    if (!selected) return;
    const body = buildAction(selected, draft);
    if (!body) {
      setMessage({ tone: "error", text: t.invalidForm });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const order = await adminUpdateOrderStatus(id, body);
      setState({ status: "ready", order });
      setSelected(null);
      setDraft(EMPTY_DRAFT);
      setMessage({ tone: "ok", text: t.actionDone });
    } catch (e) {
      setMessage({ tone: "error", text: orderMessage(e, t.actionFailed) });
    } finally {
      setSubmitting(false);
    }
  }

  if (state.status === "loading") {
    return (
      <div role="status" aria-busy="true">
        <span className="sr-only">{t.loading}</span>
        <div
          aria-hidden="true"
          className="rounded-card bg-surface h-40 animate-pulse motion-reduce:animate-none"
        />
      </div>
    );
  }
  if (state.status === "notFound") return <StateMessage>{t.notFound}</StateMessage>;
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
    <AdminOrderDetailView
      order={state.order}
      selected={selected}
      draft={draft}
      submitting={submitting}
      message={message}
      onSelect={(a) => {
        setSelected(a);
        setMessage(null);
      }}
      onDraft={(patch) => setDraft((d) => ({ ...d, ...patch }))}
      onSubmit={() => void submit()}
    />
  );
}

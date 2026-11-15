"use client";

import { useEffect, useState } from "react";
import { offerCopy as c } from "../copy";
import { couponsApi, discountsApi, type OfferFilter } from "../api";
import { offerErrorMessage } from "../errors";
import { offerRow } from "../format";
import type { AdminCoupon, AdminDiscount, OfferKind } from "../types";
import { OffersListView, type ActiveFilter, type OffersListState } from "./offers-list-view";

const PAGE_SIZE = 20;

const config = {
  discount: { api: discountsApi, base: "/admin/discounts" },
  coupon: { api: couponsApi, base: "/admin/coupons" },
} as const;

const rowsOf = (items: readonly (AdminDiscount | AdminCoupon)[]) => items.map(offerRow);

const toFilter = (f: ActiveFilter): OfferFilter =>
  f === "all" ? {} : { isActive: f === "active" };

/** فهرست تخفیف‌ها یا کوپن‌ها با فیلتر وضعیت، فعال/غیرفعال‌سازی و حذف. */
export function OffersContent({ kind }: { kind: OfferKind }) {
  const cfg = config[kind];
  const [filter, setFilter] = useState<ActiveFilter>("all");
  const [state, setState] = useState<OffersListState>({ status: "loading" });
  const [cursor, setCursor] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  // وضعیت واقعی هر ردیف برای فعال/غیرفعال‌سازی
  const [actives, setActives] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    cfg.api
      .list(toFilter(filter), { limit: PAGE_SIZE })
      .then((page) => {
        if (cancelled) return;
        setCursor(page.nextCursor);
        const rows = rowsOf(page.items as (AdminDiscount | AdminCoupon)[]);
        setActives(Object.fromEntries(rows.map((r) => [r.id, r.active])));
        setState({ status: "ready", items: rows, hasMore: page.nextCursor !== null });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState({ status: "error", message: offerErrorMessage(e, c.loadError) });
      });
    return () => {
      cancelled = true;
    };
  }, [cfg, filter, reloadKey]);

  function restart() {
    setState({ status: "loading" });
    setActionError(undefined);
    setConfirmingId(null);
    setReloadKey((k) => k + 1);
  }

  async function loadMore() {
    if (!cursor || state.status !== "ready") return;
    setLoadingMore(true);
    try {
      const page = await cfg.api.list(toFilter(filter), { cursor, limit: PAGE_SIZE });
      const rows = rowsOf(page.items as (AdminDiscount | AdminCoupon)[]);
      setCursor(page.nextCursor);
      setActives((a) => ({ ...a, ...Object.fromEntries(rows.map((r) => [r.id, r.active])) }));
      setState({
        status: "ready",
        items: [...state.items, ...rows.filter((r) => !state.items.some((i) => i.id === r.id))],
        hasMore: page.nextCursor !== null,
      });
    } catch (e) {
      setActionError(offerErrorMessage(e, c.loadError));
    } finally {
      setLoadingMore(false);
    }
  }

  async function toggle(id: string) {
    if (state.status !== "ready") return;
    setBusyId(id);
    setActionError(undefined);
    const next = !actives[id];
    try {
      await cfg.api.update(id, { isActive: next });
      setActives((a) => ({ ...a, [id]: next }));
      const items = state.items
        .map((r) => (r.id === id ? { ...r, active: next } : r))
        .filter((r) => filter === "all" || (filter === "active") === r.active);
      setState({ status: "ready", items, hasMore: state.hasMore });
    } catch (e) {
      setActionError(offerErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }

  async function remove() {
    if (!confirmingId || state.status !== "ready") return;
    const id = confirmingId;
    setBusyId(id);
    setActionError(undefined);
    try {
      await cfg.api.remove(id);
      setState({
        status: "ready",
        items: state.items.filter((r) => r.id !== id),
        hasMore: state.hasMore,
      });
      setConfirmingId(null);
    } catch (e) {
      setActionError(offerErrorMessage(e));
      setConfirmingId(null);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <OffersListView
      kind={kind}
      state={state}
      filter={filter}
      newHref={`${cfg.base}/new`}
      editHref={(id) => `${cfg.base}/${id}`}
      busyId={busyId}
      confirmingId={confirmingId}
      actionError={actionError}
      loadingMore={loadingMore}
      onFilter={(f) => {
        setFilter(f);
        restart();
      }}
      onToggle={(id) => void toggle(id)}
      onAskDelete={(id) => {
        setActionError(undefined);
        setConfirmingId(id);
      }}
      onConfirmDelete={() => void remove()}
      onCancelDelete={() => setConfirmingId(null)}
      onRetry={restart}
      onLoadMore={() => void loadMore()}
    />
  );
}

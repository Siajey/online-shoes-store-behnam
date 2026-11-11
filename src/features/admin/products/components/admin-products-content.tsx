"use client";

import { useEffect, useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { changeProductStatus, fetchAdminProducts } from "../api";
import { adminProductsCopy as t } from "../copy";
import type { AdminProduct, ProductStatus, StatusAction } from "../types";
import { FilterBar, ProductListView, type ListViewProps } from "./admin-products-view";

const PAGE_SIZE = 20;
const messageOf = (e: unknown, fallback: string) => (isApiRequestError(e) ? e.message : fallback);

type Data = { items: AdminProduct[]; nextCursor: string | null };

export function AdminProductsContent() {
  const [status, setStatus] = useState<ProductStatus | undefined>();
  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<ListViewProps["state"]>({ status: "loading" });
  const [data, setData] = useState<Data>({ items: [], nextCursor: null });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAdminProducts({ status, q: query, limit: PAGE_SIZE })
      .then((page) => {
        if (cancelled) return;
        setData(page);
        setState({ status: "ready", items: page.items, hasMore: page.nextCursor !== null });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState({ status: "error", message: messageOf(e, t.loadError) });
      });
    return () => {
      cancelled = true;
    };
  }, [status, query, reloadKey]);

  function restart() {
    setState({ status: "loading" });
    setActionError(undefined);
    setReloadKey((k) => k + 1);
  }

  function changeStatus(next: ProductStatus | undefined) {
    setStatus(next);
    restart();
  }

  function search() {
    setQuery(draftQuery.trim());
    restart();
  }

  async function loadMore() {
    if (!data.nextCursor) return;
    setLoadingMore(true);
    try {
      const page = await fetchAdminProducts({
        status,
        q: query,
        cursor: data.nextCursor,
        limit: PAGE_SIZE,
      });
      const items = [...data.items, ...page.items];
      setData({ items, nextCursor: page.nextCursor });
      setState({ status: "ready", items, hasMore: page.nextCursor !== null });
    } catch (e) {
      setActionError(messageOf(e, t.loadError));
    } finally {
      setLoadingMore(false);
    }
  }

  async function onAction(id: string, action: StatusAction) {
    setBusyId(id);
    setActionError(undefined);
    try {
      applyStatus(id, await changeProductStatus(id, action));
    } catch (e) {
      setActionError(isApiRequestError(e) ? e.message : t.actionError);
    } finally {
      setBusyId(null);
    }
  }

  function applyStatus(id: string, next: ProductStatus) {
    // وقتی فیلتر وضعیت فعال است، محصولی که دیگر مطابق آن نیست از فهرست برداشته می‌شود.
    const items = data.items
      .map((p) => (p.id === id ? { ...p, status: next } : p))
      .filter((p) => !status || p.status === status);
    setData({ ...data, items });
    setState({ status: "ready", items, hasMore: data.nextCursor !== null });
  }

  return (
    <section aria-labelledby="admin-products-title" className="flex flex-col gap-6">
      <div>
        <h2 id="admin-products-title" className="text-xl font-medium">
          {t.title}
        </h2>
        <p className="text-fg-muted mt-1 text-sm">{t.createSoon}</p>
      </div>
      <FilterBar
        status={status}
        onStatus={changeStatus}
        query={draftQuery}
        onQuery={setDraftQuery}
        onSearch={search}
      />
      <ProductListView
        state={state}
        busyId={busyId}
        actionError={actionError}
        loadingMore={loadingMore}
        onAction={(id, a) => void onAction(id, a)}
        onRetry={restart}
        onLoadMore={() => void loadMore()}
      />
    </section>
  );
}

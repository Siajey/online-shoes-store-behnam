"use client";

import { useEffect, useState } from "react";
import { normalizePhone } from "@/features/auth/phone";
import { useAuth } from "@/features/auth/use-auth";
import { isApiRequestError } from "@/lib/api/errors";
import { countAdminUsers, fetchAdminUsers, updateAdminUser } from "../api";
import { adminUsersCopy as t } from "../copy";
import { actionPatch, needsConfirm, type UserAction } from "../labels";
import type { AdminUser, UserFilters, UserRole, UserStatus } from "../types";
import { UsersFilterBar, UsersListView, type UsersListViewProps } from "./admin-users-view";

const PAGE_SIZE = 20;
const messageOf = (e: unknown, fallback: string) => (isApiRequestError(e) ? e.message : fallback);

export function AdminUsersContent() {
  const auth = useAuth();
  const selfId = auth.user?.id;

  const [role, setRole] = useState<UserRole | undefined>();
  const [status, setStatus] = useState<UserStatus | undefined>();
  const [phone, setPhone] = useState("");
  const [phoneFilter, setPhoneFilter] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [reloadKey, setReloadKey] = useState(0);

  const [state, setState] = useState<UsersListViewProps["state"]>({ status: "loading" });
  const [cursor, setCursor] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<{ id: string; action: UserAction } | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);

  const filters: UserFilters = { role, status, phoneNumber: phoneFilter };

  useEffect(() => {
    let cancelled = false;
    const f: UserFilters = { role, status, phoneNumber: phoneFilter };
    Promise.all([fetchAdminUsers(f, { limit: PAGE_SIZE }), countAdminUsers(f).catch(() => null)])
      .then(([page, count]) => {
        if (cancelled) return;
        setCursor(page.nextCursor);
        setTotal(count);
        setState({ status: "ready", items: page.items, hasMore: page.nextCursor !== null });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState({ status: "error", message: messageOf(e, t.loadError) });
      });
    return () => {
      cancelled = true;
    };
  }, [role, status, phoneFilter, reloadKey]);

  function restart() {
    setState({ status: "loading" });
    setActionError(undefined);
    setConfirming(null);
    setReloadKey((k) => k + 1);
  }

  function search() {
    if (phone.trim() === "") {
      setPhoneError(undefined);
      setPhoneFilter(undefined);
      restart();
      return;
    }
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setPhoneError(t.phoneInvalid);
      return;
    }
    setPhoneError(undefined);
    setPhoneFilter(normalized);
    restart();
  }

  async function loadMore() {
    if (!cursor || state.status !== "ready") return;
    setLoadingMore(true);
    try {
      const page = await fetchAdminUsers(filters, { cursor, limit: PAGE_SIZE });
      const items = [...state.items, ...page.items];
      setCursor(page.nextCursor);
      setState({ status: "ready", items, hasMore: page.nextCursor !== null });
    } catch (e) {
      setActionError(messageOf(e, t.loadError));
    } finally {
      setLoadingMore(false);
    }
  }

  async function run(id: string, action: UserAction) {
    if (state.status !== "ready") return;
    setBusyId(id);
    setActionError(undefined);
    try {
      const patch = actionPatch(action);
      await updateAdminUser(id, patch);
      const items = state.items
        .map((u): AdminUser => (u.id === id ? { ...u, ...patch } : u))
        .filter((u) => (!role || u.role === role) && (!status || u.status === status));
      setState({ status: "ready", items, hasMore: state.hasMore });
    } catch (e) {
      setActionError(messageOf(e, t.actionError));
    } finally {
      setBusyId(null);
      setConfirming(null);
    }
  }

  function onAction(id: string, action: UserAction) {
    if (needsConfirm(action)) setConfirming({ id, action });
    else void run(id, action);
  }

  return (
    <section aria-labelledby="admin-users-title" className="flex flex-col gap-6">
      <h2 id="admin-users-title" className="text-xl font-medium">
        {t.title}
      </h2>
      <UsersFilterBar
        role={role}
        status={status}
        phone={phone}
        phoneError={phoneError}
        total={total}
        onRole={(v) => {
          setRole(v);
          restart();
        }}
        onStatus={(v) => {
          setStatus(v);
          restart();
        }}
        onPhone={setPhone}
        onSearch={search}
        onClear={() => {
          setPhone("");
          setPhoneError(undefined);
          setPhoneFilter(undefined);
          restart();
        }}
      />
      <UsersListView
        state={state}
        selfId={selfId}
        busyId={busyId}
        confirming={confirming}
        actionError={actionError}
        loadingMore={loadingMore}
        onAction={onAction}
        onConfirm={() => confirming && void run(confirming.id, confirming.action)}
        onCancelConfirm={() => setConfirming(null)}
        onRetry={restart}
        onLoadMore={() => void loadMore()}
      />
    </section>
  );
}

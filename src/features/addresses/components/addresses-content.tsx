"use client";

import { useEffect, useState } from "react";
import { StateMessage } from "@/components/ui/state-message";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/features/auth/use-require-auth";
import { isApiRequestError } from "@/lib/api/errors";
import {
  createAddress,
  deleteAddress,
  listAddresses,
  setDefaultAddress,
  updateAddress,
} from "../api";
import { addressCopy } from "../copy";
import type { Address, AddressInput } from "../types";
import { validateAddress, type AddressErrors } from "../validation";
import { AddressCard, AddressFormView, AddressListView } from "./address-views";

type List =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: Address[] };

type Mode = { kind: "list" } | { kind: "add" } | { kind: "edit"; id: string };

const EMPTY: AddressInput = { province: "", city: "", street: "", postalCode: "" };
const message = (e: unknown) => (isApiRequestError(e) ? e.message : addressCopy.loadError);

function Skeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-3 md:grid-cols-2">
      <span className="sr-only">{addressCopy.loading}</span>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="rounded-card bg-surface h-36 animate-pulse motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

/** صفحه‌ی آدرس‌ها: بعد از هر تغییر، فهرست از سرور دوباره خوانده می‌شود (منبع حقیقت بک‌اند است). */
export function AddressesContent() {
  const auth = useRequireAuth("/account/addresses");
  const [list, setList] = useState<List>({ status: "loading" });
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [values, setValues] = useState<AddressInput>(EMPTY);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | undefined>();

  // رقم تازه‌خوانی؛ با هر تغییر، فهرست دوباره از سرور خوانده می‌شود.
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    let cancelled = false;
    listAddresses()
      .then((items) => {
        if (!cancelled) setList({ status: "ready", items });
      })
      .catch((e: unknown) => {
        if (!cancelled) setList({ status: "error", message: message(e) });
      });
    return () => {
      cancelled = true;
    };
  }, [auth.status, reloadKey]);

  function openForm(next: Mode, initial: AddressInput) {
    setMode(next);
    setValues(initial);
    setErrors({});
    setFormError(undefined);
  }

  async function submit() {
    const result = validateAddress(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setFormError(undefined);
    setPending(true);
    try {
      if (mode.kind === "edit") await updateAddress(mode.id, result.value);
      else await createAddress(result.value);
      setMode({ kind: "list" });
      reload();
    } catch (e) {
      // شامل خطای سقف ۲ آدرس (۴۰۹) با پیام فارسی خود بک‌اند
      setFormError(message(e));
    } finally {
      setPending(false);
    }
  }

  async function run(id: string, action: () => Promise<unknown>) {
    setBusyId(id);
    setActionError(undefined);
    try {
      await action();
      setRemoving(null);
      reload();
    } catch (e) {
      setActionError(message(e));
    } finally {
      setBusyId(null);
    }
  }

  if (auth.status === "error") {
    return <StateMessage tone="error">{auth.error}</StateMessage>;
  }
  if (auth.status !== "authenticated" || list.status === "loading") return <Skeleton />;
  if (list.status === "error") {
    return (
      <StateMessage tone="error">
        <p>{list.message}</p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => {
            setList({ status: "loading" });
            reload();
          }}
        >
          {addressCopy.retry}
        </Button>
      </StateMessage>
    );
  }

  if (mode.kind !== "list") {
    return (
      <AddressFormView
        title={mode.kind === "edit" ? addressCopy.editTitle : addressCopy.addTitle}
        values={values}
        onChange={setValues}
        onSubmit={submit}
        onCancel={() => setMode({ kind: "list" })}
        pending={pending}
        errors={errors}
        formError={formError}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {actionError && (
        <p role="alert" className="text-danger text-sm">
          {actionError}
        </p>
      )}
      <AddressListView
        addresses={list.items}
        onAdd={() => openForm({ kind: "add" }, EMPTY)}
        renderCard={(a) => (
          <AddressCard
            key={a.id}
            address={a}
            busy={busyId === a.id}
            confirmingRemove={removing === a.id}
            onEdit={() =>
              openForm(
                { kind: "edit", id: a.id },
                { province: a.province, city: a.city, street: a.street, postalCode: a.postalCode },
              )
            }
            onMakeDefault={() => void run(a.id, () => setDefaultAddress(a.id))}
            onAskRemove={() => setRemoving(a.id)}
            onConfirmRemove={() => void run(a.id, () => deleteAddress(a.id))}
            onCancelRemove={() => setRemoving(null)}
          />
        )}
      />
    </div>
  );
}

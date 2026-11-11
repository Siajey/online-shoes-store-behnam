"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";
import { isApiRequestError } from "@/lib/api/errors";
import { createBrand, deleteBrand, fetchAdminBrands, updateBrand } from "../api";
import { taxonomyCopy as t } from "../copy";
import type { AdminBrand, BrandInput } from "../types";
import { validateBrand, type Errors } from "../validation";
import { BrandForm, BrandList } from "./brand-views";

type List =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; items: AdminBrand[] };
type Mode = { kind: "list" } | { kind: "add" } | { kind: "edit"; id: string };

const EMPTY: BrandInput = { name: "", slug: "", logoKey: "" };
const messageOf = (e: unknown, fallback: string) => (isApiRequestError(e) ? e.message : fallback);

export function BrandsContent() {
  const [list, setList] = useState<List>({ status: "loading" });
  const [mode, setMode] = useState<Mode>({ kind: "list" });
  const [values, setValues] = useState<BrandInput>(EMPTY);
  const [errors, setErrors] = useState<Errors<BrandInput>>({});
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string>();
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    fetchAdminBrands()
      .then((items) => {
        if (!cancelled) setList({ status: "ready", items });
      })
      .catch((e: unknown) => {
        if (!cancelled) setList({ status: "error", message: messageOf(e, t.loadError) });
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function openForm(next: Mode, initial: BrandInput) {
    setMode(next);
    setValues(initial);
    setErrors({});
    setFormError(undefined);
    setActionError(undefined);
    setConfirmingId(null);
  }

  async function submit() {
    const result = validateBrand(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setFormError(undefined);
    setPending(true);
    try {
      if (mode.kind === "edit") await updateBrand(mode.id, result.value);
      else await createBrand(result.value);
      setMode({ kind: "list" });
      reload();
    } catch (e) {
      setFormError(messageOf(e, t.saveError));
    } finally {
      setPending(false);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    setActionError(undefined);
    try {
      await deleteBrand(id);
      setConfirmingId(null);
      reload();
    } catch (e) {
      setActionError(messageOf(e, t.deleteError));
      setConfirmingId(null);
    } finally {
      setBusyId(null);
    }
  }

  if (list.status === "loading") return <StateMessage>{t.loading}</StateMessage>;
  if (list.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4">
        <StateMessage tone="error" className="w-full">
          {list.message}
        </StateMessage>
        <Button
          variant="secondary"
          onClick={() => {
            setList({ status: "loading" });
            reload();
          }}
        >
          {t.retry}
        </Button>
      </div>
    );
  }

  return (
    <section aria-labelledby="admin-brands-title" className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 id="admin-brands-title" className="text-xl font-medium">
          {t.brands.title}
        </h2>
        {mode.kind === "list" && (
          <Button onClick={() => openForm({ kind: "add" }, EMPTY)}>{t.brands.add}</Button>
        )}
      </div>
      {mode.kind !== "list" ? (
        <BrandForm
          editingId={mode.kind === "edit" ? mode.id : null}
          values={values}
          errors={errors}
          formError={formError}
          pending={pending}
          onChange={setValues}
          onSubmit={() => void submit()}
          onCancel={() => setMode({ kind: "list" })}
        />
      ) : (
        <>
          {actionError && <StateMessage tone="error">{actionError}</StateMessage>}
          <BrandList
            brands={list.items}
            confirmingId={confirmingId}
            busyId={busyId}
            onEdit={(b) =>
              openForm(
                { kind: "edit", id: b.id },
                { name: b.name, slug: b.slug, logoKey: b.logoKey ?? "" },
              )
            }
            onAskDelete={setConfirmingId}
            onConfirmDelete={(id) => void remove(id)}
            onCancel={() => setConfirmingId(null)}
          />
        </>
      )}
    </section>
  );
}

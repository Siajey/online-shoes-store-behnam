import Link from "next/link";
import { useId, type FormEvent, type ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/cn";
import { offerCopy as c, offerCopyOf } from "../copy";
import { MAX_NAME, type OfferErrors, type OfferFormInput } from "../form";
import { DISCOUNT_KINDS, SCOPE_TYPES, type OfferKind, type ScopeType } from "../types";

export type OfferFormViewProps = {
  kind: OfferKind;
  mode: "create" | "edit";
  values: OfferFormInput;
  errors: OfferErrors;
  categories: readonly SelectOption[];
  brands: readonly SelectOption[];
  pending: boolean;
  formError?: string;
  backHref: string;
  /** کارت آمار استفاده (فقط ویرایش کوپن) */
  usage?: ReactNode;
  onChange: (values: OfferFormInput) => void;
  onSubmit: () => void;
};

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card bg-surface flex flex-col gap-4 p-5 lg:p-6">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}

const err = (e: OfferErrors[keyof OfferErrors]) => (e ? c.errors[e] : undefined);

function Check({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-brand size-5"
      />
      {label}
    </label>
  );
}

function TargetPicker({
  options,
  selected,
  error,
  disabled,
  onChange,
}: {
  options: readonly SelectOption[];
  selected: readonly string[];
  error?: string;
  disabled: boolean;
  onChange: (ids: string[]) => void;
}) {
  const legendId = useId();
  return (
    <fieldset
      aria-labelledby={legendId}
      aria-invalid={error ? true : undefined}
      className="flex flex-col gap-2"
    >
      <legend id={legendId} className="text-fg-secondary mb-1 text-sm">
        {c.form.targets}
      </legend>
      {options.length === 0 ? (
        <p className="text-fg-muted text-sm">{c.form.noTargets}</p>
      ) : (
        <ul className="bg-surface-2 grid max-h-64 gap-2 overflow-y-auto rounded-2xl p-4 sm:grid-cols-2">
          {options.map((o) => (
            <li key={o.value}>
              <Check
                label={o.label}
                disabled={disabled}
                checked={selected.includes(o.value)}
                onChange={(v) =>
                  onChange(v ? [...selected, o.value] : selected.filter((id) => id !== o.value))
                }
              />
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** نمای خالص فرم تخفیف و کوپن. */
export function OfferFormView(p: OfferFormViewProps) {
  const copy = offerCopyOf(p.kind);
  const f = c.form;
  const v = p.values;
  const set = <K extends keyof OfferFormInput>(key: K, value: OfferFormInput[K]) =>
    p.onChange({ ...p.values, [key]: value });
  const isCoupon = p.kind === "coupon";
  const idsScope = v.scopeType === "product" || v.scopeType === "variant";
  const scopeOptions = SCOPE_TYPES.map((s) => ({ value: s, label: c.scopeType[s] }));

  return (
    <form
      noValidate
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        p.onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          {p.mode === "create" ? copy.newTitle : copy.editTitle}
        </h2>
        <Link href={p.backHref} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          {f.back}
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Card title={f.basics}>
            <Input
              label={copy.nameLabel}
              value={v.name}
              maxLength={MAX_NAME}
              error={err(p.errors.name)}
              disabled={p.pending}
              onChange={(e) => set("name", e.target.value)}
            />
            {isCoupon && (
              <Input
                label={f.code}
                ltr
                value={v.code}
                hint={f.codeHint}
                maxLength={30}
                error={err(p.errors.code)}
                disabled={p.pending || p.mode === "edit"}
                onChange={(e) => set("code", e.target.value)}
              />
            )}
          </Card>

          <Card title={f.discountCard}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label={f.kind}
                options={DISCOUNT_KINDS.map((k) => ({ value: k, label: f.kinds[k] }))}
                value={v.kind}
                disabled={p.pending}
                onChange={(e) => set("kind", e.target.value as OfferFormInput["kind"])}
              />
              <Input
                label={v.kind === "percent" ? f.valuePercent : f.valueFixed}
                ltr
                inputMode="numeric"
                value={v.value}
                error={err(p.errors.value)}
                disabled={p.pending}
                onChange={(e) => set("value", e.target.value)}
              />
              <Input
                label={isCoupon ? f.capPercent : f.capDiscount}
                ltr
                inputMode="numeric"
                value={v.cap}
                hint={f.capHint}
                error={err(p.errors.cap)}
                disabled={p.pending}
                onChange={(e) => set("cap", e.target.value)}
              />
              {isCoupon && (
                <Input
                  label={f.minOrder}
                  ltr
                  inputMode="numeric"
                  value={v.minOrder}
                  hint={f.capHint}
                  error={err(p.errors.minOrder)}
                  disabled={p.pending}
                  onChange={(e) => set("minOrder", e.target.value)}
                />
              )}
            </div>
          </Card>

          <Card title={f.scopeCard}>
            <Select
              label={f.scopeTypeLabel}
              options={scopeOptions}
              value={v.scopeType}
              disabled={p.pending}
              onChange={(e) => set("scopeType", e.target.value as ScopeType)}
            />
            {(v.scopeType === "category" || v.scopeType === "brand") && (
              <TargetPicker
                options={v.scopeType === "category" ? p.categories : p.brands}
                selected={v.targetIds}
                disabled={p.pending}
                error={err(p.errors.targetIds)}
                onChange={(ids) => set("targetIds", ids)}
              />
            )}
            {idsScope && (
              <div className="flex flex-col gap-2">
                <label htmlFor="offer-ids" className="text-fg-secondary text-sm">
                  {f.idsLabel}
                </label>
                <textarea
                  id="offer-ids"
                  dir="ltr"
                  rows={5}
                  value={v.idsText}
                  disabled={p.pending}
                  aria-invalid={p.errors.idsText ? true : undefined}
                  onChange={(e) => set("idsText", e.target.value)}
                  className={cn(
                    "bg-surface-2 text-fg focus-visible:outline-brand rounded-2xl p-4 font-mono text-sm focus-visible:outline-2",
                    p.errors.idsText && "border-danger border",
                  )}
                />
                <p
                  className={p.errors.idsText ? "text-danger text-sm" : "text-fg-muted text-sm"}
                  role={p.errors.idsText ? "alert" : undefined}
                >
                  {err(p.errors.idsText) ?? f.idsHint}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title={f.statusCard}>
            <Check
              label={f.isActive}
              checked={v.isActive}
              disabled={p.pending}
              onChange={(x) => set("isActive", x)}
            />
            {isCoupon && (
              <Check
                label={f.applyToDiscounted}
                checked={v.applyToDiscounted}
                disabled={p.pending}
                onChange={(x) => set("applyToDiscounted", x)}
              />
            )}
          </Card>

          <Card title={f.periodCard}>
            <Input
              label={f.startsAt}
              type="datetime-local"
              ltr
              value={v.startsAt}
              error={err(p.errors.startsAt)}
              disabled={p.pending}
              onChange={(e) => set("startsAt", e.target.value)}
            />
            <Input
              label={f.endsAt}
              type="datetime-local"
              ltr
              value={v.endsAt}
              hint={f.dateHint}
              error={err(p.errors.endsAt)}
              disabled={p.pending}
              onChange={(e) => set("endsAt", e.target.value)}
            />
          </Card>

          {isCoupon && (
            <Card title={f.limitsCard}>
              <Input
                label={f.usageTotal}
                ltr
                inputMode="numeric"
                value={v.usageTotal}
                hint={f.limitHint}
                error={err(p.errors.usageTotal)}
                disabled={p.pending}
                onChange={(e) => set("usageTotal", e.target.value)}
              />
              <Input
                label={f.usagePerUser}
                ltr
                inputMode="numeric"
                value={v.usagePerUser}
                hint={f.limitHint}
                error={err(p.errors.usagePerUser)}
                disabled={p.pending}
                onChange={(e) => set("usagePerUser", e.target.value)}
              />
            </Card>
          )}

          {p.usage}
        </div>
      </div>

      {p.formError && (
        <p role="alert" className="text-danger text-sm">
          {p.formError}
        </p>
      )}
      <div>
        <Button type="submit" size="lg" loading={p.pending}>
          {f.save}
        </Button>
      </div>
    </form>
  );
}

export function CouponUsageCard({
  usage,
}: {
  usage: { reserved: number; committed: number; released: number; totalDiscount: string };
}) {
  const u = c.usage;
  const rows: [string, string][] = [
    [u.committed, toPersianDigits(usage.committed)],
    [u.reserved, toPersianDigits(usage.reserved)],
    [u.released, toPersianDigits(usage.released)],
    [u.totalDiscount, usage.totalDiscount],
  ];
  return (
    <Card title={u.title}>
      <dl className="flex flex-col gap-3 text-sm">
        {rows.map(([k, val]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <dt className="text-fg-secondary">{k}</dt>
            <dd className="font-medium">{val}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

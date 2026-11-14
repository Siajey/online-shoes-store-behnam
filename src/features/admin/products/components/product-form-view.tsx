import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { formatPrice, toPersianDigits } from "@/lib/format";
import type { AdminVariant } from "../detail";
import { GENDERS, GENDER_LABEL, type ProductFormErrors, type ProductFormInput } from "../form";
import { productFormCopy as t } from "../form-copy";
import { ACTION_LABEL, STATUS_BADGE, STATUS_LABEL, allowedActions } from "../status";
import type { ProductStatus, StatusAction } from "../types";

export type PublishCardProps = {
  status: ProductStatus;
  busy: boolean;
  error?: string;
  onAction: (action: StatusAction) => void;
};

export type ProductFormViewProps = {
  mode: "create" | "edit";
  values: ProductFormInput;
  errors: ProductFormErrors;
  slugLocked: boolean;
  categories: readonly SelectOption[];
  brands: readonly SelectOption[];
  pending: boolean;
  formError?: string;
  notice?: string;
  /** فقط در حالت ویرایش: وضعیت فعلی و دکمه‌های تغییر وضعیت */
  publish?: PublishCardProps;
  /** کارت تنوع‌ها (فقط‌خواندنی) زیر اطلاعات اصلی */
  variants?: ReactNode;
  onChange: (values: ProductFormInput) => void;
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

function PublishCard({ mode, publish }: { mode: "create" | "edit"; publish?: PublishCardProps }) {
  return (
    <Card title={t.publish}>
      {mode === "edit" && publish ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="text-fg-secondary text-sm">{t.publishStatus}</span>
            <Badge variant={STATUS_BADGE[publish.status]}>{STATUS_LABEL[publish.status]}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedActions(publish.status).map((action) => (
              <Button
                key={action}
                type="button"
                size="sm"
                variant={action === "archive" ? "outline" : "secondary"}
                disabled={publish.busy}
                onClick={() => publish.onAction(action)}
              >
                {ACTION_LABEL[action]}
              </Button>
            ))}
          </div>
          {publish.error && <StateMessage tone="error">{publish.error}</StateMessage>}
        </>
      ) : (
        <p className="text-fg-muted text-sm leading-7">{t.publishNewNote}</p>
      )}
    </Card>
  );
}

export function ProductFormView({
  mode,
  values,
  errors,
  slugLocked,
  categories,
  brands,
  pending,
  formError,
  notice,
  publish,
  variants,
  onChange,
  onSubmit,
}: ProductFormViewProps) {
  const message = (key: keyof ProductFormInput) => {
    const error = errors[key];
    return error ? t.errors[error] : undefined;
  };
  const set = (patch: Partial<ProductFormInput>) => onChange({ ...values, ...patch });

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/products"
          className="text-fg-secondary hover:text-fg focus-visible:outline-brand text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t.back}
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin/products" className={buttonVariants({ variant: "ghost" })}>
            {t.cancel}
          </Link>
          <Button type="submit" disabled={pending}>
            {pending ? t.saving : mode === "create" ? t.create : t.save}
          </Button>
        </div>
      </div>

      {formError && <StateMessage tone="error">{formError}</StateMessage>}
      {notice && <StateMessage>{notice}</StateMessage>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <Card title={t.mainInfo}>
            <Input
              label={t.name}
              value={values.name}
              error={message("name")}
              onChange={(e) => set({ name: e.target.value })}
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="product-description" className="text-fg-secondary text-sm">
                {t.description}
              </label>
              <textarea
                id="product-description"
                rows={5}
                value={values.description}
                aria-invalid={errors.description ? true : undefined}
                onChange={(e) => set({ description: e.target.value })}
                className="bg-surface-2 text-fg border-line focus-visible:outline-brand rounded-3xl border px-5 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2"
              />
              {message("description") && (
                <p role="alert" className="text-danger px-2 text-sm">
                  {message("description")}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label={t.category}
                hint={t.categoryHint}
                options={categories}
                placeholder={t.noCategory}
                value={values.categoryId}
                onChange={(e) => set({ categoryId: e.target.value })}
              />
              <Select
                label={t.brand}
                options={brands}
                placeholder={t.noBrand}
                value={values.brandId}
                onChange={(e) => set({ brandId: e.target.value })}
              />
              <Select
                label={t.gender}
                options={GENDERS.map((g) => ({ value: g, label: GENDER_LABEL[g] }))}
                placeholder={t.genderPlaceholder}
                value={values.gender}
                error={message("gender")}
                onChange={(e) => set({ gender: e.target.value })}
              />
              <Input
                label={t.material}
                value={values.material}
                error={message("material")}
                onChange={(e) => set({ material: e.target.value })}
              />
            </div>
          </Card>
          {variants}
        </div>

        <div className="flex flex-col gap-6">
          <PublishCard mode={mode} publish={publish} />
          <Card title={t.seo}>
            <Input
              label={t.slug}
              hint={slugLocked ? t.slugLocked : t.slugHint}
              ltr
              disabled={slugLocked}
              value={values.slug}
              error={message("slug")}
              onChange={(e) => set({ slug: e.target.value })}
            />
          </Card>
        </div>
      </div>
    </form>
  );
}

const ROW = "grid grid-cols-[1fr_1fr_1fr_1.4fr_1fr] items-center gap-3";

/** تنوع‌ها (فقط‌خواندنی): قیمت و موجودی از سیستم حسابداری می‌آید. */
export function VariantsReadOnly({ variants }: { variants: readonly AdminVariant[] }) {
  const c = t.columns;
  return (
    <section
      aria-labelledby="variants-title"
      className="rounded-card bg-surface flex flex-col gap-4 p-5 lg:p-6"
    >
      <div>
        <h2 id="variants-title" className="text-lg font-medium">
          {t.variantsTitle}
        </h2>
        <p className="text-fg-muted mt-1 text-sm">{t.variantsNote}</p>
      </div>
      {variants.length === 0 ? (
        <StateMessage>{t.variantsEmpty}</StateMessage>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-130">
            <div
              aria-hidden="true"
              className={`${ROW} text-fg-muted border-line border-b pb-3 text-sm`}
            >
              <span>{c.color}</span>
              <span>{c.size}</span>
              <span>{c.stock}</span>
              <span>{c.price}</span>
              <span>{c.status}</span>
            </div>
            <ul className="divide-line divide-y">
              {variants.map((v) => (
                <li key={v.id} className={`${ROW} py-3 text-sm`}>
                  <span>{v.attributes.color ?? "—"}</span>
                  <span>{v.attributes.size ? toPersianDigits(v.attributes.size) : "—"}</span>
                  <span>{toPersianDigits(v.stock)}</span>
                  <span>{formatPrice(v.price, { unit: false })}</span>
                  <span>
                    <Badge variant={v.isActive ? "success" : "neutral"} size="sm">
                      {v.isActive ? t.active : t.inactive}
                    </Badge>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

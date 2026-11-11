import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StateMessage } from "@/components/ui/state-message";
import { taxonomyCopy as t } from "../copy";
import type { AdminBrand, BrandInput } from "../types";
import type { Errors } from "../validation";
import { RowActions } from "./row-actions";

const b = t.brands;

export type BrandListProps = {
  brands: AdminBrand[];
  confirmingId: string | null;
  busyId: string | null;
  onEdit: (brand: AdminBrand) => void;
  onAskDelete: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancel: () => void;
};

export function BrandList({
  brands,
  confirmingId,
  busyId,
  onEdit,
  onAskDelete,
  onConfirmDelete,
  onCancel,
}: BrandListProps) {
  if (brands.length === 0) return <StateMessage>{b.empty}</StateMessage>;
  return (
    <ul className="flex flex-col gap-3">
      {brands.map((brand) => (
        <li
          key={brand.id}
          className="rounded-card bg-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="font-medium">{brand.name}</div>
            <div dir="ltr" className="text-fg-muted mt-1 text-start text-xs">
              {brand.slug}
            </div>
          </div>
          <RowActions
            confirming={confirmingId === brand.id}
            busy={busyId === brand.id}
            confirmText={b.deleteConfirm}
            onEdit={() => onEdit(brand)}
            onAskDelete={() => onAskDelete(brand.id)}
            onConfirmDelete={() => onConfirmDelete(brand.id)}
            onCancel={onCancel}
          />
        </li>
      ))}
    </ul>
  );
}

export type BrandFormProps = {
  editingId: string | null;
  values: BrandInput;
  errors: Errors<BrandInput>;
  formError?: string;
  pending: boolean;
  onChange: (values: BrandInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function BrandForm({
  editingId,
  values,
  errors,
  formError,
  pending,
  onChange,
  onSubmit,
  onCancel,
}: BrandFormProps) {
  const message = (key: keyof BrandInput) => {
    const error = errors[key];
    return error ? t.errors[error] : undefined;
  };
  return (
    <form
      noValidate
      className="rounded-card bg-surface flex flex-col gap-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h3 className="text-lg font-medium">{editingId ? b.editTitle : b.addTitle}</h3>
      <Input
        label={t.name}
        value={values.name}
        error={message("name")}
        onChange={(e) => onChange({ ...values, name: e.target.value })}
      />
      <Input
        label={t.slug}
        hint={t.slugHint}
        ltr
        value={values.slug}
        error={message("slug")}
        onChange={(e) => onChange({ ...values, slug: e.target.value })}
      />
      <Input
        label={b.logoKey}
        hint={b.logoHint}
        ltr
        value={values.logoKey}
        error={message("logoKey")}
        onChange={(e) => onChange({ ...values, logoKey: e.target.value })}
      />
      {formError && <StateMessage tone="error">{formError}</StateMessage>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t.saving : t.save}
        </Button>
        <Button type="button" variant="ghost" disabled={pending} onClick={onCancel}>
          {t.cancel}
        </Button>
      </div>
    </form>
  );
}

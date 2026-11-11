import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { toPersianDigits } from "@/lib/format";
import { taxonomyCopy as t } from "../copy";
import { selfAndDescendantIds, toCategoryRows, type CategoryRow } from "../tree";
import type { AdminCategory, CategoryInput } from "../types";
import type { Errors } from "../validation";
import { RowActions } from "./row-actions";

const c = t.categories;

export type CategoryListProps = {
  rows: CategoryRow[];
  confirmingId: string | null;
  busyId: string | null;
  onEdit: (category: AdminCategory) => void;
  onAskDelete: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancel: () => void;
};

export function CategoryList({
  rows,
  confirmingId,
  busyId,
  onEdit,
  onAskDelete,
  onConfirmDelete,
  onCancel,
}: CategoryListProps) {
  if (rows.length === 0) return <StateMessage>{c.empty}</StateMessage>;
  return (
    <ul className="flex flex-col gap-3">
      {rows.map(({ category, depth }) => (
        <li
          key={category.id}
          style={{ marginInlineStart: `${Math.min(depth, 4) * 1.5}rem` }}
          className="rounded-card bg-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="font-medium">{category.name}</div>
            <div className="text-fg-muted mt-1 text-xs">
              <span dir="ltr">{category.slug}</span> · {toPersianDigits(category.sortOrder)}
            </div>
          </div>
          <RowActions
            confirming={confirmingId === category.id}
            busy={busyId === category.id}
            confirmText={c.deleteConfirm}
            onEdit={() => onEdit(category)}
            onAskDelete={() => onAskDelete(category.id)}
            onConfirmDelete={() => onConfirmDelete(category.id)}
            onCancel={onCancel}
          />
        </li>
      ))}
    </ul>
  );
}

export type CategoryFormProps = {
  editingId: string | null;
  values: CategoryInput;
  errors: Errors<CategoryInput>;
  formError?: string;
  pending: boolean;
  categories: readonly AdminCategory[];
  onChange: (values: CategoryInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function CategoryForm({
  editingId,
  values,
  errors,
  formError,
  pending,
  categories,
  onChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const blocked = editingId ? selfAndDescendantIds(categories, editingId) : new Set<string>();
  const options = toCategoryRows(categories)
    .filter((r) => !blocked.has(r.category.id))
    .map((r) => ({ value: r.category.id, label: `${"— ".repeat(r.depth)}${r.category.name}` }));
  const message = (key: keyof CategoryInput) => {
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
      <h3 className="text-lg font-medium">{editingId ? c.editTitle : c.addTitle}</h3>
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
      <Select
        label={c.parent}
        options={options}
        placeholder={c.noParent}
        value={values.parentId}
        onChange={(e) => onChange({ ...values, parentId: e.target.value })}
      />
      <Input
        label={c.sortOrder}
        hint={c.sortHint}
        ltr
        inputMode="numeric"
        value={values.sortOrder}
        error={message("sortOrder")}
        onChange={(e) => onChange({ ...values, sortOrder: e.target.value })}
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

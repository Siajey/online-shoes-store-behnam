import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { formatPrice, toPersianDigits } from "@/lib/format";
import type { AdminVariant } from "../detail";
import { GENDERS, GENDER_LABEL, type ProductFormErrors, type ProductFormInput } from "../form";
import { productFormCopy as t } from "../form-copy";

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
  onChange: (values: ProductFormInput) => void;
  onSubmit: () => void;
};

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
      className="rounded-card bg-surface flex flex-col gap-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Input
        label={t.name}
        value={values.name}
        error={message("name")}
        onChange={(e) => set({ name: e.target.value })}
      />
      <Input
        label={t.slug}
        hint={slugLocked ? t.slugLocked : t.slugHint}
        ltr
        disabled={slugLocked}
        value={values.slug}
        error={message("slug")}
        onChange={(e) => set({ slug: e.target.value })}
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
      {formError && <StateMessage tone="error">{formError}</StateMessage>}
      {notice && <StateMessage>{notice}</StateMessage>}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? t.saving : mode === "create" ? t.create : t.save}
        </Button>
      </div>
    </form>
  );
}

export function VariantsReadOnly({ variants }: { variants: readonly AdminVariant[] }) {
  return (
    <section aria-labelledby="variants-title" className="flex flex-col gap-3">
      <div>
        <h3 id="variants-title" className="text-lg font-medium">
          {t.variantsTitle}
        </h3>
        <p className="text-fg-muted mt-1 text-sm">{t.variantsNote}</p>
      </div>
      {variants.length === 0 ? (
        <StateMessage>{t.variantsEmpty}</StateMessage>
      ) : (
        <ul className="flex flex-col gap-2">
          {variants.map((v) => (
            <li
              key={v.id}
              className="rounded-card bg-surface flex flex-wrap items-center gap-x-4 gap-y-1 p-4 text-sm"
            >
              <span className="font-medium">{v.title}</span>
              <span className="text-fg-muted">{Object.values(v.attributes).join(" · ")}</span>
              <span>{formatPrice(v.price)}</span>
              <span className="text-fg-muted">
                {t.stock}: {toPersianDigits(v.stock)}
              </span>
              <Badge variant={v.isActive ? "success" : "neutral"} size="sm">
                {v.isActive ? t.active : t.inactive}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

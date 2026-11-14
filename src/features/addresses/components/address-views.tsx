import type { FormEvent, ReactNode } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/layout/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { toPersianDigits } from "@/lib/format";
import { addressCopy } from "../copy";
import { provinceOptions } from "../provinces";
import { MAX_ADDRESSES, type Address, type AddressInput } from "../types";
import { MAX_FIELD_LENGTH, POSTAL_CODE_LENGTH, type AddressErrors } from "../validation";

type CardProps = {
  address: Address;
  /** در حال تأیید حذف؟ */
  confirmingRemove: boolean;
  busy: boolean;
  onEdit: () => void;
  onMakeDefault: () => void;
  onAskRemove: () => void;
  onConfirmRemove: () => void;
  onCancelRemove: () => void;
};

/** کارت یک آدرس با عمل‌ها؛ حذف با تأیید درجا. */
const iconButton =
  "bg-surface-2 text-fg hover:opacity-90 focus-visible:outline-brand flex size-10 items-center justify-center rounded-full transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

export function AddressCard(p: CardProps) {
  const a = p.address;
  return (
    <li
      className={
        "rounded-card bg-surface flex flex-col gap-3 border-2 p-5 " +
        (a.isDefault ? "border-brand" : "border-transparent")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="text-base leading-7 font-medium">
            {a.province}، {a.city}
          </p>
          {a.isDefault && (
            <span className="bg-brand/15 text-brand shrink-0 rounded-full px-3 py-1 text-xs">
              {addressCopy.defaultBadge}
            </span>
          )}
        </div>
        {!p.confirmingRemove && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label={addressCopy.edit}
              disabled={p.busy}
              onClick={p.onEdit}
              className={iconButton}
            >
              <PencilIcon className="size-[18px]" />
            </button>
            <button
              type="button"
              aria-label={addressCopy.remove}
              disabled={p.busy}
              onClick={p.onAskRemove}
              className={iconButton + " text-danger"}
            >
              <TrashIcon className="size-[18px]" />
            </button>
          </div>
        )}
      </div>
      <p className="text-fg-secondary text-sm leading-7">{a.street}</p>
      <p className="text-fg-muted text-sm">
        {addressCopy.postalLine(toPersianDigits(a.postalCode))}
      </p>

      {p.confirmingRemove && (
        <div
          role="alertdialog"
          aria-label={addressCopy.confirmRemove}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-danger text-sm">{addressCopy.confirmRemove}</span>
          <Button size="sm" variant="danger" loading={p.busy} onClick={p.onConfirmRemove}>
            {addressCopy.confirmYes}
          </Button>
          <Button size="sm" variant="ghost" disabled={p.busy} onClick={p.onCancelRemove}>
            {addressCopy.cancel}
          </Button>
        </div>
      )}
      {!p.confirmingRemove && !a.isDefault && (
        <div>
          <Button size="sm" variant="secondary" disabled={p.busy} onClick={p.onMakeDefault}>
            {addressCopy.makeDefault}
          </Button>
        </div>
      )}
    </li>
  );
}

type FormProps = {
  title: string;
  values: AddressInput;
  onChange: (values: AddressInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
  pending: boolean;
  errors: AddressErrors;
  formError?: string;
  /** اسلات نقشه (مثلاً LocationPicker) که بالای فیلدها نمایش داده می‌شود */
  map?: ReactNode;
};

const errorText = (e: AddressErrors[keyof AddressErrors]) =>
  e === "required"
    ? addressCopy.required
    : e === "tooLong"
      ? addressCopy.tooLong(toPersianDigits(MAX_FIELD_LENGTH))
      : e === "postalCode"
        ? addressCopy.invalidPostalCode
        : undefined;

/** نمای خالص فرم افزودن/ویرایش آدرس. */
export function AddressFormView(p: FormProps) {
  const set = (key: keyof AddressInput) => (e: { target: { value: string } }) =>
    p.onChange({ ...p.values, [key]: e.target.value });
  return (
    <form
      noValidate
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        p.onSubmit();
      }}
      className="rounded-card bg-surface flex flex-col gap-4 p-6"
    >
      <h2 className="text-lg font-medium">{p.title}</h2>
      {p.map}
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={addressCopy.province}
          name="province"
          autoComplete="address-level1"
          placeholder={addressCopy.chooseProvince}
          options={provinceOptions(p.values.province)}
          value={p.values.province}
          onChange={set("province")}
          error={errorText(p.errors.province)}
          disabled={p.pending}
        />
        <Input
          label={addressCopy.city}
          name="city"
          autoComplete="address-level2"
          value={p.values.city}
          onChange={set("city")}
          error={errorText(p.errors.city)}
          disabled={p.pending}
        />
      </div>
      <Input
        label={addressCopy.street}
        name="street"
        autoComplete="street-address"
        value={p.values.street}
        onChange={set("street")}
        error={errorText(p.errors.street)}
        disabled={p.pending}
      />
      <Input
        label={addressCopy.postalCode}
        name="postalCode"
        autoComplete="postal-code"
        inputMode="numeric"
        ltr
        maxLength={POSTAL_CODE_LENGTH * 2}
        hint={addressCopy.postalCodeHint}
        value={p.values.postalCode}
        onChange={set("postalCode")}
        error={errorText(p.errors.postalCode)}
        disabled={p.pending}
      />
      {p.formError && (
        <p role="alert" className="text-danger text-sm">
          {p.formError}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" loading={p.pending}>
          {addressCopy.save}
        </Button>
        <Button type="button" variant="ghost" disabled={p.pending} onClick={p.onCancel}>
          {addressCopy.cancel}
        </Button>
      </div>
    </form>
  );
}

type ListProps = {
  addresses: readonly Address[];
  onAdd: () => void;
  /** شناسه‌ی آدرسی که در حال تأیید حذف است */
  renderCard: (address: Address) => ReactNode;
};

function AddTile({ onAdd, className }: { onAdd: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className={
        "rounded-card border-line text-fg-muted hover:text-fg hover:border-brand focus-visible:outline-brand flex min-h-40 w-full flex-col items-center justify-center gap-2 border-2 border-dashed text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none " +
        (className ?? "")
      }
    >
      <PlusIcon className="text-brand size-7" />
      {addressCopy.add}
    </button>
  );
}

/** فهرست آدرس‌ها؛ کاشی خط‌چین «افزودن» تا سقف ۲ آدرس، بعد از آن پیام سقف می‌آید. */
export function AddressListView({ addresses, onAdd, renderCard }: ListProps) {
  const full = addresses.length >= MAX_ADDRESSES;
  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 ? (
        <>
          <StateMessage>
            <p className="text-fg text-base font-medium">{addressCopy.empty}</p>
            <p className="mt-1">{addressCopy.emptyHint}</p>
          </StateMessage>
          <AddTile onAdd={onAdd} />
        </>
      ) : (
        <ul aria-label={addressCopy.listLabel} className="grid gap-3 md:grid-cols-2">
          {addresses.map((a) => renderCard(a))}
          {!full && (
            <li>
              <AddTile onAdd={onAdd} className="h-full" />
            </li>
          )}
        </ul>
      )}
      {full && (
        <p className="text-fg-muted text-sm">{addressCopy.limit(toPersianDigits(MAX_ADDRESSES))}</p>
      )}
    </div>
  );
}

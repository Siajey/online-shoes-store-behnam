import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authCopy } from "../copy";
import { MAX_NAME_LENGTH, type ProfileErrors, type ProfileInput } from "../profile";
import { toPersianDigits } from "@/lib/format";

type Props = {
  values: ProfileInput;
  onChange: (values: ProfileInput) => void;
  onSubmit: () => void;
  pending: boolean;
  errors: ProfileErrors;
  /** خطای کلی (مثلاً قطعی اینترنت) */
  formError?: string;
  saved: boolean;
};

const fieldError = (e: ProfileErrors[keyof ProfileErrors]) =>
  e === "required"
    ? authCopy.nameRequired
    : e === "tooLong"
      ? authCopy.nameTooLong(toPersianDigits(MAX_NAME_LENGTH))
      : undefined;

/** نمای خالص فرم نام و نام خانوادگی. */
export function ProfileFormView({
  values,
  onChange,
  onSubmit,
  pending,
  errors,
  formError,
  saved,
}: Props) {
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
      className="rounded-card bg-surface flex flex-col gap-4 p-6"
    >
      <h2 className="text-lg font-medium">{authCopy.profileTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={authCopy.firstNameLabel}
          name="firstName"
          autoComplete="given-name"
          value={values.firstName}
          onChange={(e) => onChange({ ...values, firstName: e.target.value })}
          error={fieldError(errors.firstName)}
          disabled={pending}
        />
        <Input
          label={authCopy.lastNameLabel}
          name="lastName"
          autoComplete="family-name"
          value={values.lastName}
          onChange={(e) => onChange({ ...values, lastName: e.target.value })}
          error={fieldError(errors.lastName)}
          disabled={pending}
        />
      </div>
      {formError && (
        <p role="alert" className="text-danger text-sm">
          {formError}
        </p>
      )}
      <div role="status" className="text-ok min-h-5 text-sm">
        {saved ? authCopy.profileSaved : null}
      </div>
      <div>
        <Button type="submit" loading={pending}>
          {authCopy.saveProfile}
        </Button>
      </div>
    </form>
  );
}

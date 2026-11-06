"use client";

import { useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { updateProfile } from "../api";
import { authStore } from "../auth-store";
import { authCopy } from "../copy";
import { validateProfile, type ProfileErrors } from "../profile";
import type { User } from "../types";
import { ProfileFormView } from "./profile-form-view";

/** فرم نام و نام خانوادگی؛ بعد از ذخیره، کاربر را دوباره از سرور می‌خواند. */
export function ProfileForm({ user }: { user: User }) {
  const [values, setValues] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit() {
    setSaved(false);
    setFormError(undefined);
    const result = validateProfile(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await updateProfile(result.value);
      await authStore.refresh();
      setValues(result.value);
      setSaved(true);
    } catch (e) {
      setFormError(isApiRequestError(e) ? e.message : authCopy.unknownError);
    } finally {
      setPending(false);
    }
  }

  return (
    <ProfileFormView
      values={values}
      onChange={(v) => {
        setValues(v);
        setSaved(false);
      }}
      onSubmit={submit}
      pending={pending}
      errors={errors}
      formError={formError}
      saved={saved}
    />
  );
}

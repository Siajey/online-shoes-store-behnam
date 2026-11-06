export const MAX_NAME_LENGTH = 20;

export type ProfileInput = { firstName: string; lastName: string };
export type ProfileErrors = Partial<Record<keyof ProfileInput, "required" | "tooLong">>;

export type ProfileValidation =
  { ok: true; value: ProfileInput } | { ok: false; errors: ProfileErrors };

/** نام و نام خانوادگی: هر دو لازم، بدون فاصله‌ی اضافی، حداکثر ۲۰ حرف (طبق بک‌اند). */
export function validateProfile(raw: ProfileInput): ProfileValidation {
  const value = {
    firstName: raw.firstName.trim().replace(/\s+/g, " "),
    lastName: raw.lastName.trim().replace(/\s+/g, " "),
  };
  const errors: ProfileErrors = {};
  for (const key of ["firstName", "lastName"] as const) {
    if (value[key].length === 0) errors[key] = "required";
    else if (value[key].length > MAX_NAME_LENGTH) errors[key] = "tooLong";
  }
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value };
}

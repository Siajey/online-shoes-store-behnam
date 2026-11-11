"use client";

import { useState } from "react";
import { landingCopy } from "../copy";
import { normalizeEmail } from "../newsletter";
import { NewsletterView } from "./newsletter-view";

/**
 * ☐ بک‌اند هنوز API خبرنامه ندارد؛ فعلاً فقط ایمیل بررسی می‌شود و چیزی ارسال نمی‌شود.
 * بعد از آماده شدن API، همین‌جا درخواست ثبت اضافه شود.
 */
export function NewsletterSection() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  return (
    <NewsletterView
      value={value}
      onChange={(next) => {
        setValue(next);
        setError(undefined);
        setNotice(undefined);
      }}
      onSubmit={() => {
        if (!normalizeEmail(value)) {
          setError(landingCopy.newsletterInvalid);
          return;
        }
        setNotice(landingCopy.newsletterSoon);
      }}
      error={error}
      notice={notice}
    />
  );
}

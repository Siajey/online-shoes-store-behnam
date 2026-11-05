import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toPersianDigits } from "@/lib/format";
import { authCopy } from "../copy";
import { formatCountdown } from "../countdown";

const form = "flex flex-col gap-5";

type PhoneStepProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  pending: boolean;
  error?: string;
};

const submitHandler = (fn: () => void) => (event: FormEvent) => {
  event.preventDefault();
  fn();
};

/** مرحله‌ی اول: شماره‌ی موبایل. */
export function PhoneStepView({ value, onChange, onSubmit, pending, error }: PhoneStepProps) {
  return (
    <form onSubmit={submitHandler(onSubmit)} className={form} noValidate>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{authCopy.loginTitle}</h1>
        <p className="text-fg-muted text-sm leading-7">{authCopy.loginSubtitle}</p>
      </div>
      <Input
        label={authCopy.phoneLabel}
        type="tel"
        name="phone"
        inputMode="numeric"
        autoComplete="tel"
        autoFocus
        ltr
        placeholder={authCopy.phonePlaceholder}
        hint={authCopy.phoneHint}
        error={error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={pending}
      />
      <Button type="submit" size="lg" fullWidth loading={pending}>
        {authCopy.sendCode}
      </Button>
    </form>
  );
}

type OtpStepProps = {
  /** شماره‌ی استاندارد ۰۹xxxxxxxxx */
  phone: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  onEditPhone: () => void;
  pending: boolean;
  /** ثانیه‌ی باقی‌مانده تا مجاز شدن ارسال دوباره */
  secondsLeft: number;
  error?: string;
};

/** مرحله‌ی دوم: کد تأیید. */
export function OtpStepView({
  phone,
  value,
  onChange,
  onSubmit,
  onResend,
  onEditPhone,
  pending,
  secondsLeft,
  error,
}: OtpStepProps) {
  return (
    <form onSubmit={submitHandler(onSubmit)} className={form} noValidate>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{authCopy.otpTitle}</h1>
        <p className="text-fg-muted text-sm leading-7">
          {authCopy.otpSubtitle(toPersianDigits(phone))}
        </p>
      </div>
      <Input
        label={authCopy.otpLabel}
        type="text"
        name="otp"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        ltr
        maxLength={12}
        error={error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={pending}
      />
      <Button type="submit" size="lg" fullWidth loading={pending}>
        {authCopy.verify}
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onEditPhone} disabled={pending}>
          {authCopy.editPhone}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResend}
          disabled={pending || secondsLeft > 0}
        >
          {secondsLeft > 0 ? authCopy.resendIn(formatCountdown(secondsLeft)) : authCopy.resend}
        </Button>
      </div>
    </form>
  );
}

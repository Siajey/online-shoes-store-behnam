"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import { requestOtp, resendOtp, verifyOtp } from "../api";
import { authStore } from "../auth-store";
import { RESEND_SECONDS } from "../constants";
import { authCopy } from "../copy";
import { normalizeOtp, normalizePhone } from "../phone";
import { useAuth } from "../use-auth";
import { OtpStepView, PhoneStepView } from "./login-views";

/** پیام قابل‌نمایش از خطای API؛ ۴۲۹ (تعداد زیاد درخواست) متن خودمان را دارد. */
function messageOf(error: unknown): string {
  if (isApiRequestError(error)) {
    return error.status === 429 ? authCopy.tooManyRequests : error.message;
  }
  return authCopy.unknownError;
}

/** شمارنده‌ی معکوس ثانیه‌ای. restart() از عدد داده‌شده دوباره شروع می‌کند. */
function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);
  return [left, setLeft] as const;
}

/** فرم دومرحله‌ای ورود با کد پیامکی. next باید قبلاً با safeNext پاک‌سازی شده باشد. */
export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const auth = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [phone, setPhone] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useCountdown();

  // کاربری که از قبل وارد شده، به مقصد برود.
  useEffect(() => {
    if (auth.status === "authenticated") router.replace(next);
  }, [auth.status, next, router]);

  async function submitPhone() {
    const normalized = normalizePhone(phoneInput);
    if (!normalized) {
      setError(authCopy.phoneInvalid);
      return;
    }
    setError(undefined);
    setPending(true);
    try {
      await requestOtp(normalized);
      setPhone(normalized);
      setOtpInput("");
      setSecondsLeft(RESEND_SECONDS);
      setStep("otp");
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setPending(false);
    }
  }

  async function submitOtp() {
    const code = normalizeOtp(otpInput);
    if (!code) {
      setError(authCopy.otpInvalid);
      return;
    }
    setError(undefined);
    setPending(true);
    try {
      await verifyOtp(phone, code);
      await authStore.refresh();
      if (authStore.getSnapshot().status !== "authenticated") {
        // کد درست بود ولی کوکی ورود برنگشت (مثلاً تنظیم CORS/کوکی)؛ به کاربر بگوییم.
        setError(authCopy.loginIncomplete);
        setPending(false);
        return;
      }
      router.replace(next);
    } catch (e) {
      setError(messageOf(e));
      setPending(false);
    }
  }

  async function resend() {
    if (secondsLeft > 0 || pending) return;
    setError(undefined);
    setPending(true);
    try {
      await resendOtp(phone);
      setSecondsLeft(RESEND_SECONDS);
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setPending(false);
    }
  }

  function editPhone() {
    setError(undefined);
    setOtpInput("");
    setStep("phone");
  }

  return (
    <div className="rounded-card bg-surface mx-auto w-full max-w-md p-6 lg:p-8">
      {step === "phone" ? (
        <PhoneStepView
          value={phoneInput}
          onChange={(v) => {
            setPhoneInput(v);
            setError(undefined);
          }}
          onSubmit={submitPhone}
          pending={pending}
          error={error}
        />
      ) : (
        <OtpStepView
          phone={phone}
          value={otpInput}
          onChange={(v) => {
            setOtpInput(v);
            setError(undefined);
          }}
          onSubmit={submitOtp}
          onResend={resend}
          onEditPhone={editPhone}
          pending={pending}
          secondsLeft={secondsLeft}
          error={error}
        />
      )}
    </div>
  );
}
